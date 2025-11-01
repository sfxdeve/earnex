import prisma from "@earnex/db";
import z from "zod";
import { protectedProcedure } from "..";

export const bankRouter = {
	getAccounts: protectedProcedure
		.input(z.object({ userId: z.string() }))
		.handler(async ({ input }) => {
			const accounts = await prisma.finAccount.findMany({
				where: {
					userId: input.userId,
				},
			});

			return { accounts };
		}),

	getTransactions: protectedProcedure
		.input(z.object({ accountId: z.string() }))
		.handler(async ({ input }) => {
			const transactions = await prisma.transaction.findMany({
				where: {
					finAccountId: input.accountId,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			return { transactions };
		}),

	getInvestments: protectedProcedure
		.input(z.object({ accountId: z.string() }))
		.handler(async ({ input }) => {
			const investments = await prisma.investment.findMany({
				where: {
					finAccountId: input.accountId,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			return { investments };
		}),

	createAccount: protectedProcedure
		.input(z.object({ name: z.string(), type: z.string(), userId: z.string() }))
		.handler(async ({ input }) => {
			return await prisma.finAccount.create({
				data: {
					name: input.name,
					type: input.type,
					user: {
						connect: { id: input.userId },
					},
				},
			});
		}),
	deposit: protectedProcedure
		.input(z.object({ accountId: z.string(), amount: z.number().positive() }))
		.handler(async ({ input }) => {
			const account = await prisma.finAccount.findUnique({
				where: {
					id: input.accountId,
				},
			});

			const transaction = await prisma.transaction.create({
				data: {
					amount: input.amount,
					currency: "USD",
					status: "COMPLETED",
					type: "DEPOSIT",
					finAccount: {
						connect: { id: input.accountId },
					},
				},
			});

			await prisma.finAccount.update({
				where: {
					id: input.accountId,
				},
				data: {
					total: {
						increment: input.amount,
					},
					balance: {
						increment: input.amount,
					},
				},
			});

			return { account, transaction };
		}),

	withdraw: protectedProcedure
		.input(z.object({ accountId: z.string(), amount: z.number().positive() }))
		.handler(async ({ input }) => {
			const account = await prisma.finAccount.findUnique({
				where: {
					id: input.accountId,
				},
			});

			if (!account) {
				throw new Error("Account not found!");
			}

			if (account.balance < input.amount) {
				throw new Error("Insufficient funds!");
			}

			const transaction = await prisma.transaction.create({
				data: {
					amount: input.amount,
					currency: "USD",
					status: "COMPLETED",
					type: "WITHDRAWAL",
					finAccount: {
						connect: { id: input.accountId },
					},
				},
			});

			await prisma.finAccount.update({
				where: {
					id: input.accountId,
				},
				data: {
					total: {
						decrement: input.amount,
					},
					balance: {
						decrement: input.amount,
					},
				},
			});

			return { account, transaction };
		}),

	createInvestment: protectedProcedure
		.input(
			z.object({
				accountId: z.string(),
				name: z.string(),
				amount: z.number().positive(),
			}),
		)
		.handler(async ({ input }) => {
			const account = await prisma.finAccount.findUnique({
				where: {
					id: input.accountId,
				},
			});

			if (!account) {
				throw new Error("Account not found!");
			}

			if (account.balance < input.amount) {
				throw new Error("Insufficient funds!");
			}

			const investment = await prisma.investment.create({
				data: {
					name: input.name,
					amount: input.amount,
					status: "DEPOSITED",
					finAccount: {
						connect: { id: input.accountId },
					},
				},
			});

			await prisma.finAccount.update({
				where: {
					id: input.accountId,
				},
				data: {
					balance: {
						decrement: input.amount,
					},
				},
			});

			return { account, investment };
		}),

	withdrawInvestment: protectedProcedure
		.input(
			z.object({
				investmentId: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			const investment = await prisma.investment.update({
				where: {
					id: input.investmentId,
				},
				data: {
					status: "WITHDRAWN",
				},
			});

			const account = await prisma.finAccount.update({
				where: {
					id: investment.finAccountId,
				},
				data: {
					balance: {
						increment: investment.amount,
					},
				},
			});

			return { account, investment };
		}),
};

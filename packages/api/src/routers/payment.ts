import prisma from "@earnex/db";
import Stripe from "stripe";
import z from "zod";
import { protectedProcedure, publicProcedure } from "..";

// biome-ignore lint/style/noNonNullAssertion: <>
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-10-29.clover",
});

export const paymentRouter = {
	webhook: publicProcedure
		.input(z.object({ body: z.any(), signature: z.string() }))
		.handler(async ({ input }) => {
			let event: Stripe.Event;

			try {
				event = stripe.webhooks.constructEvent(
					input.body,
					input.signature,
					// biome-ignore lint/style/noNonNullAssertion: <>
					process.env.STRIPE_WEBHOOK_SECRET!,
				);
			} catch {
				throw new Error("Invalid webhook signature");
			}

			if (event.type === "payment_intent.succeeded") {
				const payment = event.data.object as Stripe.PaymentIntent;

				const user = await prisma.user.findUnique({
					where: { stripeCustomerId: payment.customer as string },
				});

				if (!user) return;

				const transaction = await prisma.transaction.findUnique({
					where: { stripePaymentIntentId: payment.id },
				});

				if (!transaction) return;

				await prisma.$transaction([
					prisma.transaction.update({
						where: { id: transaction.id },
						data: { status: "COMPLETED" },
					}),

					prisma.user.update({
						where: { id: user.id },
						data: { balanceUsd: { increment: payment.amount / 100 } },
					}),
				]);
			}

			if (event.type === "payout.paid") {
				const payout = event.data.object as Stripe.Payout;

				const tx = await prisma.transaction.findUnique({
					where: { stripePayoutId: payout.id },
				});

				if (!tx) return;

				await prisma.$transaction([
					prisma.transaction.update({
						where: { id: tx.id },
						data: { status: "COMPLETED" },
					}),

					prisma.user.update({
						where: { id: tx.userId },
						data: { balanceUsd: { decrement: tx.amount } },
					}),
				]);
			}

			return { success: true };
		}),

	getTransactions: protectedProcedure.handler(async ({ context }) => {
		const transactions = await prisma.transaction.findMany({
			where: { userId: context.session.user.id },
			orderBy: { createdAt: "desc" },
		});

		return { transactions };
	}),
	depositRequest: protectedProcedure
		.input(
			z.object({
				paymentMethodId: z.string(),
				amount: z.number().positive(),
			}),
		)
		.handler(async ({ input, context }) => {
			const user = await prisma.user.findUniqueOrThrow({
				where: { id: context.session.user.id },
			});

			try {
				const payment = await stripe.paymentIntents.create({
					amount: Math.round(input.amount * 100),
					currency: "usd",
					// biome-ignore lint/style/noNonNullAssertion: <>
					customer: user.stripeCustomerId!,
					payment_method: input.paymentMethodId,
					confirm: true,
					off_session: true,
				});

				const transaction = await prisma.transaction.create({
					data: {
						type: "DEPOSIT",
						status: "PENDING",
						amount: input.amount,
						stripePaymentIntentId: payment.id,
						user: {
							connect: { id: user.id },
						},
					},
				});

				return {
					transaction,
					payment,
				};
			} catch (error) {
				if (error instanceof Stripe.errors.StripeError) {
					throw new Error(error.message);
				}

				throw error;
			}
		}),
	withdrawalRequest: protectedProcedure
		.input(
			z.object({
				paymentMethodId: z.string(),
				amount: z.number().positive(),
			}),
		)
		.handler(async ({ input, context }) => {
			const user = await prisma.user.findUniqueOrThrow({
				where: { id: context.session.user.id },
			});

			if (user.balanceUsd < input.amount) {
				throw new Error("Insufficient balance");
			}

			try {
				const payout = await stripe.payouts.create({
					amount: Math.round(input.amount * 100),
					currency: "usd",
				});

				const transaction = await prisma.transaction.create({
					data: {
						type: "WITHDRAWAL",
						status: "PENDING",
						amount: input.amount,
						stripePayoutId: payout.id,
						user: {
							connect: { id: user.id },
						},
					},
				});

				return {
					transaction,
				};
			} catch (error) {
				if (error instanceof Stripe.errors.StripeError) {
					throw new Error(error.message);
				}

				throw error;
			}
		}),
	getCards: protectedProcedure.handler(async ({ context }) => {
		const cards = await prisma.card.findMany({
			where: { userId: context.session.user.id },
			orderBy: { isDefault: "asc", createdAt: "desc" },
		});

		return { cards };
	}),
	saveCard: protectedProcedure
		.input(
			z.object({
				paymentMethodId: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			try {
				const paymentMethod = await stripe.paymentMethods.retrieve(
					input.paymentMethodId,
				);

				const card = await prisma.card.create({
					data: {
						stripePaymentMethodId: paymentMethod.id,
						// biome-ignore lint/style/noNonNullAssertion: <>
						brand: paymentMethod.card!.brand,
						// biome-ignore lint/style/noNonNullAssertion: <>
						last4: paymentMethod.card!.last4,
						// biome-ignore lint/style/noNonNullAssertion: <>
						expMonth: paymentMethod.card!.exp_month,
						// biome-ignore lint/style/noNonNullAssertion: <>
						expYear: paymentMethod.card!.exp_year,
						user: {
							connect: { id: context.session.user.id },
						},
					},
				});

				return { card };
			} catch (error) {
				if (error instanceof Stripe.errors.StripeError) {
					throw new Error(error.message);
				}

				throw error;
			}
		}),
};

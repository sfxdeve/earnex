import prisma from "@earnex/db";
import z from "zod";
import { protectedProcedure, publicProcedure } from "../index";

export const authRouter = {
	getUsers: protectedProcedure
		.input(
			z.object({
				emailVerified: z.boolean().optional(),
				role: z.string().optional(),
				banned: z.boolean().optional(),
			}),
		)
		.handler(async ({ input }) => {
			return await prisma.user.findMany({
				where: {
					emailVerified: input.emailVerified,
					role: input.role,
					banned: input.banned,
				},
				include: {
					info: true,
				},
			});
		}),
	createInfo: publicProcedure
		.input(
			z.object({
				dob: z.date(),
				phone: z.string(),
				country: z.string(),
				userId: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			return await prisma.info.create({
				data: {
					dob: input.dob,
					phone: input.phone,
					country: input.country,
					user: {
						connect: {
							id: input.userId,
						},
					},
				},
			});
		}),
	updateUser: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
				name: z.string(),
				dob: z.date(),
				phone: z.string(),
				country: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			return await prisma.user.update({
				where: { id: input.userId },
				data: {
					name: input.name,
					info: {
						upsert: {
							create: {
								dob: input.dob,
								phone: input.phone,
								country: input.country,
							},
							update: {
								dob: input.dob,
								phone: input.phone,
								country: input.country,
							},
						},
					},
				},
			});
		}),
	blockUser: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
				reason: z.string().optional(),
				banExpires: z.date().optional(),
			}),
		)
		.handler(async ({ input }) => {
			return await prisma.user.update({
				where: { id: input.userId },
				data: {
					banned: true,
					banReason: input.reason || null,
					banExpires: input.banExpires || null,
				},
			});
		}),
	unblockUser: protectedProcedure
		.input(z.object({ userId: z.string() }))
		.handler(async ({ input }) => {
			return await prisma.user.update({
				where: { id: input.userId },
				data: {
					banned: false,
					banReason: null,
					banExpires: null,
				},
			});
		}),
};

import prisma from "@earnex/db";
import z from "zod";
import { publicProcedure } from "../index";

export const authRouter = {
	createInfo: publicProcedure
		.input(
			z.object({
				phone: z.string(),
				country: z.string(),
				userId: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			return await prisma.info.create({
				data: {
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
};

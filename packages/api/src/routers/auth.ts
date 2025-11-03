import prisma from "@earnex/db";
import z from "zod";
import { publicProcedure } from "../index";

export const authRouter = {
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
};

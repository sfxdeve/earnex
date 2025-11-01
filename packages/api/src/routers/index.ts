import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../index";
import { authRouter } from "./auth";
import { bankRouter } from "./bank";
import { todoRouter } from "./todo";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	auth: authRouter,
	bank: bankRouter,
	todo: todoRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;

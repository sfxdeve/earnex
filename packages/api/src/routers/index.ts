import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../index";
import { bankRouter } from "./bank";
import { todoRouter } from "./todo";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	todo: todoRouter,
	bank: bankRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;

import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../index";
import { bankRouter } from "./bank";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	bank: bankRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;

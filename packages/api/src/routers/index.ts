import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../index";
import { paymentRouter } from "./payment";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	payment: paymentRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;

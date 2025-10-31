export const routes = {
	auth: {
		signUp: "/signup" as const,
		signIn: "/signin" as const,
	},
	protected: {
		dashboard: "/dashboard" as const,
		deposit: "/deposit" as const,
		withdrawal: "/withdrawal" as const,
		trade: "/trade" as const,
		analytics: "/analytics" as const,
	},
};

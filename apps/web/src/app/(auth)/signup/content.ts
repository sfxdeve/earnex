import { routes } from "@/lib/routes";

export const content = {
	brand: "Earnex Global",
	heading: {
		title: "Ready to Start",
		highlight: "Trading?",
	},
	auth: {
		question: "Already have an account?",
		linkText: "Login",
		linkUrl: routes.auth.signIn(),
	},
	footer: {
		text: "Copyright@earnexglobal. All rights reserved. v0.01122387",
	},
};

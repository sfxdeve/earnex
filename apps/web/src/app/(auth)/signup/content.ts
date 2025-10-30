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

	form: {
		heading: "Let’s Get Started!",
		subheading: "Trading your way",
		note: `This information is used for personal verification only and is kept private.
By registering, you agree to our Privacy Policy and Terms of Service.`,
	},

	footer: {
		text: "Copyright © Earnex Global. All rights reserved. v0.01122387",
	},
};

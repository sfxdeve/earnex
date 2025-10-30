import prisma from "@earnex/db";
import { sendEmail } from "@earnex/nodemailer";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth<BetterAuthOptions>({
	database: prismaAdapter(prisma, {
		provider: "mongodb",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			sendEmail({
				to: user.email,
				subject: "Verify your email address",
				text: `Click the link to verify your email: ${url}`,
			});
		},
	},
});

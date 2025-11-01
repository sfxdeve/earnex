import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export async function sendEmail({
	to,
	subject,
	text,
}: {
	to: string;
	subject: string;
	text: string;
}) {
	try {
		const info = await transporter.sendMail({
			from: "Earnex",
			to,
			subject,
			text,
		});

		return info;
	} catch (_) {
		throw new Error("Failed to send email");
	}
}

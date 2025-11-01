import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Providers } from "@/app/providers";
import { sora } from "@/lib/font";
import "../index.css";

export const metadata: Metadata = {
	title: "Earnex",
	description: "Earnex",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${sora.variable} antialiased`}>
				<Providers>
					{/* <div className="grid h-dvh grid-rows-[auto_1fr]">{children}</div> */}
					{children}
				</Providers>
			</body>
		</html>
	);
}

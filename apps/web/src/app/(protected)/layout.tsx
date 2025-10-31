import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Header } from "./_components/header";

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<main>
			<section className={cn("relative flex min-h-dvh flex-col px-24 py-12")}>
				<div
					className={cn("container mx-auto flex flex-1 flex-col space-y-16")}
				>
					<Header />
					{children}
				</div>
			</section>
		</main>
	);
}

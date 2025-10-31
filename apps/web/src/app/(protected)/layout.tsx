import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Header } from "./_components/header";

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<main>
			<section
				className={cn("relative flex min-h-[85dvh] flex-col px-24 py-12")}
			>
				<div className={cn("container mx-auto flex-1")}>
					<Header />
					{children}
				</div>
			</section>
		</main>
	);
}

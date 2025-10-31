"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { content } from "./content";

export default function DashboardPage() {
	const pathname = usePathname();

	return (
		<main>
			<section
				className={cn("relative flex min-h-[85dvh] flex-col px-24 py-12")}
			>
				<div className={cn("container mx-auto flex-1")}>
					<nav className={cn("flex items-center gap-20")}>
						<h1 className={cn("font-bold text-3xl")}>{content.brand}</h1>
						<ul className={cn("flex gap-10")}>
							<li
								className={cn(
									"font-medium text-gray-700 text-lg",
									pathname === routes.protected.dashboard && "text-foreground",
								)}
							>
								<Link href={routes.protected.dashboard}>Dashboard</Link>
							</li>
							<li
								className={cn(
									"font-medium text-gray-700 text-lg",
									pathname === routes.protected.deposit && "text-foreground",
								)}
							>
								<Link href={routes.protected.deposit}>Deposit</Link>
							</li>
							<li
								className={cn(
									"font-medium text-gray-700 text-lg",
									pathname === routes.protected.withdrawal && "text-foreground",
								)}
							>
								<Link href={routes.protected.withdrawal}>Withdrawal</Link>
							</li>
							<li
								className={cn(
									"font-medium text-gray-700 text-lg",
									pathname === routes.protected.analytics && "text-foreground",
								)}
							>
								<Link href={routes.protected.analytics}>Analytics</Link>
							</li>
						</ul>
					</nav>
				</div>
			</section>
		</main>
	);
}

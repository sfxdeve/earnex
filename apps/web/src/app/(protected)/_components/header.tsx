"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function Header() {
	const pathname = usePathname();

	return (
		<header className={cn("flex items-center justify-between gap-6")}>
			<nav className={cn("flex items-center gap-20")}>
				<h1 className={cn("font-bold text-2xl")}>Earnex Global</h1>
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
				</ul>
			</nav>
			<Input className={cn("w-56 rounded-full")} placeholder="Search" />
		</header>
	);
}

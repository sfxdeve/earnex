"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const handleSignOut = async () => {
		try {
			await authClient.signOut();
			router.push(routes.auth.signIn);
			toast.success("Signed out successfully");
		} catch {
			toast.error("Failed to sign out");
		}
	};

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
			<div className={cn("flex items-center gap-4")}>
				<Input className={cn("w-56 rounded-full")} placeholder="Search" />
				{session?.user && (
					<Button
						variant="outline"
						onClick={handleSignOut}
						className={cn("rounded-full")}
					>
						Sign Out
					</Button>
				)}
			</div>
		</header>
	);
}

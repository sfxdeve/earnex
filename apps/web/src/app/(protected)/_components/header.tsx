"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

	const userRole = session?.user?.role?.toUpperCase() || "USER";
	const userImage = session?.user?.image;

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
				{/* Search Input with Icon */}
				<div className={cn("relative")}>
					<Input
						className={cn("w-56 rounded-full pr-10")}
						placeholder="Search"
					/>
					<Search
						className={cn(
							"-translate-y-1/2 absolute top-1/2 right-3 size-4 text-muted-foreground",
						)}
					/>
				</div>

				{/* Notification Button */}
				<Button variant="ghost" size="icon" className={cn("relative")}>
					<Bell className={cn("size-5")} />
					<span
						className={cn(
							"absolute top-1 right-1 size-2 rounded-full bg-blue-500",
						)}
					/>
				</Button>

				{/* User Role */}
				<span className={cn("font-medium text-sm uppercase")}>{userRole}</span>

				{/* Avatar with Dropdown */}
				{session?.user && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className={cn("flex h-auto items-center gap-2 p-0")}
							>
								<div
									className={cn("relative size-8 overflow-hidden rounded-full")}
								>
									{userImage ? (
										<Image
											src={userImage}
											alt={session.user.name || "User"}
											fill
											className={cn("object-cover")}
										/>
									) : (
										<div
											className={cn(
												"flex size-full items-center justify-center bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-300",
											)}
										>
											<span className={cn("font-semibold text-lg text-white")}>
												{session.user.name?.charAt(0).toUpperCase() || "U"}
											</span>
										</div>
									)}
								</div>
								<ChevronDown className={cn("size-4")} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={handleSignOut}
								className={cn("cursor-pointer")}
							>
								Sign Out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</header>
	);
}

"use client";

import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { NativeButton } from "@/components/ui/native-button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
	const isAdmin = session?.user?.role === "admin";
	const userImage = session?.user?.image;

	return (
		<header className={cn("relative flex items-center justify-between gap-4")}>
			<nav className={cn("flex items-center gap-4 sm:gap-10 lg:gap-20")}>
				<h1 className={cn("font-bold text-lg sm:text-xl lg:text-2xl")}>
					Earnex Global
				</h1>
				{/* Desktop Navigation */}
				{!isAdmin && (
					<ul className={cn("hidden items-center gap-6 lg:flex lg:gap-10")}>
						<li
							className={cn(
								"font-medium text-base text-gray-700 lg:text-lg",
								pathname === routes.protected.dashboard && "text-foreground",
							)}
						>
							<Link href={routes.protected.dashboard}>Dashboard</Link>
						</li>
						<li
							className={cn(
								"font-medium text-base text-gray-700 lg:text-lg",
								pathname === routes.protected.deposit && "text-foreground",
							)}
						>
							<Link href={routes.protected.deposit}>Deposit</Link>
						</li>
						<li
							className={cn(
								"font-medium text-base text-gray-700 lg:text-lg",
								pathname === routes.protected.withdrawal && "text-foreground",
							)}
						>
							<Link href={routes.protected.withdrawal}>Withdrawal</Link>
						</li>
					</ul>
				)}
			</nav>
			<div className={cn("flex items-center gap-2 sm:gap-4")}>
				{/* Search Input with Icon - Hidden on mobile */}
				<div className={cn("relative hidden sm:block")}>
					<Input
						className={cn("w-40 rounded-full pr-10 sm:w-56")}
						placeholder="Search"
					/>
					<Search
						className={cn(
							"-translate-y-1/2 absolute top-1/2 right-3 size-4 text-muted-foreground",
						)}
					/>
				</div>

				{/* Notification NativeButton */}
				<NativeButton variant="ghost" size="icon" className={cn("relative")}>
					<Bell className={cn("size-5")} />
					<span
						className={cn(
							"absolute top-1 right-1 size-2 rounded-full bg-blue-500",
						)}
					/>
				</NativeButton>

				{/* User Role - Hidden on small screens */}
				<span className={cn("hidden font-medium text-sm uppercase sm:inline")}>
					{userRole}
				</span>

				{/* Avatar with Dropdown */}
				{session?.user && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<NativeButton
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
								<ChevronDown className={cn("hidden size-4 sm:block")} />
							</NativeButton>
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

				{/* Mobile Menu NativeButton */}
				<Sheet>
					<SheetTrigger asChild>
						<NativeButton
							variant="ghost"
							size="icon"
							className={cn("lg:hidden")}
						>
							<Menu className={cn("size-5")} />
						</NativeButton>
					</SheetTrigger>
					<SheetContent side="left" className={cn("w-[300px] sm:w-[400px]")}>
						<div className={cn("flex flex-col gap-6 px-4 pt-12")}>
							{/* Mobile Search */}
							<div className={cn("relative sm:hidden")}>
								<Input
									className={cn("w-full rounded-md pr-10")}
									placeholder="Search"
								/>
								<Search
									className={cn(
										"-translate-y-1/2 absolute top-1/2 right-3 size-4 text-muted-foreground",
									)}
								/>
							</div>

							{/* Mobile Navigation */}
							{!isAdmin && (
								<ul className={cn("flex flex-col gap-4")}>
									<li>
										<Link
											href={routes.protected.dashboard}
											className={cn(
												"block font-medium text-base",
												pathname === routes.protected.dashboard
													? "text-foreground"
													: "text-gray-700",
											)}
										>
											Dashboard
										</Link>
									</li>
									<li>
										<Link
											href={routes.protected.deposit}
											className={cn(
												"block font-medium text-base",
												pathname === routes.protected.deposit
													? "text-foreground"
													: "text-gray-700",
											)}
										>
											Deposit
										</Link>
									</li>
									<li>
										<Link
											href={routes.protected.withdrawal}
											className={cn(
												"block font-medium text-base",
												pathname === routes.protected.withdrawal
													? "text-foreground"
													: "text-gray-700",
											)}
										>
											Withdrawal
										</Link>
									</li>
								</ul>
							)}

							{/* Mobile User Info */}
							<NativeButton
								variant="outline"
								size="sm"
								onClick={handleSignOut}
								className={cn("w-full cursor-pointer")}
							>
								Sign Out
							</NativeButton>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}

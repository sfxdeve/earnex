"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
	const { isPending, data } = authClient.useSession();

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className={cn("flex flex-1 flex-col justify-between")}>
			<div>
				<div className={cn("flex items-center justify-between")}>
					<h2 className={cn("font-bold text-3xl")}>My Accounts</h2>
					<Button variant="outline" size="lg">
						Open New Account
					</Button>
				</div>
				<Separator className={cn("mt-3 mb-6")} />
				<div className={cn("flex items-end justify-between")}>
					<div className={cn("space-y-10")}>
						<Select defaultValue="sarah-allen">
							<SelectTrigger className="w-56 py-5">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="sarah-allen">Sarah Allen</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>

						<ul className={cn("flex items-center gap-6 text-primary text-xs")}>
							<li>Real</li>
							<li>MT5</li>
							<li>Standard</li>
							<li>#4914786</li>
						</ul>
						<p>
							<span className={cn("font-bold text-5xl")}>110</span>
							<span className={cn("text-xl")}>.92 USD</span>
						</p>
					</div>
					<nav>
						<ul className={cn("flex items-center gap-6")}>
							<li>
								<Link
									className={cn(
										buttonVariants({ variant: "outline", className: "px-8" }),
									)}
									href={routes.protected.deposit}
								>
									Deposit
								</Link>
							</li>
							<li>
								<Link
									className={cn(
										buttonVariants({ variant: "outline", className: "px-8" }),
									)}
									href={routes.protected.withdrawal}
								>
									Withdrawal
								</Link>
							</li>
							<li>
								<Link
									className={cn(
										buttonVariants({ variant: "default", className: "px-8" }),
									)}
									href={routes.protected.trade}
								>
									Trade
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>
			<div className={cn("ml-auto text-right text-gray-400 text-sm")}>
				<p>Email: {data?.user.email}</p>
				<p>&copy; 2009 - 2025. Earnex Global</p>
			</div>
		</div>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
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
			</div>
			<div className={cn("ml-auto text-right text-gray-400 text-sm")}>
				<p>Email: {data?.user.email}</p>
				<p>&copy; 2009 - 2025. Earnex Global</p>
			</div>
		</div>
	);
}

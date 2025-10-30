"use client";

import { Loader } from "@/components/loader";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
	const { isPending } = authClient.useSession();

	if (isPending) {
		return <Loader />;
	}

	return (
		<main>
			<section className={cn("relative flex min-h-screen flex-col p-24")}>
				<div>
					<p className={cn("font-bold text-3xl")}>Dashboard</p>
				</div>
			</section>
		</main>
	);
}

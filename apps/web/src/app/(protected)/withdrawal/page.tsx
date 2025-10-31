"use client";

import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { MethodCard } from "../_components/method-card";

export default function WithdrawalPage() {
	const { isPending, data } = authClient.useSession();

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className={cn("flex flex-1 flex-col justify-between")}>
			<div>
				<div className={cn("flex items-center justify-between")}>
					<h2 className={cn("font-bold text-3xl")}>Withdrawal</h2>
					<Button variant="outline" size="lg">
						Open New Account
					</Button>
				</div>
				<Separator className={cn("mt-3 mb-6")} />
				<div className={cn("space-y-8")}>
					<h3 className={cn("text-sm")}>My saved methods</h3>
					<h3 className={cn("text-sm")}>All payment methods</h3>
					<div className={cn("grid grid-cols-3 gap-6 lg:grid-cols-4")}>
						<MethodCard
							name="BinancePay"
							icon={{
								src: assets.binancePayIcon.src,
								alt: assets.binancePayIcon.alt,
							}}
						/>
						<MethodCard
							name="BinancePay"
							icon={{
								src: assets.binancePayIcon.src,
								alt: assets.binancePayIcon.alt,
							}}
						/>
						<MethodCard
							name="BinancePay"
							icon={{
								src: assets.binancePayIcon.src,
								alt: assets.binancePayIcon.alt,
							}}
						/>
						<MethodCard
							name="BinancePay"
							icon={{
								src: assets.binancePayIcon.src,
								alt: assets.binancePayIcon.alt,
							}}
						/>
						<MethodCard
							name="BinancePay"
							icon={{
								src: assets.binancePayIcon.src,
								alt: assets.binancePayIcon.alt,
							}}
						/>
						<MethodCard
							name="BinancePay"
							icon={{
								src: assets.binancePayIcon.src,
								alt: assets.binancePayIcon.alt,
							}}
						/>
						<MethodCard
							name="BinancePay"
							icon={{
								src: assets.binancePayIcon.src,
								alt: assets.binancePayIcon.alt,
							}}
						/>
						<MethodCard
							name="BinancePay"
							icon={{
								src: assets.binancePayIcon.src,
								alt: assets.binancePayIcon.alt,
							}}
						/>
						<MethodCard
							name="BinancePay"
							icon={{
								src: assets.binancePayIcon.src,
								alt: assets.binancePayIcon.alt,
							}}
						/>
					</div>
				</div>
			</div>
			<div className={cn("ml-auto text-right text-gray-400 text-sm")}>
				<p>Email: {data?.user.email}</p>
				<p>&copy; 2009 - 2025. Earnex Global</p>
			</div>
		</div>
	);
}

"use client";

import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { MethodCard } from "../_components/method-card";

export default function DepositPage() {
	const { isPending, data } = authClient.useSession();

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className={cn("flex flex-1 flex-col justify-between")}>
			<div>
				<div className={cn("flex items-center justify-between")}>
					<h2 className={cn("font-bold text-3xl")}>Deposit</h2>
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
							name="Bank Card"
							icon={{
								src: assets.bankCardIcon.src,
								alt: assets.bankCardIcon.alt,
							}}
						/>
						<MethodCard
							name="Skrill"
							icon={{
								src: assets.skrillIcon.src,
								alt: assets.skrillIcon.alt,
							}}
						/>
						<MethodCard
							name="Bitcoin BTC"
							icon={{
								src: assets.bitcoinBTCIcon.src,
								alt: assets.bitcoinBTCIcon.alt,
							}}
						/>
						<MethodCard
							name="SticPay"
							icon={{
								src: assets.sticPayIcon.src,
								alt: assets.sticPayIcon.alt,
							}}
						/>
						<MethodCard
							name="USD Coin USDC (ERC20)"
							icon={{
								src: assets.usdCoinIcon.src,
								alt: assets.usdCoinIcon.alt,
							}}
						/>
						<MethodCard
							name="Neteller"
							icon={{
								src: assets.netellerIcon.src,
								alt: assets.netellerIcon.alt,
							}}
						/>
						<MethodCard
							name="Perfect Money"
							icon={{
								src: assets.perfectMoneyIcon.src,
								alt: assets.perfectMoneyIcon.alt,
							}}
						/>
						<MethodCard
							name="Tether (USDT ERC20)"
							icon={{
								src: assets.tetherIcon.src,
								alt: assets.tetherIcon.alt,
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

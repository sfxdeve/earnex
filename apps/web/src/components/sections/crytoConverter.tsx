"use client";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { BorderBeam } from "../ui/border-beam";
import { Button } from "../ui/button";
import { TextAnimate } from "../ui/text-animate";

const CryptoConverter: React.FC = () => {
	const [isBuy, setIsBuy] = useState(true);
	const [usd, setUsd] = useState(5000);
	const [btc, setBtc] = useState(0.0455);

	// Conversion constants
	const USD_TO_BTC = 0.0000091; // 1 USD = 0.0000091 BTC
	const BTC_TO_USD = 1 / USD_TO_BTC; // 1 BTC = 109,890.11 USD

	const convertUsdToBtc = (usd: number): number =>
		Number.parseFloat((usd * USD_TO_BTC).toFixed(7)); // 4 decimal places

	const convertBtcToUsd = (btc: number): number =>
		Number.parseFloat((btc * BTC_TO_USD).toFixed(2)); // 2 decimal places

	// Handlers
	const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseFloat(e.target.value) || 0;
		setUsd(value);
		setBtc(convertUsdToBtc(value));
	};

	const handleBtcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseFloat(e.target.value) || 0;
		setBtc(value);
		setUsd(convertBtcToUsd(value));
	};

	return (
		<div className="overflow-hidden px-5 pb-10 sm:py-20">
			<div className="mx-auto mb-12 max-w-[680px] text-center">
				<TextAnimate
					animation="slideUp"
					by="word"
					className={
						"mb-24px font-bold text-[38px] leading-[1.1] md:text-[49px]"
					}
				>
					One click, instant payout with credit or debit card.
				</TextAnimate>
				<p className="md:text-lg lg:text-xl">
					Become a crypto owner in minutes using your debit or credit card and
					quickly purchase top cryptocurrencies.
				</p>
			</div>

			<div className="relative mx-auto max-w-[350px] rounded-2xl bg-[#2F324190] px-8 py-6 backdrop-blur-5xl sm:max-w-[400px]">
				<Image
					src={"/cardImg.svg"}
					fill
					alt=""
					className="-z-10 top-[50px]! left-[-150px]!"
				/>
				{/* Tabs */}
				<div className="mb-6 flex justify-between">
					<button
						onClick={() => setIsBuy(true)}
						className={`grow text-center font-semibold text-lg ${
							isBuy ? "text-[#1A82FF]" : "text-[#5D6588]"
						}`}
					>
						Buy
					</button>
					<div className="mx-2 h-8 w-px bg-[#34384C]" />
					<button
						onClick={() => setIsBuy(false)}
						className={`grow text-center font-semibold text-lg ${
							!isBuy ? "text-[#1A82FF]" : "text-[#5D6588]"
						}`}
					>
						Sell
					</button>
				</div>

				{/* Rate Info */}
				<div className="mt-4 mb-8 text-center">
					<p className="mb-2">1 BTC is roughly</p>
					<p className="font-semibold text-[20px] text-white">
						{BTC_TO_USD.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}{" "}
						<span className="text-[#A5ADCF] text-base">USD</span>
					</p>
				</div>

				{/* Input Fields */}
				<div className="mb-6 flex flex-col gap-6">
					{/* USD Input */}
					<div className="flex h-15 items-center justify-between rounded-full border border-[#34384C] bg-[#2F324180] px-8 py-3">
						<input
							type="number"
							value={usd}
							onChange={handleUsdChange}
							className="w-full bg-transparent font-light text-lg text-white outline-none"
						/>
						<div className="flex items-center gap-1 text-gray-300">
							<Image src="/usdIcon.svg" width={14} height={14} alt="" />
							<span className="font-semibold text-white">USD</span>
						</div>
					</div>

					{/* BTC Input */}
					<div className="flex h-15 items-center justify-between rounded-full border border-[#34384C] bg-[#2F324180] px-8 py-3">
						<input
							type="number"
							value={btc}
							onChange={handleBtcChange}
							className="w-full bg-transparent font-light text-lg text-white outline-none"
						/>
						<div className="flex items-center gap-1 text-gray-300">
							<Image src="/bitcoinIcon.svg" width={28} height={28} alt="" />
							<span className="font-semibold text-white">BTC</span>
						</div>
					</div>
				</div>

				{/* Button */}
				<Button
					variant="default"
					size="default"
					className="w-full rounded-full font-semibold"
				>
					{isBuy ? "Buy Now" : "Sell Now"}
				</Button>
				<BorderBeam
					duration={6}
					size={400}
					className="from-transparent via-[white] to-transparent"
				/>
				<BorderBeam
					duration={6}
					delay={3}
					size={400}
					borderWidth={2}
					className="from-transparent via-[#117fae] to-transparent"
				/>
			</div>

			<div className="mx-auto mt-20 max-w-[490px] px-5">
				<p className="text-center text-[#5D6588]">
					We accept payment with many methods:
				</p>
				<div className="mt-2 flex flex-wrap justify-center gap-8">
					<Image src={"/master.svg"} width={64} height={64} alt="" />
					<Image src={"/visa.svg"} width={64} height={64} alt="" />
					<Image src={"/apple-pay.svg"} width={64} height={64} alt="" />
					<Image src={"/google-pay.svg"} width={64} height={64} alt="" />
					<Image src={"/paypal.svg"} width={64} height={64} alt="" />
				</div>
			</div>
		</div>
	);
};

export default CryptoConverter;

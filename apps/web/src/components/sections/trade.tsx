"use client";
import AOS from "aos";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { TextAnimate } from "../ui/text-animate";
import "aos/dist/aos.css";

interface Stat {
	title: string;
	subtitle: string;
}

const statsData: Stat[] = [
	{ title: "$0 Fee", subtitle: "On Deposits" },
	{ title: "300+", subtitle: "Markets to trade" },
	{ title: "1ms", subtitle: "Execution from" },
	{ title: "24/7", subtitle: "Markets open" },
	{ title: "0.0 Pips", subtitle: "Spread from" },
	{ title: "Trustful", subtitle: "Website" },
];

const Trade = () => {
	useEffect(() => {
		AOS.init({
			duration: 1000, // Duration in milliseconds
		});
	}, []);

	return (
		<div className="fluid-container px-5 pt-20 pb-10">
			<div className="mx-auto max-w-[800px]">
				<TextAnimate
					animation="slideUp"
					by="word"
					className={
						"mb-5 text-center font-semibold text-[38px] md:text-[48px]"
					}
				>
					Trade Anywhere, Anytime.
				</TextAnimate>
				<p className="text-center md:text-lg lg:text-xl">
					4 platforms to choose from —
					<Link
						className="px-1 underline decoration-[#CDCDCD]"
						href="https://afterprime.com/tradingview"
						target="_blank"
					>
						TradingView
					</Link>
					,
					<Link
						className="px-1 underline decoration-[#CDCDCD]"
						href="https://afterprime.com/mt4"
						target="_blank"
					>
						MT4
					</Link>
					,
					<Link
						className="px-1 underline decoration-[#CDCDCD]"
						href="https://afterprime.com/traderevolution"
						target="_blank"
					>
						TraderEvolution
					</Link>
					or
					<Link
						className="px-1 underline decoration-[#CDCDCD]"
						href="https://afterprime.com/fixapi"
						target="_blank"
					>
						FIX API
					</Link>
					. Across all devices — Web, iPhone, Android, Windows and Mac.
				</p>
			</div>

			<div
				className="mx-auto flex max-w-[1000px] flex-wrap justify-center gap-10 py-10 sm:flex-nowrap md:py-20"
				data-aos={"fade-up"}
			>
				<div className="relative block h-[300px] w-[300px] rounded-lg transition-all duration-300 hover:scale-110">
					<Image src={"/tradeImg1.svg"} fill alt="" />
				</div>
				<div className="relative block h-[300px] w-[300px] rounded-lg transition-all duration-300 hover:scale-110">
					<Image src={"/tradeImg2.svg"} fill alt="" />
				</div>
				<div className="relative block h-[300px] w-[300px] rounded-lg transition-all duration-300 hover:scale-110">
					<Image src={"/tradeImg3.svg"} fill alt="" />
				</div>
			</div>

			<div className="flex w-full justify-center px-4">
				<div className="grid w-full max-w-[1200px] grid-cols-1 text-center text-white sm:grid-cols-2 md:grid-cols-3">
					{statsData.map((item, i) => {
						// total items

						return (
							<div
								key={i}
								className={`flex flex-col items-center justify-center border-[#09517180] px-4 py-10 ${(i + 1) % 2 === 0 ? "border-r-0" : "sm:border-r"}
                                ${(i + 1) % 3 === 0 ? "md:border-r-0" : "md:border-r"}
                `}
							>
								<h3 className="font-bold text-[25px]">{item.title}</h3>
								<p className="mt-1 text-gray-300 text-xl">{item.subtitle}</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Trade;

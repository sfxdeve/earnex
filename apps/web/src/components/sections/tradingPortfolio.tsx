"use client";
import AOS from "aos";
import Image from "next/image";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { TextAnimate } from "../ui/text-animate";
import "aos/dist/aos.css";
import Link from "next/link";

const TradingPortfolio = () => {
	useEffect(() => {
		AOS.init({
			duration: 1000, // Duration in milliseconds
		});
	}, []);

	const data = [
		{
			title: "Register",
			description:
				"Signup for an Itrade account and get access to world class pricing.",
			button: true,
		},
		{
			title: "Verify your identity",
			description:
				"Complete the identity verification process to secure your account and transactions.",
			button: false,
		},
		{
			title: "Start trading",
			description:
				"You're good to go! Trade 300+ markets across forex, crypto, stocks, commodities.",
			button: false,
		},
	];

	return (
		<div className="fluid-container grid gap-10 px-5 py-10 lg:grid-cols-2 lg:py-16">
			<div>
				<TextAnimate
					animation="slideUp"
					by="word"
					className={
						"mb-12 text-center font-semibold text-[40px] md:text-[50px] lg:max-w-[530px] lg:text-start lg:text-5xl"
					}
				>
					Start Your Trading Portfolio.
				</TextAnimate>
				{data.map((item, index) => (
					<div
						key={index}
						className="relative mb-8 pl-[60px] sm:pl-[92px] lg:max-w-lg"
					>
						<span className="absolute top-0 left-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#095171]">
							{index + 1}
						</span>
						<h3 className="mb-2 font-semibold text-[25px]">{item.title}</h3>
						<p className="mb-4 font-light md:text-lg lg:max-w-[500px] lg:text-xl">
							{item.description}
						</p>
						{item.button && (
							<Link href={"/signup"}>
								<Button
									variant={"default"}
									size={"default"}
									className="rounded-full!"
								>
									Get Started
								</Button>
							</Link>
						)}
					</div>
				))}
			</div>
			<div className="relative hidden lg:block" data-aos={"fade-left"}>
				<Image
					src={"/build-portfolio-img.svg"}
					alt=""
					fill
					className="lmax-h-[550px] right-0! left-auto! my-auto max-w-[550px]"
				/>
			</div>
		</div>
	);
};

export default TradingPortfolio;

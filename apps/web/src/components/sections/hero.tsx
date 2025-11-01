"use client";
import AOS from "aos";
import Lenis from "lenis";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TextAnimate } from "../ui/text-animate";
import "aos/dist/aos.css";

const Hero = () => {
	const [lenisRef, setLenis] = useState(null);
	const [rafState, setRaf] = useState(null);

	useEffect(() => {
		const scroller = new Lenis();
		let rf;

		function raf(time) {
			scroller.raf(time);
			requestAnimationFrame(raf);
		}

		rf = requestAnimationFrame(raf);
		setRaf(rf);
		setLenis(scroller);

		return () => {
			if (lenisRef) {
				cancelAnimationFrame(rafState);
				lenisRef.destroy();
			}
		};
	}, []);

	useEffect(() => {
		AOS.init({
			duration: 1000,
		});
	}, []);

	const data = [
		{
			style: "1",
			title: "70,000+",
			text: "Active Traders",
		},
		{
			style: "2",
			title: "Multiple Regulatory Licenses",
			maxWidth: "max-w-[250px]",
		},
		{
			style: "2",
			title: "PCI DSS Certified",
			maxWidth: "max-w-[150px]",
		},
		{
			style: "1",
			title: "24/7",
			text: "Customer Support",
		},
	];

	return (
		<div className="relative overflow-hidden">
			<div className="relative overflow-hidden px-5 pt-[150px] pb-[270px] sm:pb-[350px] md:pt-[170px] md:pb-[450px] lg:pt-[200px] lg:pb-[490px]">
				<Image
					src={"/heroBg.png"}
					fill
					alt=""
					className="-z-10 h-[113%]! object-cover object-center"
				/>
				<TextAnimate
					animation="slideUp"
					by="word"
					className={
						"mx-auto max-w-[710px] text-center font-bold text-[40px] leading-[1.2] md:text-[50px] lg:text-[55px]"
					}
				>
					Transform Opportunities into Profits{" "}
				</TextAnimate>
				<p className="mx-auto mt-5 max-w-[625px] text-center text-lg lg:text-xl">
					Trade with the world's largest retail broker and benefit from
					better-than-market conditions.
				</p>
			</div>

			<Image
				src={"/heroImg2.svg"}
				fill
				alt=""
				className="-z-10 top-[150px]! max-h-[752px] sm:top-auto!"
				data-aos={"fade-up"}
			/>

			<div className="flex min-h-[235] w-full flex-col justify-center bg-[#05050580] py-5 backdrop-blur-2xl">
				<div className="mx-auto flex h-full max-w-[1200px] flex-col flex-wrap items-center justify-around gap-x-16 gap-y-10 px-5 sm:flex-row">
					{data.map((item, index) => (
						<div
							key={index}
							className="flex flex-col items-center justify-center gap-4 text-center"
						>
							<h3
								className={`sora font-semibold ${item.style === "1" ? "text-[40px] md:text-[50px] lg:text-[56px]" : "text-2xl"} ${item.maxWidth} `}
							>
								{item.title}
							</h3>
							{item.text && (
								<p className="text-[#CDCDCD] text-lg">{item.text}</p>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Hero;

"use client";
import AOS from "aos";
import { ArrowRight, MoveRightIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TextAnimate } from "../ui/text-animate";
import "aos/dist/aos.css";

const TradingPotential = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		AOS.init({
			duration: 1000, // Duration in milliseconds
		});
	}, []);

	const handleSubmit = (e) => {
		setLoading(true);
		e.preventDefault();
		console.log(email);
		fetch("https://sheetdb.io/api/v1/9riwz6dpixu6c", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				data: [
					{
						Number: "-",
						Newsletter: email,
						Email: "-",
						Interest: "-",
					},
				],
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				setLoading(false);
				setEmail("");
			})
			.catch((error) => console.log(error));
	};

	return (
		<div className="fluid-container grid max-w-[1140px] grid-cols-2 gap-5 overflow-hidden px-5 lg:pt-28 lg:pb-10">
			<div className="col-span-2 flex flex-col items-center gap-8 py-5 text-center md:gap-15 lg:col-span-1 lg:items-start lg:text-start">
				<h2 className="" />
				<TextAnimate
					animation="slideUp"
					by="word"
					className={
						"max-w-[490px] font-semibold text-[38px] leading-[1.3] md:text-5xl"
					}
				>
					Unlock Your Trading Potential
				</TextAnimate>
				<p
					className="max-w-[640px] text-lg lg:text-xl"
					style={{ wordSpacing: "1px" }}
				>
					With real time data and advanced charting tools, You can track your
					portfolio and quickly react to changes in the market.
				</p>
				<form
					onSubmit={(e) => handleSubmit(e)}
					className="relative h-15 w-full max-w-[700px]"
				>
					<input
						placeholder="Enter your email address"
						type="email"
						value={email}
						required
						onChange={(e) => setEmail(e.target.value)}
						className="h-full w-full rounded-full border border-[#FFFFFF59] px-8 py-3 font-sora text-[#FFFFFF8C] outline-none placeholder:text-[#FFFFFF8C] md:text-lg lg:text-xl"
					/>
					<button
						type="submit"
						disabled={loading}
						className="btn-gradient absolute top-0 right-0 flex h-15 w-32 cursor-pointer items-center justify-center gap-3 rounded-full border border-[#FFFFFF59] font-semibold text-black md:w-40 md:text-lg lg:text-xltext-xl"
					>
						Send <MoveRightIcon />
					</button>
				</form>
			</div>
			<div
				className="relative hidden h-full min-h-[664px] w-full max-w-[664px] lg:block"
				data-aos={"fade-left"}
			>
				<div className="ellipse absolute block h-[600px] w-[600px] rounded-full" />
				<Image
					src={"/tradeImg.png"}
					fill
					alt=""
					className="max-h-[550px] max-w-[550px]"
				/>
			</div>
		</div>
	);
};

export default TradingPotential;

"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";

const Footer = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const data = [
		{
			title: "Company",
			links: [
				{ link: "Home" },
				{ link: "About us" },
				{ link: "Services" },
				{ link: "Careers" },
			],
		},
		{
			title: "Resources",
			links: [
				{ link: "Community" },
				{ link: "Video Tutorials" },
				{ link: "API Documentation" },
				{ link: "Security Reports" },
			],
		},
		{
			title: "Help",
			links: [
				{ link: "Customer Support" },
				{ link: "Terms & Conditions" },
				{ link: "Privacy Policy" },
			],
		},
	];

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
		<div className="fluid-container px-5">
			<div className="grid gap-5 py-10 md:grid-cols-2">
				<div>
					<h5 className="mb-5 font-semibold text-2xl">
						Subscribe to Newsletter
					</h5>
					<p className="max-w-[560px] text-[#CDCDCD]">
						Aliquet dignissim erat habitasse aliquet tincidunt phasellus
						ultrices. Aenean sed elit mattis sagittis id velit sed scelerisque.
					</p>
				</div>
				<form
					onSubmit={(e) => handleSubmit(e)}
					className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:justify-end"
				>
					<input
						type="email"
						value={email}
						required
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
						className="h-14 w-full rounded-full bg-white px-10 py-5 text-[#CDCDCD] text-sm outline-none sm:max-w-[330px]"
					/>
					<Button
						type="submit"
						disabled={loading}
						size={"default"}
						variant={"outline"}
						className={
							"w-full rounded-full font-semibold text-[17px] sm:w-auto"
						}
					>
						Subscribe
					</Button>
				</form>
			</div>

			<div className="gredientBorder flex flex-wrap justify-between gap-5 py-10">
				<div className="max-w-[330px]">
					<h3 className="font-semibold text-[32px]">Earnex Global</h3>
					<p className="">
						Euismod libero faucibus egestas elementum scelerisque porta commodo
						purus nam. Ante ac egestas duis.
					</p>
					<div className="my-4 flex gap-2.5">
						<span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#095171]">
							<Image src="/facebook.svg" width={14} height={14} alt="" />
						</span>
						<span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#095171]">
							<Image src="/twitter.svg" width={14} height={14} alt="" />
						</span>
						<span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#095171]">
							<Image src="/linkedin.svg" width={14} height={14} alt="" />
						</span>
						<span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#095171]">
							<Image src="/instagram.svg" width={14} height={14} alt="" />
						</span>
					</div>
				</div>

				<div className="flex grow flex-row flex-wrap justify-between gap-10">
					{data.map((res: any, index: number) => {
						return (
							<div key={index} className="px-3">
								<h6 className="mb-5 font-semibold text-xl">{res.title}</h6>
								{res.links.map((links: any, index: number) => {
									return (
										<p
											key={index}
											className="my-3 w-fit cursor-pointer font-light text-[#CDCDCD] text-[15px]"
										>
											{links.link}
										</p>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>

			<p className="px-5 py-5 text-center">Copyright © 2025 Earnexglobal</p>
		</div>
	);
};

export default Footer;

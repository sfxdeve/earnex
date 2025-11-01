import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { TextAnimate } from "../ui/text-animate";

const About = () => {
	return (
		<div className="fluid-container grid max-w-[1150px] items-center gap-12 px-5 pt-14 pb-10 sm:pb-16 md:grid-cols-2 lg:gap-24 lg:pt-28">
			<div className="relative mx-auto h-full min-h-[400px] w-full max-w-[520px]">
				<Image src={"/aboutImg.png"} fill alt="" />
			</div>
			<div className="col-span-1 mx-auto flex max-w-[470px] flex-col justify-center gap-5 text-center md:min-h-[400px] md:text-start lg:min-h-[520px]">
				<TextAnimate
					animation="slideUp"
					by="word"
					className={"font-semibold text-[38px] md:text-5xl"}
				>
					Diversify your portfolio
				</TextAnimate>

				<p className="text-lg leading-[160%] lg:text-xl">
					Invest in a variety of asset classes — including 20 global stock
					exchanges and 100 cryptocurrencies — while managing all of your
					holdings in one place
				</p>
			</div>

			<div className="mx-auto flex flex-wrap justify-center gap-3 md:col-span-2">
				<Link href={"/signup"}>
					<Button className="" size="default" variant={"destructive"}>
						Register
					</Button>
				</Link>
				<Link href={"/signin"}>
					<Button className="" size="default" variant={"secondary"}>
						Try Free Demo
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default About;

"use client";
import Image from "next/image";
import React from "react";

const logos = [
	{ name: "UBP", url: "/logo1.svg" },
	{ name: "Pictet", url: "/pictet.png" },
	{ name: "IBM", url: "/ibm.png" },
	{ name: "Deutsche Bank", url: "/logo4.svg" },
	{ name: "J. Safra Sarasin", url: "/logo5.svg" },
	{ name: "Intel", url: "/logo6.svg" },
	{ name: "Coutts", url: "/logo7.svg" },
	{ name: "J.P. Morgan", url: "/logo8.svg" },
];

const LogoGrid = () => {
	return (
		<div className="flex w-full flex-col items-center justify-center gap-12 bg-black px-6 py-10">
			<p className="text-center font-semibold text-2xl">
				Your funds are held in top-tier institutions
			</p>

			<div className="gridContainer mx-auto grid w-full max-w-[1200px] grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{logos.map((logo, index) => (
					<div
						key={index}
						className="b relative flex items-center justify-center"
					>
						<div
							className={`flex h-40 w-full items-center justify-center border-[#09517180] py-10 sm:h-60 ${(index + 1) % 2 === 0 ? "" : "border-r"}
                                ${(index + 1) % 3 === 0 ? "md:border-r-0" : "md:border-r"}
                                ${(index + 1) % 4 === 0 ? "lg:border-r-0!" : "lg:border-r"}
                            `}
						>
							<Image
								src={logo.url}
								alt={logo.name}
								width={130}
								height={60}
								className="object-contain"
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default LogoGrid;

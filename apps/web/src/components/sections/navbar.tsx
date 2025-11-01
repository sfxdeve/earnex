"use client";
import { Menu, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

const Navbar = () => {
	const routes = [
		{ title: "Trading", href: "#" },
		{ title: "Markets", href: "#" },
		{ title: "Platforms", href: "#" },
		{ title: "Company", href: "#" },
	];

	const handleSmoothScroll = (e: React.MouseEvent, href: string) => {
		e.preventDefault();
		const targetElement = document.querySelector(href);
		if (targetElement) {
			targetElement.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div className="fluid-container relative">
			<div className="absolute z-50 mt-8 flex w-full items-center justify-between px-5">
				<Link href={"/"}>
					<Image src={"/logo.svg"} alt="logo" width={170} height={34} />
				</Link>
				<div className="hidden items-center gap-[50px] lg:flex">
					{routes.map((res, index) => {
						return (
							<Link
								key={index}
								className="text-white text-xl"
								href={res.href}
								onClick={(e) => handleSmoothScroll(e, res.href)}
							>
								{res.title}
							</Link>
						);
					})}
				</div>
				<div className="hidden gap-3 lg:flex">
					<Link href={"/signup"}>
						<Button className="" variant={"default"} size={"sm"}>
							Register
						</Button>
					</Link>
					<Link href={"/signin"}>
						<Button className="" variant={"outline"} size={"sm"}>
							Sigin in
						</Button>
					</Link>
				</div>
				<div className="block lg:hidden">
					<Sheet>
						<SheetTrigger>
							<Menu size={30} />
						</SheetTrigger>
						<SheetContent className="bg-Surface backdrop-blur-sm">
							<SheetHeader className="">
								<SheetDescription className="flex flex-col pt-20">
									{routes.map((res, index) => {
										return (
											<Link
												key={index}
												className="items-center' flex w-full justify-between border-white border-t px-1 py-2 text-lg text-white"
												href={res.href}
												onClick={(e) => handleSmoothScroll(e, res.href)}
											>
												{res.title}
												<MoveUpRight size={24} className="mt-[2px]" />
											</Link>
										);
									})}
								</SheetDescription>
							</SheetHeader>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</div>
	);
};

export default Navbar;

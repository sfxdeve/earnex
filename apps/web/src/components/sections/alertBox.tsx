"use client";

import { X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

const AlertBox = () => {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState({ email: "", number: "", interest: "" });
	const [loading, setLoading] = useState(false);
	const [active, setActive] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY; // Current scroll position (vertical)
			const documentHeight = document.documentElement.scrollHeight; // Total document height
			const windowHeight = window.innerHeight; // Visible window height

			// Calculate the percentage of the page scrolled
			const scrollPos =
				(currentScrollY / (documentHeight - windowHeight)) * 100;

			scrollPos > 3 && setActive(true);
			scrollPos < 3 && setActive(false);
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setOpen(true);
		}, 10000);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		setLoading(true);

		fetch("https://sheetdb.io/api/v1/9riwz6dpixu6c", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				data: [
					{
						Number: data.number,
						Newsletter: "-",
						Email: data.email,
						Interest: data.interest,
					},
				],
			}),
		})
			.then((response) => response.json())
			.then((res) => {
				setLoading(false);
				setData({ email: "", number: "", interest: "" });
			})
			.catch((error) => console.log(error));
	};

	return (
		<>
			<button
				className={`fixed right-[25px] bottom-[25px] z-100 flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-3xl bg-white text-black transition duration-300 ease-in-out hover:bg-[#2bf568] ${active ? "cursor-pointer opacity-100" : "opacity-0"}`}
				disabled={!active && true}
				onClick={() => {
					window.open("https://t.me/earnexglobal", "_blank");
				}}
			>
				<Image src={"/telegram.png"} fill alt="" />
			</button>
			<AlertDialog open={open}>
				<AlertDialogContent className="mx-auto max-h-[90dvh] w-full max-w-[400px]! overflow-y-auto rounded-2xl border-none bg-[#1b1c24] px-8 py-6 backdrop-blur-5xl">
					<div className="relative">
						<div
							onClick={() => !loading && setOpen(false)}
							className="-top-3 -right-4 absolute flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-[1.5px]"
						>
							<X size={40} className="size-10 max-h-[18px]" />
						</div>
					</div>

					<AlertDialogHeader>
						<AlertDialogDescription className="">
							<form
								onSubmit={(e) => handleSubmit(e)}
								className="mb-5 flex flex-col gap-5"
							>
								<p className="text-center font-semibold text-lg text-white md:text-xl">
									Interested? Let's Talk!
								</p>
								<div className="flex h-15 items-center justify-between rounded-full border border-[#34384C] bg-[#2F324180] px-8 py-3">
									<input
										placeholder="Phone"
										type="text"
										required
										value={data.number}
										onChange={(e) =>
											setData({ ...data, number: e.target.value })
										}
										className="w-full bg-transparent font-light text-lg text-white outline-none"
									/>
								</div>
								<div className="flex h-15 items-center justify-between rounded-full border border-[#34384C] bg-[#2F324180] px-8 py-3">
									<input
										placeholder="Email"
										type="email"
										required
										value={data.email}
										onChange={(e) =>
											setData({ ...data, email: e.target.value })
										}
										className="w-full bg-transparent font-light text-lg text-white outline-none"
									/>
								</div>
								<div className="flex h-15 items-center justify-between rounded-full border border-[#34384C] bg-[#2F324180] px-8 py-3">
									<input
										placeholder="Interest"
										type="text"
										required
										value={data.interest}
										onChange={(e) =>
											setData({ ...data, interest: e.target.value })
										}
										className="w-full bg-transparent font-light text-lg text-white outline-none"
									/>
								</div>
								<Button
									variant="default"
									size="default"
									className="w-full rounded-full font-semibold"
									type="submit"
									disabled={loading}
								>
									Submit
								</Button>
							</form>
						</AlertDialogDescription>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default AlertBox;

"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { TextAnimate } from "../ui/text-animate";

interface MediaItem {
	id: number;
	name: string;
	quote: string;
	logo: string;
}

const mediaData: MediaItem[] = [
	{
		id: 1,
		name: "Forbes",
		quote:
			"Derivative exchange America-based Cryptolly believes they will continue to grow in 2020.",
		logo: "/forbes.svg",
	},
	{
		id: 2,
		name: "EuroNews",
		quote:
			"Earnex Global continues to innovate with secure and transparent trading solutions.",
		logo: "/euronews.svg",
	},
	{
		id: 3,
		name: "Newsweek",
		quote:
			"Earnex Global is redefining modern trading with cutting-edge technology.",
		logo: "/newsweek.svg",
	},
	{
		id: 4,
		name: "Forbes",
		quote:
			"Derivative exchange America-based Cryptolly believes they will continue to grow in 2020.",
		logo: "/forbes.svg",
	},
	{
		id: 5,
		name: "EuroNews",
		quote:
			"Earnex Global continues to innovate with secure and transparent trading solutions.",
		logo: "/euronews.svg",
	},
	{
		id: 6,
		name: "Newsweek",
		quote:
			"Earnex Global is redefining modern trading with cutting-edge technology.",
		logo: "/newsweek.svg",
	},
];

const Testimonial = () => {
	return (
		<div className="fluid-container px-5 py-16">
			<TextAnimate
				animation="slideUp"
				by="word"
				className={
					"fromt-semibold text-center text-[38px] leading-[1.2] md:text-[44px]"
				}
			>
				What media says about
			</TextAnimate>
			<TextAnimate
				animation="slideUp"
				by="word"
				className={
					"mb-16 text-center font-bold text-[42px] leading-[1.2] md:text-[49px]"
				}
			>
				Earnex Global?
			</TextAnimate>

			<span className="" />

			<div className="relative w-full text-center text-white">
				<div className="relative">
					<div
						className="-translate-y-1/2 absolute top-1/2 left-0 z-10 hidden cursor-pointer rounded-full border border-white p-2 sm:block"
						id="media-prev"
					>
						<ChevronLeft size={20} />
					</div>
					<div
						className="-translate-y-1/2 absolute top-1/2 right-0 z-10 hidden cursor-pointer rounded-full border border-white p-2 sm:block"
						id="media-next"
					>
						<ChevronRight size={20} />
					</div>

					{/* Swiper */}
					<Swiper
						modules={[Navigation, Autoplay]}
						navigation={{
							prevEl: "#media-prev",
							nextEl: "#media-next",
						}}
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
						}}
						loop={true}
						centeredSlides={true}
						slidesPerView={1}
						speed={700}
						className="w-full items-center"
						breakpoints={{
							640: {
								slidesPerView: 2.6,
							},
						}}
					>
						{mediaData.map((item) => (
							<SwiperSlide key={item.id}>
								<div className="mx-auto flex w-full max-w-[600px] flex-col items-center justify-center gap-4 rounded-xl p-8 sm:p-10">
									<img
										src={item.logo}
										alt={item.name}
										className="w-[100px] object-contain"
									/>
									<p className="text-[#cfd2e1] text-sm leading-relaxed sm:text-base">
										“{item.quote}”
									</p>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</div>
	);
};

export default Testimonial;

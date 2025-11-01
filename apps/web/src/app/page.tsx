import About from "@/components/sections/about";
import AlertBox from "@/components/sections/alertBox";
import Block from "@/components/sections/block";
import CryptoConverter from "@/components/sections/crytoConverter";
import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import LogoGrid from "@/components/sections/logoGrid";
import Navbar from "@/components/sections/navbar";
import Testimonial from "@/components/sections/testimonial";
import Trade from "@/components/sections/trade";
import TradingPortfolio from "@/components/sections/tradingPortfolio";
import TradingPotential from "@/components/sections/tradingPotential";

export default function Home() {
	return (
		<div className="relative">
			<Navbar />
			<Block />
			<AlertBox />
			<Hero />
			<About />
			<LogoGrid />
			<TradingPotential />
			<Trade />
			<TradingPortfolio />
			<CryptoConverter />
			<Testimonial />
			<Footer />
		</div>
	);
}

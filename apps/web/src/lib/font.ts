import { Sora } from "next/font/google";

export const sora = Sora({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-sora",
	weight: ["400", "500", "600", "700", "800"],
});

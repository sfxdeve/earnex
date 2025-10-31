import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import {
	Card,
	CardAction,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function MethodCard({
	name,
	icon,
}: Readonly<{
	name: string;
	icon: {
		src: string | StaticImport;
		alt: string;
	};
}>) {
	return (
		<Card className={cn("gap-4 border-primary bg-transparent")}>
			<CardHeader>
				<CardTitle>{name}</CardTitle>
				<CardAction>
					<Image src={icon.src} alt={icon.alt} className={cn("size-8")} />
				</CardAction>
			</CardHeader>
			<Separator />
			<CardFooter className={cn("flex-col items-stretch gap-2 text-xs")}>
				<p className={cn("space-x-2")}>
					<span className={cn("text-gray-400")}>Processing Time</span>
					<span>Instant - 30 minutes</span>
				</p>
				<p className={cn("space-x-2")}>
					<span className={cn("text-gray-400")}>Fee</span>
					<span>0%</span>
				</p>
				<p className={cn("space-x-2")}>
					<span className={cn("text-gray-400")}>Limits</span>
					<span>10 - 20,000 USD</span>
				</p>
			</CardFooter>
		</Card>
	);
}

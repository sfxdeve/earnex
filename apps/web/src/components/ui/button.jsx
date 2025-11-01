import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "cursor-pointer bg-[#095171] text-white hover:bg-[#095171]/90",
				destructive:
					"cursor-pointer bg-[#D9D9D9] text-black hover:bg-[#D9D9D9]/90",
				outline:
					"cursor-pointer border border-white text-white transition-all duration-300 hover:bg-white hover:text-black",
				secondary:
					"cursor-pointer bg-[#1D1D1D] text-white hover:bg-[#1D1D1D]/80",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-15 rounded-[8px] px-9 py-4 font-bold text-lg",
				sm: "h-10 rounded-[10px] px-6 font-semibold text-[15px]",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({ className, variant, size, asChild = false, ...props }) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };

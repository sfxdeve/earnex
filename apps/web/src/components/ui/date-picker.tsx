"use client";

import { format } from "date-fns";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
	date?: Date;
	onDateChange?: (date: Date | undefined) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
}

export function DatePicker({
	date,
	onDateChange,
	placeholder = "Pick a date",
	disabled = false,
	className,
	captionLayout = "label",
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-full justify-start bg-transparent text-left font-normal hover:bg-transparent",
						!date && "text-muted-foreground",
						className,
					)}
					disabled={disabled}
				>
					{date ? format(date, "PPP") : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					captionLayout={captionLayout}
					onSelect={(selectedDate) => {
						onDateChange?.(selectedDate);
						setOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}

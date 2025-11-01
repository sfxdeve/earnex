"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

export default function DashboardPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { isPending: sessionPending, data: sessionData } =
		authClient.useSession();
	const {
		data: bankData,
		isLoading: bankLoading,
		refetch: refetchAccounts,
	} = useQuery(
		orpc.bank.getAccounts.queryOptions({
			input: { userId: sessionData?.user.id || "" },
			enabled: !!sessionData?.user.id,
		}),
	);
	const createAccountMutation = useMutation(
		orpc.bank.createAccount.mutationOptions({
			onSuccess: () => {
				setIsDialogOpen(false);
				form.reset();
				refetchAccounts();
				toast.success("Account created successfully");
			},
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to create account");
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			name: "",
			type: "",
		},
		onSubmit: async ({ value }) => {
			if (!sessionData?.user.id) {
				toast.error("User not authenticated");
				return;
			}
			createAccountMutation.mutate({
				name: value.name,
				type: value.type,
				userId: sessionData.user.id,
			} as {
				name: string;
				type: string;
				userId: string;
			});
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Account name must be at least 2 characters"),
				type: z.string().min(2, "Account type must be at least 2 characters"),
			}),
		},
	});

	if (sessionPending || bankLoading) {
		return <Loader />;
	}

	return (
		<div className={cn("flex flex-1 flex-col justify-between")}>
			<div>
				<div className={cn("flex items-center justify-between")}>
					<h2 className={cn("font-bold text-3xl")}>My Accounts</h2>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button variant="outline" size="lg">
								Open New Account
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New Account</DialogTitle>
							</DialogHeader>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}}
								className="space-y-4"
							>
								<form.Field name="name">
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>Account Name</Label>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Enter account name"
											/>
											{field.state.meta.errors.map((error, index) => (
												<p
													key={`${field.name}-error-${index}`}
													className="text-red-500 text-sm"
												>
													{String(error?.message || "Invalid value")}
												</p>
											))}
										</div>
									)}
								</form.Field>
								<form.Field name="type">
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>Account Type</Label>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Enter account type"
											/>
											{field.state.meta.errors.map((error, index) => (
												<p
													key={`${field.name}-error-${index}`}
													className="text-red-500 text-sm"
												>
													{String(error?.message || "Invalid value")}
												</p>
											))}
										</div>
									)}
								</form.Field>
								<form.Subscribe>
									{(state) => (
										<div className="flex justify-end">
											<Button
												type="submit"
												disabled={
													!state.canSubmit ||
													state.isSubmitting ||
													createAccountMutation.isPending
												}
											>
												{state.isSubmitting || createAccountMutation.isPending
													? "Creating..."
													: "Create Account"}
											</Button>
										</div>
									)}
								</form.Subscribe>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				<Separator className={cn("mt-3 mb-6")} />
				<div className={cn("flex items-end justify-between")}>
					<div className={cn("space-y-10")}>
						<Select defaultValue={bankData?.accounts[0]?.id}>
							<SelectTrigger className="w-56 py-5">
								<SelectValue placeholder="Select an account" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{bankData?.accounts.map((account) => (
										<SelectItem key={account.id} value={account.id}>
											{account.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>

						{bankData?.accounts[0] && (
							<>
								<ul
									className={cn("flex items-center gap-6 text-primary text-xs")}
								>
									<li>Real</li>
									<li>MT5</li>
									<li>Standard</li>
									<li>#4914786</li>
								</ul>
								<p>
									<span className={cn("font-bold text-5xl")}>
										{bankData.accounts[0].balance || 0}
									</span>
									<span className={cn("text-xl")}> USD</span>
								</p>
							</>
						)}
					</div>
					<nav>
						<ul className={cn("flex items-center gap-6")}>
							<li>
								<Link
									className={cn(
										buttonVariants({ variant: "outline", className: "px-8" }),
									)}
									href={routes.protected.deposit}
								>
									Deposit
								</Link>
							</li>
							<li>
								<Link
									className={cn(
										buttonVariants({ variant: "outline", className: "px-8" }),
									)}
									href={routes.protected.withdrawal}
								>
									Withdrawal
								</Link>
							</li>
							<li>
								<Link
									className={cn(
										buttonVariants({ variant: "default", className: "px-8" }),
									)}
									href={routes.protected.trade}
								>
									Trade
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>
			<div className={cn("ml-auto text-right text-gray-400 text-sm")}>
				<p>Email: {sessionData?.user.email}</p>
				<p>&copy; 2009 - 2025. Earnex Global</p>
			</div>
		</div>
	);
}

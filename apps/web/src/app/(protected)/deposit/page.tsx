"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { assets } from "@/assets";
import { NativeButton } from "@/components/ui/native-button";
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
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";
import { MethodCard } from "../_components/method-card";

export default function DepositPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { isPending: sessionPending, data: sessionData } =
		authClient.useSession();
	const {
		data: _bankData,
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
		<div className={cn("flex flex-1 flex-col justify-between gap-4")}>
			<div>
				<div
					className={cn(
						"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					)}
				>
					<h2 className={cn("font-bold text-2xl sm:text-3xl")}>Deposit</h2>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<NativeButton
								variant="outline"
								size="lg"
								className={cn("w-full sm:w-auto")}
							>
								Open New Account
							</NativeButton>
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
											<NativeButton
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
											</NativeButton>
										</div>
									)}
								</form.Subscribe>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				<Separator className={cn("mt-3 mb-6")} />
				<div className={cn("space-y-8")}>
					<h3 className={cn("text-sm")}>All payment methods</h3>
					<div
						className={cn(
							"grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
						)}
					>
						<MethodCard
							name="BinancePay"
							icon={{
								src: assets.binancePayIcon.src,
								alt: assets.binancePayIcon.alt,
							}}
						/>
						<MethodCard
							name="Bank Card"
							icon={{
								src: assets.bankCardIcon.src,
								alt: assets.bankCardIcon.alt,
							}}
						/>
						<MethodCard
							name="Skrill"
							icon={{
								src: assets.skrillIcon.src,
								alt: assets.skrillIcon.alt,
							}}
						/>
						<MethodCard
							name="Bitcoin BTC"
							icon={{
								src: assets.bitcoinBTCIcon.src,
								alt: assets.bitcoinBTCIcon.alt,
							}}
						/>
						<MethodCard
							name="SticPay"
							icon={{
								src: assets.sticPayIcon.src,
								alt: assets.sticPayIcon.alt,
							}}
						/>
						<MethodCard
							name="USD Coin USDC (ERC20)"
							icon={{
								src: assets.usdCoinIcon.src,
								alt: assets.usdCoinIcon.alt,
							}}
						/>
						<MethodCard
							name="Neteller"
							icon={{
								src: assets.netellerIcon.src,
								alt: assets.netellerIcon.alt,
							}}
						/>
						<MethodCard
							name="Perfect Money"
							icon={{
								src: assets.perfectMoneyIcon.src,
								alt: assets.perfectMoneyIcon.alt,
							}}
						/>
						<MethodCard
							name="Tether (USDT ERC20)"
							icon={{
								src: assets.tetherIcon.src,
								alt: assets.tetherIcon.alt,
							}}
						/>
					</div>
				</div>
			</div>
			<div
				className={cn(
					"mt-8 text-left text-gray-400 text-sm sm:ml-auto sm:text-right",
				)}
			>
				<p>Email: {sessionData?.user.email}</p>
				<p>&copy; 2009 - 2025. Earnex Global</p>
			</div>
		</div>
	);
}

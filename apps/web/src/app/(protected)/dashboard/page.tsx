"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
	NativeButton,
	nativeNativeButtonVariants,
} from "@/components/ui/native-button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import { cn, formatAmount } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

export default function DashboardPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedAccountId, setSelectedAccountId] = useState<string>("");

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

	const { data: transactionsData, isLoading: transactionsLoading } = useQuery(
		orpc.bank.getTransactions.queryOptions({
			input: { accountId: selectedAccountId },
			enabled: !!selectedAccountId,
		}),
	);

	const { data: investmentsData, isLoading: investmentsLoading } = useQuery(
		orpc.bank.getInvestments.queryOptions({
			input: { accountId: selectedAccountId },
			enabled: !!selectedAccountId,
		}),
	);

	useEffect(() => {
		if (
			bankData?.accounts &&
			bankData.accounts.length > 0 &&
			!selectedAccountId
		) {
			setSelectedAccountId(bankData.accounts[0].id);
		}
	}, [bankData?.accounts, selectedAccountId]);

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
					<h2 className={cn("font-bold text-2xl sm:text-3xl")}>My Accounts</h2>
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
				<div
					className={cn(
						"flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between",
					)}
				>
					<div className={cn("space-y-6 sm:space-y-10")}>
						<Select
							value={selectedAccountId}
							onValueChange={setSelectedAccountId}
						>
							<SelectTrigger className="w-full py-5 sm:w-56">
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

						{selectedAccountId &&
							(() => {
								const selectedAccount = bankData?.accounts.find(
									(account) => account.id === selectedAccountId,
								);
								return (
									selectedAccount && (
										<>
											<ul
												className={cn(
													"flex flex-wrap items-center gap-4 text-primary text-xs sm:gap-6",
												)}
											>
												<li>Real</li>
												<li>MT5</li>
												<li>Standard</li>
												<li>#4914786</li>
											</ul>
											<p>
												<span
													className={cn(
														"font-bold text-3xl sm:text-4xl lg:text-5xl",
													)}
												>
													{formatAmount(selectedAccount.balance)}
												</span>
												<span className={cn("text-lg sm:text-xl")}> USD</span>
											</p>
										</>
									)
								);
							})()}
					</div>
					<nav>
						<ul className={cn("flex flex-wrap items-center gap-3 sm:gap-6")}>
							<li>
								<Link
									className={cn(
										nativeNativeButtonVariants({
											variant: "outline",
											className: "w-full px-6 sm:w-auto sm:px-8",
										}),
									)}
									href={routes.protected.deposit}
								>
									Deposit
								</Link>
							</li>
							<li>
								<Link
									className={cn(
										nativeNativeButtonVariants({
											variant: "outline",
											className: "w-full px-6 sm:w-auto sm:px-8",
										}),
									)}
									href={routes.protected.withdrawal}
								>
									Withdrawal
								</Link>
							</li>
							<li>
								<Link
									className={cn(
										nativeNativeButtonVariants({
											variant: "default",
											className: "w-full px-6 sm:w-auto sm:px-8",
										}),
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

			{selectedAccountId && (
				<Tabs defaultValue="transactions" className={cn("w-full flex-1")}>
					<TabsList>
						<TabsTrigger value="transactions">Transactions</TabsTrigger>
						<TabsTrigger value="investments">Investments</TabsTrigger>
					</TabsList>

					<TabsContent value="transactions" className={cn("mt-4")}>
						{transactionsLoading ? (
							<div className={cn("flex justify-center py-8")}>
								<Loader />
							</div>
						) : transactionsData?.transactions.length === 0 ? (
							<p className={cn("text-muted-foreground text-sm")}>
								No transactions found
							</p>
						) : (
							<div
								className={cn(
									"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
								)}
							>
								{transactionsData?.transactions.map((transaction) => (
									<Card
										key={transaction.id}
										className={cn("gap-4 border-primary bg-transparent")}
									>
										<CardHeader>
											<CardTitle className={cn("text-lg")}>
												{transaction.type}
											</CardTitle>
										</CardHeader>
										<Separator />
										<CardFooter
											className={cn("flex-col items-stretch gap-2 text-xs")}
										>
											<p className={cn("space-x-2")}>
												<span className={cn("text-gray-400")}>Amount</span>
												<span className={cn("font-semibold")}>
													${formatAmount(transaction.amount)}{" "}
													{transaction.currency}
												</span>
											</p>
											<p className={cn("space-x-2")}>
												<span className={cn("text-gray-400")}>Status</span>
												<span className={cn("uppercase")}>
													{transaction.status}
												</span>
											</p>
											<p className={cn("space-x-2")}>
												<span className={cn("text-gray-400")}>Date</span>
												<span>
													{new Date(transaction.createdAt).toLocaleString()}
												</span>
											</p>
										</CardFooter>
									</Card>
								))}
							</div>
						)}
					</TabsContent>

					<TabsContent value="investments" className={cn("mt-4")}>
						{investmentsLoading ? (
							<div className={cn("flex justify-center py-8")}>
								<Loader />
							</div>
						) : investmentsData?.investments.length === 0 ? (
							<p className={cn("text-muted-foreground text-sm")}>
								No investments found
							</p>
						) : (
							<div
								className={cn(
									"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
								)}
							>
								{investmentsData?.investments.map((investment) => (
									<Card
										key={investment.id}
										className={cn("gap-4 border-primary bg-transparent")}
									>
										<CardHeader>
											<CardTitle className={cn("text-lg")}>
												{investment.name}
											</CardTitle>
										</CardHeader>
										<Separator />
										<CardFooter
											className={cn("flex-col items-stretch gap-2 text-xs")}
										>
											<p className={cn("space-x-2")}>
												<span className={cn("text-gray-400")}>Amount</span>
												<span className={cn("font-semibold")}>
													${formatAmount(investment.amount)}
												</span>
											</p>
											<p className={cn("space-x-2")}>
												<span className={cn("text-gray-400")}>Status</span>
												<span className={cn("uppercase")}>
													{investment.status}
												</span>
											</p>
											<p className={cn("space-x-2")}>
												<span className={cn("text-gray-400")}>Date</span>
												<span>
													{new Date(investment.createdAt).toLocaleString()}
												</span>
											</p>
										</CardFooter>
									</Card>
								))}
							</div>
						)}
					</TabsContent>
				</Tabs>
			)}

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

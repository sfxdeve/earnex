"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { NativeButton } from "@/components/ui/native-button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { cn, formatAmount } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

export default function AdminTransactionsPage() {
	const searchParams = useSearchParams();
	const [selectedUserId, setSelectedUserId] = useState<string>("");
	const [selectedAccountId, setSelectedAccountId] = useState<string>("");
	const [depositOpen, setDepositOpen] = useState(false);
	const [withdrawOpen, setWithdrawOpen] = useState(false);
	const [createInvestmentOpen, setCreateInvestmentOpen] = useState(false);

	const [depositForm, setDepositForm] = useState({ amount: "" });
	const [withdrawForm, setWithdrawForm] = useState({ amount: "" });
	const [investmentForm, setInvestmentForm] = useState({
		name: "",
		amount: "",
	});

	const { isPending: sessionPending, data: sessionData } =
		authClient.useSession();

	// Initialize from URL params
	useEffect(() => {
		const userId = searchParams.get("userId");
		const accountId = searchParams.get("accountId");
		if (userId) setSelectedUserId(userId);
		if (accountId) setSelectedAccountId(accountId);
	}, [searchParams]);

	// Fetch accounts for selected user
	const { data: accountsData, refetch: refetchAccounts } = useQuery(
		orpc.bank.getAccounts.queryOptions({
			input: { userId: selectedUserId },
			enabled: !!selectedUserId,
		}),
	);

	// Fetch transactions for selected account
	const {
		data: transactionsData,
		isLoading: transactionsLoading,
		refetch: refetchTransactions,
	} = useQuery(
		orpc.bank.getTransactions.queryOptions({
			input: { accountId: selectedAccountId },
			enabled: !!selectedAccountId,
		}),
	);

	// Fetch investments for selected account
	const {
		data: investmentsData,
		isLoading: investmentsLoading,
		refetch: refetchInvestments,
	} = useQuery(
		orpc.bank.getInvestments.queryOptions({
			input: { accountId: selectedAccountId },
			enabled: !!selectedAccountId,
		}),
	);

	// Mutations
	const depositMutation = useMutation(
		orpc.bank.deposit.mutationOptions({
			onSuccess: () => {
				toast.success("Deposit successful");
				setDepositOpen(false);
				setDepositForm({ amount: "" });
				refetchAccounts();
				refetchTransactions();
			},
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to deposit");
			},
		}),
	);

	const withdrawMutation = useMutation(
		orpc.bank.withdraw.mutationOptions({
			onSuccess: () => {
				toast.success("Withdrawal successful");
				setWithdrawOpen(false);
				setWithdrawForm({ amount: "" });
				refetchAccounts();
				refetchTransactions();
			},
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to withdraw");
			},
		}),
	);

	const createInvestmentMutation = useMutation(
		orpc.bank.createInvestment.mutationOptions({
			onSuccess: () => {
				toast.success("Investment created successfully");
				setCreateInvestmentOpen(false);
				setInvestmentForm({ name: "", amount: "" });
				refetchAccounts();
				refetchInvestments();
			},
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to create investment");
			},
		}),
	);

	const withdrawInvestmentMutation = useMutation(
		orpc.bank.withdrawInvestment.mutationOptions({
			onSuccess: () => {
				toast.success("Investment withdrawn successfully");
				refetchAccounts();
				refetchInvestments();
			},
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to withdraw investment");
			},
		}),
	);

	if (sessionPending) {
		return <Loader />;
	}

	if (!selectedUserId || !selectedAccountId) {
		return (
			<div className={cn("flex flex-1 flex-col items-center justify-center")}>
				<p className={cn("text-muted-foreground")}>
					Please select a user and account from the admin page
				</p>
			</div>
		);
	}

	const accounts = accountsData?.accounts || [];
	const transactions = transactionsData?.transactions || [];
	const investments = investmentsData?.investments || [];
	const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

	return (
		<div className={cn("flex flex-1 flex-col justify-between gap-4")}>
			<div>
				<div className={cn("flex items-center justify-between")}>
					<h2 className={cn("font-bold text-2xl sm:text-3xl")}>
						Transaction & Investment Management
					</h2>
				</div>
				<Separator className={cn("mt-3 mb-6")} />

				<div className={cn("space-y-6")}>
					{/* Account Summary and Actions Side by Side */}
					{selectedAccount && selectedAccountId && (
						<div
							className={cn("flex flex-col gap-4 sm:flex-row sm:items-start")}
						>
							{/* Account Info */}
							<div className={cn("flex-1 rounded-lg border p-4")}>
								<h4 className={cn("mb-2 font-semibold")}>
									{selectedAccount.name}
								</h4>
								<div className={cn("grid grid-cols-2 gap-4 text-sm")}>
									<div>
										<span className={cn("text-gray-400")}>Balance:</span>
										<span className={cn("ml-2 font-semibold")}>
											${formatAmount(selectedAccount.balance)}
										</span>
									</div>
									<div>
										<span className={cn("text-gray-400")}>Total:</span>
										<span className={cn("ml-2 font-semibold")}>
											${formatAmount(selectedAccount.total)}
										</span>
									</div>
									<div className={cn("col-span-2")}>
										<span className={cn("text-gray-400")}>Type:</span>
										<span className={cn("ml-2 font-semibold")}>
											{selectedAccount.type || "N/A"}
										</span>
									</div>
								</div>
							</div>

							{/* Account Actions */}
							<div className={cn("flex flex-col gap-2 sm:w-48")}>
								<Dialog
									open={depositOpen}
									onOpenChange={(open) => {
										setDepositOpen(open);
										if (!open) setDepositForm({ amount: "" });
									}}
								>
									<DialogTrigger asChild>
										<NativeButton variant="outline" className={cn("w-full")}>
											Deposit
										</NativeButton>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Make Deposit</DialogTitle>
										</DialogHeader>
										<form
											onSubmit={(e) => {
												e.preventDefault();
												const amount = Number.parseFloat(depositForm.amount);
												if (Number.isNaN(amount) || amount <= 0) {
													toast.error("Please enter a valid amount");
													return;
												}
												depositMutation.mutate({
													accountId: selectedAccountId,
													amount,
												});
											}}
											className="space-y-4"
										>
											<div className="space-y-2">
												<Label htmlFor="deposit-amount">Amount</Label>
												<Input
													id="deposit-amount"
													type="number"
													step="0.01"
													min="0"
													value={depositForm.amount}
													onChange={(e) =>
														setDepositForm({ amount: e.target.value })
													}
													placeholder="Enter amount"
													required
												/>
											</div>
											<div className="flex justify-end gap-2 pt-4">
												<NativeButton
													type="button"
													variant="outline"
													onClick={() => setDepositOpen(false)}
													disabled={depositMutation.isPending}
												>
													Cancel
												</NativeButton>
												<NativeButton
													type="submit"
													disabled={depositMutation.isPending}
												>
													{depositMutation.isPending
														? "Processing..."
														: "Deposit"}
												</NativeButton>
											</div>
										</form>
									</DialogContent>
								</Dialog>
								<Dialog
									open={withdrawOpen}
									onOpenChange={(open) => {
										setWithdrawOpen(open);
										if (!open) setWithdrawForm({ amount: "" });
									}}
								>
									<DialogTrigger asChild>
										<NativeButton variant="outline" className={cn("w-full")}>
											Withdraw
										</NativeButton>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Make Withdrawal</DialogTitle>
										</DialogHeader>
										<form
											onSubmit={(e) => {
												e.preventDefault();
												const amount = Number.parseFloat(withdrawForm.amount);
												if (Number.isNaN(amount) || amount <= 0) {
													toast.error("Please enter a valid amount");
													return;
												}
												withdrawMutation.mutate({
													accountId: selectedAccountId,
													amount,
												});
											}}
											className="space-y-4"
										>
											<div className="space-y-2">
												<Label htmlFor="withdraw-amount">Amount</Label>
												<Input
													id="withdraw-amount"
													type="number"
													step="0.01"
													min="0"
													value={withdrawForm.amount}
													onChange={(e) =>
														setWithdrawForm({ amount: e.target.value })
													}
													placeholder="Enter amount"
													required
												/>
											</div>
											<div className="flex justify-end gap-2 pt-4">
												<NativeButton
													type="button"
													variant="outline"
													onClick={() => setWithdrawOpen(false)}
													disabled={withdrawMutation.isPending}
												>
													Cancel
												</NativeButton>
												<NativeButton
													type="submit"
													disabled={withdrawMutation.isPending}
												>
													{withdrawMutation.isPending
														? "Processing..."
														: "Withdraw"}
												</NativeButton>
											</div>
										</form>
									</DialogContent>
								</Dialog>
								<Dialog
									open={createInvestmentOpen}
									onOpenChange={(open) => {
										setCreateInvestmentOpen(open);
										if (!open) setInvestmentForm({ name: "", amount: "" });
									}}
								>
									<DialogTrigger asChild>
										<NativeButton variant="outline" className={cn("w-full")}>
											Invest
										</NativeButton>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Make Investment</DialogTitle>
										</DialogHeader>
										<form
											onSubmit={(e) => {
												e.preventDefault();
												const amount = Number.parseFloat(investmentForm.amount);
												if (Number.isNaN(amount) || amount <= 0) {
													toast.error("Please enter a valid amount");
													return;
												}
												if (!investmentForm.name) {
													toast.error("Investment name is required");
													return;
												}
												createInvestmentMutation.mutate({
													accountId: selectedAccountId,
													name: investmentForm.name,
													amount,
												});
											}}
											className="space-y-4"
										>
											<div className="space-y-2">
												<Label htmlFor="investment-name">Investment Name</Label>
												<Input
													id="investment-name"
													value={investmentForm.name}
													onChange={(e) =>
														setInvestmentForm((prev) => ({
															...prev,
															name: e.target.value,
														}))
													}
													placeholder="Enter investment name"
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="investment-amount">Amount</Label>
												<Input
													id="investment-amount"
													type="number"
													step="0.01"
													min="0"
													value={investmentForm.amount}
													onChange={(e) =>
														setInvestmentForm((prev) => ({
															...prev,
															amount: e.target.value,
														}))
													}
													placeholder="Enter amount"
													required
												/>
											</div>
											<div className="flex justify-end gap-2 pt-4">
												<NativeButton
													type="button"
													variant="outline"
													onClick={() => setCreateInvestmentOpen(false)}
													disabled={createInvestmentMutation.isPending}
												>
													Cancel
												</NativeButton>
												<NativeButton
													type="submit"
													disabled={createInvestmentMutation.isPending}
												>
													{createInvestmentMutation.isPending
														? "Creating..."
														: "Invest"}
												</NativeButton>
											</div>
										</form>
									</DialogContent>
								</Dialog>
							</div>
						</div>
					)}

					{/* Display Transactions & Investments */}
					{selectedAccountId && (
						<Tabs defaultValue="transactions" className={cn("w-full")}>
							<TabsList>
								<TabsTrigger value="investments">Investments</TabsTrigger>
								<TabsTrigger value="transactions">Transactions</TabsTrigger>
							</TabsList>

							<TabsContent value="investments" className={cn("mt-4")}>
								{transactionsLoading ? (
									<p className={cn("text-muted-foreground text-sm")}>
										Loading transactions...
									</p>
								) : transactions.length === 0 ? (
									<p className={cn("text-muted-foreground text-sm")}>
										No transactions found
									</p>
								) : (
									<div
										className={cn(
											"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
										)}
									>
										{transactions.map((transaction) => (
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

							<TabsContent value="transactions" className={cn("mt-4")}>
								{investmentsLoading ? (
									<p className={cn("text-muted-foreground text-sm")}>
										Loading investments...
									</p>
								) : investments.length === 0 ? (
									<p className={cn("text-muted-foreground text-sm")}>
										No investments found
									</p>
								) : (
									<div
										className={cn(
											"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
										)}
									>
										{investments.map((investment) => (
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
													{investment.status === "DEPOSITED" && (
														<NativeButton
															variant="outline"
															size="sm"
															className={cn("mt-2")}
															onClick={() => {
																if (
																	confirm(
																		`Are you sure you want to withdraw ${investment.name}?`,
																	)
																) {
																	withdrawInvestmentMutation.mutate({
																		investmentId: investment.id,
																	});
																}
															}}
															disabled={withdrawInvestmentMutation.isPending}
														>
															{withdrawInvestmentMutation.isPending
																? "Processing..."
																: "Withdraw"}
														</NativeButton>
													)}
												</CardFooter>
											</Card>
										))}
									</div>
								)}
							</TabsContent>
						</Tabs>
					)}
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

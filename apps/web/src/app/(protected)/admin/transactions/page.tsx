"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
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

	const queryClient = useQueryClient();
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
	const { data: accountsData } = useQuery(
		orpc.bank.getAccounts.queryOptions({
			input: { userId: selectedUserId },
			enabled: !!selectedUserId,
		}),
	);

	// Fetch transactions for selected account
	const { data: transactionsData, isLoading: transactionsLoading } = useQuery(
		orpc.bank.getTransactions.queryOptions({
			input: { accountId: selectedAccountId },
			enabled: !!selectedAccountId,
		}),
	);

	// Fetch investments for selected account
	const { data: investmentsData, isLoading: investmentsLoading } = useQuery(
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
				queryClient.invalidateQueries({
					queryKey: ["bank", "getAccounts"],
				});
				queryClient.invalidateQueries({
					queryKey: ["bank", "getTransactions"],
				});
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
				queryClient.invalidateQueries({
					queryKey: ["bank", "getAccounts"],
				});
				queryClient.invalidateQueries({
					queryKey: ["bank", "getTransactions"],
				});
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
				queryClient.invalidateQueries({
					queryKey: ["bank", "getAccounts"],
				});
				queryClient.invalidateQueries({
					queryKey: ["bank", "getInvestments"],
				});
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
				queryClient.invalidateQueries({
					queryKey: ["bank", "getAccounts"],
				});
				queryClient.invalidateQueries({
					queryKey: ["bank", "getInvestments"],
				});
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
					<h2 className={cn("font-bold text-3xl")}>
						Transaction & Investment Management
					</h2>
				</div>
				<Separator className={cn("mt-3 mb-6")} />

				<div className={cn("space-y-6")}>
					{/* Account Summary */}
					{selectedAccount && (
						<div className={cn("rounded-lg border p-4")}>
							<h4 className={cn("mb-2 font-semibold")}>
								{selectedAccount.name}
							</h4>
							<div className={cn("grid grid-cols-2 gap-4 text-sm")}>
								<div>
									<span className={cn("text-gray-400")}>Balance:</span>
									<span className={cn("ml-2 font-semibold")}>
										${selectedAccount.balance || 0}
									</span>
								</div>
								<div>
									<span className={cn("text-gray-400")}>Total:</span>
									<span className={cn("ml-2 font-semibold")}>
										${selectedAccount.total || 0}
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Display Transactions & Investments */}
					{selectedAccountId && (
						<>
							{/* Account Actions */}
							<div className={cn("flex gap-2")}>
								<Dialog
									open={depositOpen}
									onOpenChange={(open) => {
										setDepositOpen(open);
										if (!open) setDepositForm({ amount: "" });
									}}
								>
									<DialogTrigger asChild>
										<Button variant="outline">Deposit</Button>
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
												<Button
													type="button"
													variant="outline"
													onClick={() => setDepositOpen(false)}
													disabled={depositMutation.isPending}
												>
													Cancel
												</Button>
												<Button
													type="submit"
													disabled={depositMutation.isPending}
												>
													{depositMutation.isPending
														? "Processing..."
														: "Deposit"}
												</Button>
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
										<Button variant="outline">Withdraw</Button>
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
												<Button
													type="button"
													variant="outline"
													onClick={() => setWithdrawOpen(false)}
													disabled={withdrawMutation.isPending}
												>
													Cancel
												</Button>
												<Button
													type="submit"
													disabled={withdrawMutation.isPending}
												>
													{withdrawMutation.isPending
														? "Processing..."
														: "Withdraw"}
												</Button>
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
										<Button variant="outline">Create Investment</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Create Investment</DialogTitle>
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
												<Button
													type="button"
													variant="outline"
													onClick={() => setCreateInvestmentOpen(false)}
													disabled={createInvestmentMutation.isPending}
												>
													Cancel
												</Button>
												<Button
													type="submit"
													disabled={createInvestmentMutation.isPending}
												>
													{createInvestmentMutation.isPending
														? "Creating..."
														: "Create"}
												</Button>
											</div>
										</form>
									</DialogContent>
								</Dialog>
							</div>

							<div className={cn("space-y-4")}>
								<h3 className={cn("font-semibold text-xl")}>Transactions</h3>
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
															${transaction.amount} {transaction.currency}
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
							</div>

							{/* Display Investments */}
							<div className={cn("space-y-4")}>
								<h3 className={cn("font-semibold text-xl")}>Investments</h3>
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
															${investment.amount}
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
														<Button
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
														</Button>
													)}
												</CardFooter>
											</Card>
										))}
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>
			<div className={cn("ml-auto text-right text-gray-400 text-sm")}>
				<p>Email: {sessionData?.user.email}</p>
				<p>&copy; 2009 - 2025. Earnex Global</p>
			</div>
		</div>
	);
}

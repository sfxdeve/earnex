"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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

interface UserFormData {
	name: string;
	email: string;
	password?: string;
	role?: string;
}

export default function AdminPage() {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [createAccountOpen, setCreateAccountOpen] = useState(false);
	const [formData, setFormData] = useState<UserFormData>({
		name: "",
		email: "",
		password: "",
		role: "",
	});
	const [accountForm, setAccountForm] = useState({
		name: "",
		type: "",
	});

	const { isPending: sessionPending, data: sessionData } =
		authClient.useSession();

	// Fetch users using admin client
	const {
		data: usersData,
		isLoading: usersLoading,
		refetch: refetchUsers,
	} = useQuery({
		queryKey: ["admin", "users"],
		queryFn: async () => {
			const response = await authClient.admin.listUsers({
				query: {},
			});
			return response;
		},
	});

	const createUserMutation = useMutation({
		mutationFn: async (data: UserFormData) => {
			return await authClient.admin.createUser({
				name: data.name,
				email: data.email,
				password: data.password as string,
				...(data.role && { role: data.role as "user" | "admin" }),
			});
		},
		onSuccess: () => {
			toast.success("User created successfully");
			setIsDialogOpen(false);
			resetForm();
			refetchUsers();
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to create user");
		},
	});

	// Fetch accounts for selected user
	const {
		data: accountsData,
		isLoading: accountsLoading,
		refetch: refetchAccounts,
	} = useQuery(
		orpc.bank.getAccounts.queryOptions({
			input: { userId: selectedUserId || "" },
			enabled: !!selectedUserId,
		}),
	);

	const createAccountMutation = useMutation(
		orpc.bank.createAccount.mutationOptions({
			onSuccess: () => {
				toast.success("Account created successfully");
				setCreateAccountOpen(false);
				setAccountForm({ name: "", type: "" });
				refetchAccounts();
			},
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to create account");
			},
		}),
	);

	const resetForm = () => {
		setFormData({ name: "", email: "", password: "", role: "" });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.password) {
			toast.error("Password is required");
			return;
		}
		createUserMutation.mutate(formData);
	};

	if (sessionPending || usersLoading) {
		return <Loader />;
	}

	const users = usersData?.data?.users || [];

	return (
		<div className={cn("flex flex-1 flex-col justify-between gap-4")}>
			<div>
				<div className={cn("flex items-center justify-between")}>
					<h2 className={cn("font-bold text-3xl")}>User Management</h2>
					<Dialog
						open={isDialogOpen}
						onOpenChange={(open) => {
							setIsDialogOpen(open);
							if (!open) {
								resetForm();
							}
						}}
					>
						<DialogTrigger asChild>
							<Button variant="outline" size="lg">
								Create User
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Create New User</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) =>
											setFormData((prev) => ({ ...prev, name: e.target.value }))
										}
										placeholder="Enter user name"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												email: e.target.value,
											}))
										}
										placeholder="Enter user email"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										value={formData.password}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												password: e.target.value,
											}))
										}
										placeholder="Enter password"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="role">Role</Label>
									<Input
										id="role"
										value={formData.role}
										onChange={(e) =>
											setFormData((prev) => ({ ...prev, role: e.target.value }))
										}
										placeholder="Enter user role (optional)"
									/>
								</div>
								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setIsDialogOpen(false);
											resetForm();
										}}
										disabled={createUserMutation.isPending}
									>
										Cancel
									</Button>
									<Button type="submit" disabled={createUserMutation.isPending}>
										{createUserMutation.isPending
											? "Creating..."
											: "Create User"}
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				<Separator className={cn("mt-3 mb-6")} />
				<div className={cn("space-y-8")}>
					{users.length === 0 ? (
						<p className="py-8 text-center text-muted-foreground">
							No users found. Create your first user above.
						</p>
					) : (
						<>
							<h3 className={cn("text-sm")}>All users</h3>
							<div
								className={cn(
									"grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
								)}
							>
								{users.map((user) => (
									<Dialog
										key={user.id}
										onOpenChange={(open) => {
											if (open) {
												setSelectedUserId(user.id);
											} else {
												setSelectedUserId(null);
											}
										}}
									>
										<DialogTrigger asChild>
											<Card
												className={cn(
													"cursor-pointer gap-4 border-primary bg-transparent transition-colors hover:bg-accent/50",
												)}
											>
												<CardHeader>
													<CardTitle>{user.name}</CardTitle>
													{user.role && (
														<CardAction>
															<span className="rounded bg-secondary px-2 py-0.5 text-xs">
																{user.role}
															</span>
														</CardAction>
													)}
												</CardHeader>
												<Separator />
												<CardFooter
													className={cn("flex-col items-stretch gap-2 text-xs")}
												>
													<p className={cn("space-x-2")}>
														<span className={cn("text-gray-400")}>Email</span>
														<span>{user.email}</span>
													</p>
													<p className={cn("space-x-2")}>
														<span className={cn("text-gray-400")}>Created</span>
														<span>
															{user.createdAt
																? new Date(user.createdAt).toLocaleDateString()
																: "N/A"}
														</span>
													</p>
												</CardFooter>
											</Card>
										</DialogTrigger>
										<DialogContent className="sm:max-w-lg">
											<DialogHeader>
												<DialogTitle>{user.name}&apos;s Accounts</DialogTitle>
											</DialogHeader>
											<div className={cn("mb-4 flex justify-end")}>
												<Dialog
													open={createAccountOpen}
													onOpenChange={(open) => {
														setCreateAccountOpen(open);
														if (!open) setAccountForm({ name: "", type: "" });
													}}
												>
													<DialogTrigger asChild>
														<Button variant="outline" size="sm">
															Create Account
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Create New Account</DialogTitle>
														</DialogHeader>
														<form
															onSubmit={(e) => {
																e.preventDefault();
																if (!accountForm.name || !accountForm.type) {
																	toast.error("Name and type are required");
																	return;
																}
																if (!selectedUserId) {
																	toast.error("User not selected");
																	return;
																}
																createAccountMutation.mutate({
																	name: accountForm.name,
																	type: accountForm.type,
																	userId: selectedUserId,
																} as {
																	name: string;
																	type: string;
																	userId: string;
																});
															}}
															className="space-y-4"
														>
															<div className="space-y-2">
																<Label htmlFor="account-name">
																	Account Name
																</Label>
																<Input
																	id="account-name"
																	value={accountForm.name}
																	onChange={(e) =>
																		setAccountForm((prev) => ({
																			...prev,
																			name: e.target.value,
																		}))
																	}
																	placeholder="Enter account name"
																	required
																/>
															</div>
															<div className="space-y-2">
																<Label htmlFor="account-type">
																	Account Type
																</Label>
																<Input
																	id="account-type"
																	value={accountForm.type}
																	onChange={(e) =>
																		setAccountForm((prev) => ({
																			...prev,
																			type: e.target.value,
																		}))
																	}
																	placeholder="Enter account type"
																	required
																/>
															</div>
															<div className="flex justify-end gap-2 pt-4">
																<Button
																	type="button"
																	variant="outline"
																	onClick={() => setCreateAccountOpen(false)}
																	disabled={createAccountMutation.isPending}
																>
																	Cancel
																</Button>
																<Button
																	type="submit"
																	disabled={createAccountMutation.isPending}
																>
																	{createAccountMutation.isPending
																		? "Creating..."
																		: "Create"}
																</Button>
															</div>
														</form>
													</DialogContent>
												</Dialog>
											</div>
											{accountsLoading ? (
												<div className={cn("py-8 text-center")}>
													<Loader />
												</div>
											) : accountsData?.accounts.length === 0 ? (
												<p
													className={cn(
														"py-8 text-center text-muted-foreground",
													)}
												>
													No accounts found for this user
												</p>
											) : (
												<div className={cn("space-y-2")}>
													{accountsData?.accounts.map((account) => (
														<Card
															key={account.id}
															className={cn(
																"cursor-pointer border-primary bg-transparent transition-colors hover:bg-accent/50",
															)}
															onClick={() => {
																router.push(
																	`/admin/transactions?userId=${user.id}&accountId=${account.id}` as Parameters<
																		typeof router.push
																	>[0],
																);
															}}
														>
															<CardHeader>
																<CardTitle className={cn("text-lg")}>
																	{account.name}
																</CardTitle>
															</CardHeader>
															<Separator />
															<CardFooter
																className={cn(
																	"flex items-center justify-between gap-4 text-sm",
																)}
															>
																<div className={cn("flex flex-col gap-1")}>
																	<span className={cn("text-gray-400 text-xs")}>
																		Balance
																	</span>
																	<span className={cn("font-semibold")}>
																		${account.balance || 0}
																	</span>
																</div>
																<div className={cn("flex flex-col gap-1")}>
																	<span className={cn("text-gray-400 text-xs")}>
																		Total
																	</span>
																	<span className={cn("font-semibold")}>
																		${account.total || 0}
																	</span>
																</div>
															</CardFooter>
														</Card>
													))}
												</div>
											)}
										</DialogContent>
									</Dialog>
								))}
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

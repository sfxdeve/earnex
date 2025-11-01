"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
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
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

export default function AdminPage() {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [createAccountOpen, setCreateAccountOpen] = useState(false);

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

	const userForm = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "",
		},
		onSubmit: async ({ value }) => {
			if (!value.password) {
				toast.error("Password is required");
				return;
			}
			await createUserMutation.mutateAsync({
				name: value.name,
				email: value.email,
				password: value.password,
				role: value.role || undefined,
			});
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
				role: z.string(),
			}),
		},
	});

	const accountForm = useForm({
		defaultValues: {
			name: "",
			type: "",
		},
		onSubmit: async ({ value }) => {
			if (!selectedUserId) {
				toast.error("User not selected");
				return;
			}
			await createAccountMutation.mutateAsync({
				name: value.name,
				type: value.type,
				userId: selectedUserId,
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

	const createUserMutation = useMutation({
		mutationFn: async (data: {
			name: string;
			email: string;
			password: string;
			role?: string;
		}) => {
			await authClient.admin.createUser({
				name: data.name,
				email: data.email,
				password: data.password,
				role: data.role as "user" | "admin",
			});

			await authClient.sendVerificationEmail({
				email: data.email,
				callbackURL: routes.protected.dashboard,
			});
		},
		onSuccess: () => {
			toast.success("User created successfully");
			setIsDialogOpen(false);
			userForm.reset();
			refetchUsers();
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to create user");
		},
	});

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
				accountForm.reset();
				refetchAccounts();
			},
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to create account");
			},
		}),
	);

	if (sessionPending || usersLoading) {
		return <Loader />;
	}

	const users = usersData?.data?.users || [];

	return (
		<div className={cn("flex flex-1 flex-col justify-between gap-4")}>
			<div>
				<div
					className={cn(
						"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					)}
				>
					<h2 className={cn("font-bold text-2xl sm:text-3xl")}>
						User Management
					</h2>
					<Dialog
						open={isDialogOpen}
						onOpenChange={(open) => {
							setIsDialogOpen(open);
							if (!open) {
								userForm.reset();
							}
						}}
					>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								size="lg"
								className={cn("w-full sm:w-auto")}
							>
								Create
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Create New User</DialogTitle>
							</DialogHeader>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									userForm.handleSubmit();
								}}
								className="space-y-4"
							>
								<userForm.Field name="name">
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>Name</Label>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Enter user name"
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
								</userForm.Field>
								<userForm.Field name="email">
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>Email</Label>
											<Input
												id={field.name}
												name={field.name}
												type="email"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Enter user email"
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
								</userForm.Field>
								<userForm.Field name="password">
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>Password</Label>
											<Input
												id={field.name}
												name={field.name}
												type="password"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Enter password"
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
								</userForm.Field>
								<userForm.Field name="role">
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>Role</Label>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Enter user role (optional)"
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
								</userForm.Field>
								<userForm.Subscribe>
									{(state) => (
										<div className="flex justify-end gap-2 pt-4">
											<Button
												type="button"
												variant="outline"
												onClick={() => {
													setIsDialogOpen(false);
													userForm.reset();
												}}
												disabled={
													state.isSubmitting || createUserMutation.isPending
												}
											>
												Cancel
											</Button>
											<Button
												type="submit"
												disabled={
													!state.canSubmit ||
													state.isSubmitting ||
													createUserMutation.isPending
												}
											>
												{state.isSubmitting || createUserMutation.isPending
													? "Creating..."
													: "Create"}
											</Button>
										</div>
									)}
								</userForm.Subscribe>
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
														if (!open) accountForm.reset();
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
																e.stopPropagation();
																accountForm.handleSubmit();
															}}
															className="space-y-4"
														>
															<accountForm.Field name="name">
																{(field) => (
																	<div className="space-y-2">
																		<Label htmlFor={field.name}>
																			Account Name
																		</Label>
																		<Input
																			id={field.name}
																			name={field.name}
																			value={field.state.value}
																			onBlur={field.handleBlur}
																			onChange={(e) =>
																				field.handleChange(e.target.value)
																			}
																			placeholder="Enter account name"
																		/>
																		{field.state.meta.errors.map((error) => (
																			<p
																				key={error?.message}
																				className="text-red-500 text-sm"
																			>
																				{error?.message}
																			</p>
																		))}
																	</div>
																)}
															</accountForm.Field>
															<accountForm.Field name="type">
																{(field) => (
																	<div className="space-y-2">
																		<Label htmlFor={field.name}>
																			Account Type
																		</Label>
																		<Input
																			id={field.name}
																			name={field.name}
																			value={field.state.value}
																			onBlur={field.handleBlur}
																			onChange={(e) =>
																				field.handleChange(e.target.value)
																			}
																			placeholder="Enter account type"
																		/>
																		{field.state.meta.errors.map((error) => (
																			<p
																				key={error?.message}
																				className="text-red-500 text-sm"
																			>
																				{error?.message}
																			</p>
																		))}
																	</div>
																)}
															</accountForm.Field>
															<accountForm.Subscribe>
																{(state) => (
																	<div className="flex justify-end gap-2 pt-4">
																		<Button
																			type="button"
																			variant="outline"
																			onClick={() =>
																				setCreateAccountOpen(false)
																			}
																			disabled={
																				state.isSubmitting ||
																				createAccountMutation.isPending
																			}
																		>
																			Cancel
																		</Button>
																		<Button
																			type="submit"
																			disabled={
																				!state.canSubmit ||
																				state.isSubmitting ||
																				createAccountMutation.isPending
																			}
																		>
																			{state.isSubmitting ||
																			createAccountMutation.isPending
																				? "Creating..."
																				: "Create"}
																		</Button>
																	</div>
																)}
															</accountForm.Subscribe>
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
												<div className={cn("space-y-1")}>
													{accountsData?.accounts.map((account) => (
														<button
															key={account.id}
															type="button"
															className={cn(
																"flex w-full cursor-pointer items-center justify-between rounded-md border border-primary px-4 py-3 text-left transition-colors hover:bg-accent/50",
															)}
															onClick={() => {
																router.push(
																	`${routes.protected.admin.transactions}?userId=${user.id}&accountId=${account.id}` as Parameters<
																		typeof router.push
																	>[0],
																);
															}}
														>
															<div className={cn("flex flex-col gap-1")}>
																<span className={cn("font-semibold")}>
																	{account.name}
																</span>
																<span className={cn("text-gray-400 text-xs")}>
																	{account.type || "N/A"}
																</span>
															</div>
															<div
																className={cn(
																	"flex items-center gap-6 text-sm",
																)}
															>
																<div
																	className={cn(
																		"flex flex-col gap-1 text-right",
																	)}
																>
																	<span className={cn("text-gray-400 text-xs")}>
																		Balance
																	</span>
																	<span className={cn("font-semibold")}>
																		${account.balance || 0}
																	</span>
																</div>
																<div
																	className={cn(
																		"flex flex-col gap-1 text-right",
																	)}
																>
																	<span className={cn("text-gray-400 text-xs")}>
																		Total
																	</span>
																	<span className={cn("font-semibold")}>
																		${account.total || 0}
																	</span>
																</div>
															</div>
														</button>
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

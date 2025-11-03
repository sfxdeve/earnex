"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
	Card,
	CardAction,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import { cn, formatAmount } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

type CountryData = {
	name: string;
	code: string;
};

async function fetchCountries(): Promise<CountryData[]> {
	const { data } = await axios.get<
		Array<{
			name: { common: string };
			idd: { root: string; suffixes?: string[] };
		}>
	>("https://restcountries.com/v3.1/all?fields=name,idd");

	return data
		.filter((country) => country.idd?.root)
		.map((country) => {
			const code =
				country.idd.suffixes && country.idd.suffixes.length > 0
					? country.idd.root + country.idd.suffixes[0]
					: country.idd.root;
			return {
				name: country.name.common,
				code,
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));
}

export default function AdminPage() {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [createAccountOpen, setCreateAccountOpen] = useState(false);
	const [countryCode, setCountryCode] = useState<string>("");
	const [blockDialogOpen, setBlockDialogOpen] = useState(false);
	const [blockUserId, setBlockUserId] = useState<string | null>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editUserId, setEditUserId] = useState<string | null>(null);
	const [editCountryCode, setEditCountryCode] = useState<string>("");

	const { isPending: sessionPending, data: sessionData } =
		authClient.useSession();

	const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
		queryKey: ["countries"],
		queryFn: fetchCountries,
		staleTime: Number.POSITIVE_INFINITY,
	});

	const {
		data: users = [],
		isLoading: usersLoading,
		refetch: refetchUsers,
	} = useQuery(
		orpc.auth.getUsers.queryOptions({
			input: {
				emailVerified: true,
				role: "user",
			},
		}),
	);

	const userForm = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			phone: "",
			country: "",
			dob: undefined as Date | undefined,
		},
		onSubmit: async ({ value }) => {
			if (!value.password) {
				toast.error("Password is required");
				return;
			}
			if (!value.dob) {
				toast.error("Date of birth is required");
				return;
			}
			await createUserMutation.mutateAsync({
				name: value.name,
				email: value.email,
				password: value.password,
				phone: value.phone,
				country: value.country,
				dob: value.dob,
				countryCode,
			});
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
				phone: z
					.string()
					.min(10, "Phone number must be at least 10 characters"),
				country: z.string().min(2, "Country must be at least 2 characters"),
				dob: z
					.date({
						message: "Date of birth is required",
					})
					.refine(
						(date) => {
							const today = new Date();
							const eighteenYearsAgo = new Date(
								today.getFullYear() - 18,
								today.getMonth(),
								today.getDate(),
							);
							return date <= eighteenYearsAgo;
						},
						{
							message: "User must be at least 18 years old",
						},
					),
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

	const createInfoMutation = useMutation(
		orpc.auth.createInfo.mutationOptions({
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to create user info");
			},
		}),
	);

	const createUserMutation = useMutation({
		mutationFn: async (data: {
			name: string;
			email: string;
			password: string;
			phone: string;
			country: string;
			dob: Date;
			countryCode: string;
			role?: string;
		}) => {
			const response = await authClient.admin.createUser({
				name: data.name,
				email: data.email,
				password: data.password,
				role: data.role as "user" | "admin",
			});

			const userId = response.data?.user.id;

			if (userId) {
				const fullPhoneNumber = data.countryCode
					? `${data.countryCode}${data.phone}`
					: data.phone;

				await createInfoMutation.mutateAsync({
					country: data.country,
					phone: fullPhoneNumber,
					dob: data.dob,
					userId: userId,
				});
			}

			await authClient.sendVerificationEmail({
				email: data.email,
				callbackURL: routes.protected.dashboard,
			});
		},
		onSuccess: () => {
			toast.success("User created successfully");
			setIsDialogOpen(false);
			setCountryCode("");
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

	const blockUserMutation = useMutation(
		orpc.auth.blockUser.mutationOptions({
			onSuccess: () => {
				toast.success("User blocked successfully");
				setBlockDialogOpen(false);
				blockForm.reset();
				setBlockUserId(null);
				refetchUsers();
			},
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to block user");
			},
		}),
	);

	const unblockUserMutation = useMutation(
		orpc.auth.unblockUser.mutationOptions({
			onSuccess: () => {
				toast.success("User unblocked successfully");
				refetchUsers();
			},
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to unblock user");
			},
		}),
	);

	const blockForm = useForm({
		defaultValues: {
			reason: "",
			banExpires: undefined as Date | undefined,
		},
		onSubmit: async ({ value }) => {
			if (!blockUserId) {
				toast.error("User not selected");
				return;
			}
			await blockUserMutation.mutateAsync({
				userId: blockUserId,
				reason: value.reason || undefined,
				banExpires: value.banExpires || undefined,
			});
		},
	});

	const updateUserMutation = useMutation(
		orpc.auth.updateUser.mutationOptions({
			onSuccess: () => {
				toast.success("User updated successfully");
				setEditDialogOpen(false);
				setEditUserId(null);
				setEditCountryCode("");
				editForm.reset();
				refetchUsers();
			},
			onError: (error: Error) => {
				toast.error(error?.message || "Failed to update user");
			},
		}),
	);

	const editForm = useForm({
		defaultValues: {
			name: "",
			phone: "",
			country: "",
			dob: undefined as Date | undefined,
		},
		onSubmit: async ({ value }) => {
			if (!editUserId) {
				toast.error("User not selected");
				return;
			}
			if (!value.dob) {
				toast.error("Date of birth is required");
				return;
			}
			if (!value.country) {
				toast.error("Country is required");
				return;
			}
			if (!value.phone) {
				toast.error("Phone number is required");
				return;
			}

			const fullPhoneNumber = editCountryCode
				? `${editCountryCode}${value.phone}`
				: value.phone;

			await updateUserMutation.mutateAsync({
				userId: editUserId,
				name: value.name,
				phone: fullPhoneNumber,
				country: value.country,
				dob: value.dob,
			});
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				phone: z
					.string()
					.min(10, "Phone number must be at least 10 characters"),
				country: z.string().min(2, "Country must be at least 2 characters"),
				dob: z.date({
					message: "Date of birth is required",
				}),
			}),
		},
	});

	if (sessionPending || usersLoading) {
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
					<h2 className={cn("font-bold text-2xl sm:text-3xl")}>
						User Management
					</h2>
					<Dialog
						open={isDialogOpen}
						onOpenChange={(open) => {
							setIsDialogOpen(open);
							if (!open) {
								setCountryCode("");
								userForm.reset();
							}
						}}
					>
						<DialogTrigger asChild>
							<NativeButton
								variant="outline"
								size="lg"
								className={cn("w-full sm:w-auto")}
							>
								Create
							</NativeButton>
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
								<userForm.Field name="dob">
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>Date of Birth</Label>
											<DatePicker
												date={field.state.value}
												onDateChange={(date) => {
													field.handleChange(date);
													if (date) {
														field.handleBlur();
													}
												}}
												placeholder="Select date of birth"
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
								<userForm.Field name="country">
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>Country</Label>
											<Select
												value={field.state.value}
												onValueChange={(value) => {
													field.handleChange(value);

													const selectedCountry = countries.find(
														(c) => c.name === value,
													);

													if (selectedCountry) {
														setCountryCode(selectedCountry.code);
													} else {
														setCountryCode("");
													}
												}}
												onOpenChange={(open) => {
													if (!open) {
														field.handleBlur();
													}
												}}
												disabled={isLoadingCountries}
											>
												<SelectTrigger id={field.name} className="w-full">
													<SelectValue
														placeholder={
															isLoadingCountries
																? "Loading countries..."
																: "Select country"
														}
													/>
												</SelectTrigger>
												<SelectContent>
													{countries.map((country) => (
														<SelectItem key={country.name} value={country.name}>
															{country.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
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
								<userForm.Field name="phone">
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>Phone</Label>
											<div className="flex gap-2">
												<Input
													type="text"
													placeholder="+1"
													readOnly
													className="w-20"
													value={countryCode}
												/>
												<Input
													id={field.name}
													name={field.name}
													type="tel"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Enter phone number"
													className="flex-1"
												/>
											</div>
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
											<NativeButton
												type="button"
												variant="outline"
												onClick={() => {
													setIsDialogOpen(false);
													setCountryCode("");
													userForm.reset();
												}}
												disabled={
													state.isSubmitting || createUserMutation.isPending
												}
											>
												Cancel
											</NativeButton>
											<NativeButton
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
											</NativeButton>
										</div>
									)}
								</userForm.Subscribe>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				<Dialog
					open={blockDialogOpen}
					onOpenChange={(open) => {
						setBlockDialogOpen(open);
						if (!open) {
							setBlockUserId(null);
							blockForm.reset();
						}
					}}
				>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Block User</DialogTitle>
						</DialogHeader>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								blockForm.handleSubmit();
							}}
							className="space-y-4"
						>
							<blockForm.Field name="reason">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Reason (optional)</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Enter reason for blocking"
										/>
										{field.state.meta.errors.map((error, index) => (
											<p
												key={`${field.name}-error-${index}`}
												className="text-red-500 text-sm"
											>
												{typeof error === "object" &&
												error !== null &&
												"message" in error
													? String((error as { message: string }).message)
													: String(error || "Invalid value")}
											</p>
										))}
									</div>
								)}
							</blockForm.Field>
							<blockForm.Field name="banExpires">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Ban Expires (optional)</Label>
										<DatePicker
											date={field.state.value}
											onDateChange={(date) => {
												field.handleChange(date);
												if (date) {
													field.handleBlur();
												}
											}}
											placeholder="Select expiry date (leave empty for permanent)"
										/>
										{field.state.meta.errors.map((error, index) => (
											<p
												key={`${field.name}-error-${index}`}
												className="text-red-500 text-sm"
											>
												{typeof error === "object" &&
												error !== null &&
												"message" in error
													? String((error as { message: string }).message)
													: String(error || "Invalid value")}
											</p>
										))}
									</div>
								)}
							</blockForm.Field>
							<blockForm.Subscribe>
								{(state) => (
									<div className="flex justify-end gap-2 pt-4">
										<NativeButton
											type="button"
											variant="outline"
											onClick={() => {
												setBlockDialogOpen(false);
												setBlockUserId(null);
												blockForm.reset();
											}}
											disabled={
												state.isSubmitting || blockUserMutation.isPending
											}
										>
											Cancel
										</NativeButton>
										<NativeButton
											type="submit"
											variant="destructive"
											disabled={
												state.isSubmitting || blockUserMutation.isPending
											}
										>
											{state.isSubmitting || blockUserMutation.isPending
												? "Blocking..."
												: "Block"}
										</NativeButton>
									</div>
								)}
							</blockForm.Subscribe>
						</form>
					</DialogContent>
				</Dialog>
				<Dialog
					open={editDialogOpen}
					onOpenChange={(open) => {
						setEditDialogOpen(open);
						if (!open) {
							setEditUserId(null);
							setEditCountryCode("");
							editForm.reset();
						}
					}}
				>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Edit User</DialogTitle>
						</DialogHeader>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								editForm.handleSubmit();
							}}
							className="space-y-4"
						>
							<editForm.Field name="name">
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
												{typeof error === "object" &&
												error !== null &&
												"message" in error
													? String((error as { message: string }).message)
													: String(error || "Invalid value")}
											</p>
										))}
									</div>
								)}
							</editForm.Field>
							<editForm.Field name="dob">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Date of Birth</Label>
										<DatePicker
											date={field.state.value}
											onDateChange={(date) => {
												field.handleChange(date);
												if (date) {
													field.handleBlur();
												}
											}}
											placeholder="Select date of birth"
										/>
										{field.state.meta.errors.map((error, index) => (
											<p
												key={`${field.name}-error-${index}`}
												className="text-red-500 text-sm"
											>
												{typeof error === "object" &&
												error !== null &&
												"message" in error
													? String((error as { message: string }).message)
													: String(error || "Invalid value")}
											</p>
										))}
									</div>
								)}
							</editForm.Field>
							<editForm.Field name="country">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Country</Label>
										<Select
											value={field.state.value}
											onValueChange={(value) => {
												field.handleChange(value);

												const selectedCountry = countries.find(
													(c) => c.name === value,
												);

												if (selectedCountry) {
													setEditCountryCode(selectedCountry.code);
												} else {
													setEditCountryCode("");
												}
											}}
											onOpenChange={(open) => {
												if (!open) {
													field.handleBlur();
												}
											}}
											disabled={isLoadingCountries}
										>
											<SelectTrigger id={field.name} className="w-full">
												<SelectValue
													placeholder={
														isLoadingCountries
															? "Loading countries..."
															: "Select country"
													}
												/>
											</SelectTrigger>
											<SelectContent>
												{countries.map((country) => (
													<SelectItem key={country.name} value={country.name}>
														{country.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{field.state.meta.errors.map((error, index) => (
											<p
												key={`${field.name}-error-${index}`}
												className="text-red-500 text-sm"
											>
												{typeof error === "object" &&
												error !== null &&
												"message" in error
													? String((error as { message: string }).message)
													: String(error || "Invalid value")}
											</p>
										))}
									</div>
								)}
							</editForm.Field>
							<editForm.Field name="phone">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Phone</Label>
										<div className="flex gap-2">
											<Input
												type="text"
												placeholder="+1"
												readOnly
												className="w-20"
												value={editCountryCode}
											/>
											<Input
												id={field.name}
												name={field.name}
												type="tel"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Enter phone number"
												className="flex-1"
											/>
										</div>
										{field.state.meta.errors.map((error, index) => (
											<p
												key={`${field.name}-error-${index}`}
												className="text-red-500 text-sm"
											>
												{typeof error === "object" &&
												error !== null &&
												"message" in error
													? String((error as { message: string }).message)
													: String(error || "Invalid value")}
											</p>
										))}
									</div>
								)}
							</editForm.Field>
							<editForm.Subscribe>
								{(state) => (
									<div className="flex justify-end gap-2 pt-4">
										<NativeButton
											type="button"
											variant="outline"
											onClick={() => {
												setEditDialogOpen(false);
												setEditUserId(null);
												setEditCountryCode("");
												editForm.reset();
											}}
											disabled={
												state.isSubmitting || updateUserMutation.isPending
											}
										>
											Cancel
										</NativeButton>
										<NativeButton
											type="submit"
											disabled={
												!state.canSubmit ||
												state.isSubmitting ||
												updateUserMutation.isPending
											}
										>
											{state.isSubmitting || updateUserMutation.isPending
												? "Updating..."
												: "Update"}
										</NativeButton>
									</div>
								)}
							</editForm.Subscribe>
						</form>
					</DialogContent>
				</Dialog>
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
													user.banned && "border-red-500 opacity-75",
												)}
											>
												<CardHeader>
													<div className="flex items-center justify-between">
														<CardTitle>{user.name}</CardTitle>
														<div className="flex gap-2">
															{user.banned && (
																<span className="rounded bg-red-500 px-2 py-0.5 text-white text-xs">
																	Blocked
																</span>
															)}
															{user.role && (
																<span className="rounded bg-secondary px-2 py-0.5 text-xs">
																	{user.role}
																</span>
															)}
														</div>
													</div>
												</CardHeader>
												<Separator />
												<CardFooter
													className={cn("flex-col items-stretch gap-2 text-xs")}
												>
													<p className={cn("space-x-2")}>
														<span className={cn("text-gray-400")}>Email</span>
														<span className="break-all">{user.email}</span>
													</p>
													{user.info?.phone && (
														<p className={cn("space-x-2")}>
															<span className={cn("text-gray-400")}>Phone</span>
															<span>{user.info.phone}</span>
														</p>
													)}
													{user.info?.country && (
														<p className={cn("space-x-2")}>
															<span className={cn("text-gray-400")}>
																Country
															</span>
															<span>{user.info.country}</span>
														</p>
													)}
													{user.info?.dob && (
														<p className={cn("space-x-2")}>
															<span className={cn("text-gray-400")}>
																Date of Birth
															</span>
															<span>
																{new Date(user.info.dob).toLocaleDateString()}
															</span>
														</p>
													)}
													<p className={cn("space-x-2")}>
														<span className={cn("text-gray-400")}>Created</span>
														<span>
															{user.createdAt
																? new Date(user.createdAt).toLocaleDateString()
																: "N/A"}
														</span>
													</p>
													{user.updatedAt &&
														user.createdAt &&
														new Date(user.updatedAt).getTime() !==
															new Date(user.createdAt).getTime() && (
															<p className={cn("space-x-2")}>
																<span className={cn("text-gray-400")}>
																	Updated
																</span>
																<span>
																	{new Date(
																		user.updatedAt,
																	).toLocaleDateString()}
																</span>
															</p>
														)}
													{user.banned && (
														<>
															{user.banReason && (
																<p className={cn("space-x-2")}>
																	<span className={cn("text-gray-400")}>
																		Ban Reason
																	</span>
																	<span className="break-words text-red-500">
																		{user.banReason}
																	</span>
																</p>
															)}
															{user.banExpires ? (
																<p className={cn("space-x-2")}>
																	<span className={cn("text-gray-400")}>
																		Ban Expires
																	</span>
																	<span>
																		{new Date(
																			user.banExpires,
																		).toLocaleDateString()}
																	</span>
																</p>
															) : (
																<p className={cn("space-x-2")}>
																	<span className={cn("text-gray-400")}>
																		Ban Status
																	</span>
																	<span className="text-red-500">
																		Permanent
																	</span>
																</p>
															)}
														</>
													)}
													<div className="flex gap-2 pt-2">
														<NativeButton
															variant="outline"
															size="sm"
															className="flex-1"
															onClick={(e) => {
																e.stopPropagation();
																const userToEdit = users.find(
																	(u) => u.id === user.id,
																);
																if (userToEdit) {
																	setEditUserId(userToEdit.id);

																	// Parse phone number to extract country code
																	let phoneNumber =
																		userToEdit.info?.phone || "";
																	let phoneCountryCode = "";

																	// Find country code from phone number
																	if (phoneNumber) {
																		for (const country of countries) {
																			if (
																				phoneNumber.startsWith(country.code)
																			) {
																				phoneCountryCode = country.code;
																				phoneNumber = phoneNumber.substring(
																					country.code.length,
																				);
																				break;
																			}
																		}
																	}

																	editForm.setFieldValue(
																		"name",
																		userToEdit.name || "",
																	);
																	editForm.setFieldValue(
																		"country",
																		userToEdit.info?.country || "",
																	);
																	editForm.setFieldValue("phone", phoneNumber);
																	editForm.setFieldValue(
																		"dob",
																		userToEdit.info?.dob
																			? new Date(userToEdit.info.dob)
																			: undefined,
																	);

																	// Set country code and find matching country
																	if (userToEdit.info?.country) {
																		const country = countries.find(
																			(c) =>
																				c.name === userToEdit.info?.country,
																		);
																		if (country) {
																			setEditCountryCode(country.code);
																		} else if (phoneCountryCode) {
																			setEditCountryCode(phoneCountryCode);
																		}
																	} else if (phoneCountryCode) {
																		setEditCountryCode(phoneCountryCode);
																	}

																	setEditDialogOpen(true);
																}
															}}
														>
															Edit
														</NativeButton>
														{user.banned ? (
															<NativeButton
																variant="outline"
																size="sm"
																className="flex-1"
																onClick={(e) => {
																	e.stopPropagation();
																	unblockUserMutation.mutate({
																		userId: user.id,
																	});
																}}
																disabled={unblockUserMutation.isPending}
															>
																{unblockUserMutation.isPending
																	? "Unblocking..."
																	: "Unblock"}
															</NativeButton>
														) : (
															<NativeButton
																variant="destructive"
																size="sm"
																className="flex-1"
																onClick={(e) => {
																	e.stopPropagation();
																	setBlockUserId(user.id);
																	setBlockDialogOpen(true);
																}}
															>
																Block
															</NativeButton>
														)}
													</div>
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
														<NativeButton variant="outline" size="sm">
															Open New Account
														</NativeButton>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Open New Account</DialogTitle>
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
																		<NativeButton
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
																		</NativeButton>
																		<NativeButton
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
																		</NativeButton>
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
																		${formatAmount(account.balance)}
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
																		${formatAmount(account.total)}
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

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
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

interface UserFormData {
	name: string;
	email: string;
	password?: string;
	role?: string;
}

export default function AdminPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formData, setFormData] = useState<UserFormData>({
		name: "",
		email: "",
		password: "",
		role: "",
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
									<Card
										key={user.id}
										className={cn("gap-4 border-primary bg-transparent")}
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

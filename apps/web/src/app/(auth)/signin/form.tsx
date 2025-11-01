"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function SignInForm() {
	const router = useRouter();

	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						router.push(routes.protected.dashboard);
					},
					onError: (ctx) => {
						if (ctx.error.status === 403) {
							toast.error("Invalid email or password");
						}

						toast.error(ctx.error.message || ctx.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-12"
		>
			<div>
				<form.Field name="email">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name} className={cn("text-2xl text-white")}>
								Email
							</Label>
							<Input
								id={field.name}
								name={field.name}
								type="email"
								placeholder="Your email address"
								className={cn(
									"rounded-none border-0 border-b px-2 py-6 placeholder:text-lg focus-visible:ring-0",
								)}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							{field.state.meta.errors.map((error) => (
								<p key={error?.message} className="text-red-500">
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>
			</div>

			<div>
				<form.Field name="password">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name} className={cn("text-2xl text-white")}>
								Password
							</Label>
							<Input
								id={field.name}
								name={field.name}
								type="password"
								placeholder="Client portal password"
								className={cn(
									"rounded-none border-0 border-b px-2 py-6 placeholder:text-lg focus-visible:ring-0",
								)}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							{field.state.meta.errors.map((error) => (
								<p key={error?.message} className="text-red-500">
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>
			</div>

			<form.Subscribe>
				{(state) => (
					<Button
						type="submit"
						className="w-full rounded-full py-8"
						disabled={!state.canSubmit || state.isSubmitting}
					>
						{state.isSubmitting ? "Signing In..." : "Sign In"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}

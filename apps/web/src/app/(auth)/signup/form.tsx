"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { NativeButton } from "@/components/ui/native-button";
import { authClient } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

export function SignUpForm() {
	const { isPending } = authClient.useSession();

	const createInfpMutation = useMutation(
		orpc.auth.createInfo.mutationOptions({
			onSuccess: () => {
				form.reset();
			},
			onError: (error: Error) => {
				toast.error(error.message);
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			phone: "",
			country: "",
		},
		onSubmit: async ({ value }) => {
			const { data } = await authClient.signUp.email(
				{
					name: "",
					email: value.email,
					password: value.password,
					callbackURL: routes.protected.dashboard,
				},
				{
					onSuccess: () => {
						toast.success(
							"Account created! Please check your email to verify your email.",
						);
					},
					onError: (ctx) => {
						toast.error(ctx.error.message || ctx.error.statusText);
					},
				},
			);

			if (data) {
				const userId = data.user.id;

				createInfpMutation.mutate({
					country: value.country,
					phone: value.phone,
					userId: userId,
				});
			}
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
				phone: z
					.string()
					.min(10, "Phone number must be at least 10 characters"),
				country: z.string().min(2, "Country must be at least 2 characters"),
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
			className="space-y-6 lg:space-y-12"
		>
			<div>
				<form.Field name="email">
					{(field) => (
						<div className="space-y-2">
							<Label
								htmlFor={field.name}
								className={cn("text-lg text-white lg:text-2xl")}
							>
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
							<Label
								htmlFor={field.name}
								className={cn("text-lg text-white lg:text-2xl")}
							>
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

			<div>
				<form.Field name="country">
					{(field) => (
						<div className="space-y-2">
							<Label
								htmlFor={field.name}
								className={cn("text-lg text-white lg:text-2xl")}
							>
								Country
							</Label>
							<Input
								id={field.name}
								name={field.name}
								type="text"
								placeholder="Where do you live"
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
							<p className="text-sm text-white/80">
								Please ensure your country of residence is accurate
							</p>
						</div>
					)}
				</form.Field>
			</div>

			<form.Subscribe>
				{(state) => (
					<NativeButton
						type="submit"
						className="w-full rounded-full py-8"
						disabled={!state.canSubmit || state.isSubmitting}
					>
						{state.isSubmitting ? "Creating Account..." : "Create Account"}
					</NativeButton>
				)}
			</form.Subscribe>
		</form>
	);
}

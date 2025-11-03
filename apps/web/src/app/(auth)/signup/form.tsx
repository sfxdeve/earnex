"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { NativeButton } from "@/components/ui/native-button";
import { authClient } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";
import { content } from "./content";

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
			name: "",
			email: "",
			password: "",
			phone: "",
			country: "",
			acceptTerms: false,
		},
		onSubmit: async ({ value }) => {
			const { data } = await authClient.signUp.email(
				{
					name: value.name,
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
				name: z.string().min(2, "Name must be at least 2 characters"),
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
				phone: z
					.string()
					.min(10, "Phone number must be at least 10 characters"),
				country: z.string().min(2, "Country must be at least 2 characters"),
				acceptTerms: z.boolean().refine((val) => val === true, {
					message: "You must agree to the Privacy Policy and Terms of Service",
				}),
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
			className="space-y-4 lg:space-y-6"
		>
			<div>
				<form.Field name="name">
					{(field) => (
						<div className="space-y-1.5">
							<Label
								htmlFor={field.name}
								className={cn("text-base text-white lg:text-lg")}
							>
								Name
							</Label>
							<Input
								id={field.name}
								name={field.name}
								type="text"
								placeholder="Your full name"
								className={cn(
									"rounded-none border-0 border-b px-2 py-6 placeholder:text-base focus-visible:ring-0",
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
				<form.Field name="email">
					{(field) => (
						<div className="space-y-1.5">
							<Label
								htmlFor={field.name}
								className={cn("text-base text-white lg:text-lg")}
							>
								Email
							</Label>
							<Input
								id={field.name}
								name={field.name}
								type="email"
								placeholder="Your email address"
								className={cn(
									"rounded-none border-0 border-b px-2 py-6 placeholder:text-base focus-visible:ring-0",
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
						<div className="space-y-1.5">
							<Label
								htmlFor={field.name}
								className={cn("text-base text-white lg:text-lg")}
							>
								Password
							</Label>
							<Input
								id={field.name}
								name={field.name}
								type="password"
								placeholder="Client portal password"
								className={cn(
									"rounded-none border-0 border-b px-2 py-6 placeholder:text-base focus-visible:ring-0",
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
				<form.Field name="phone">
					{(field) => (
						<div className="space-y-1.5">
							<Label
								htmlFor={field.name}
								className={cn("text-base text-white lg:text-lg")}
							>
								Phone
							</Label>
							<Input
								id={field.name}
								name={field.name}
								type="tel"
								placeholder="Your phone number"
								className={cn(
									"rounded-none border-0 border-b px-2 py-6 placeholder:text-base focus-visible:ring-0",
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
						<div className="space-y-1.5">
							<Label
								htmlFor={field.name}
								className={cn("text-base text-white lg:text-lg")}
							>
								Country
							</Label>
							<Input
								id={field.name}
								name={field.name}
								type="text"
								placeholder="Where do you live"
								className={cn(
									"rounded-none border-0 border-b px-2 py-6 placeholder:text-base focus-visible:ring-0",
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
				<form.Field name="acceptTerms">
					{(field) => (
						<div className="space-y-1.5">
							<div className="flex items-start gap-3 space-y-0">
								<Checkbox
									id={field.name}
									checked={field.state.value}
									onCheckedChange={(checked) =>
										field.handleChange(checked === true)
									}
									onBlur={field.handleBlur}
									className="mt-1 rounded-sm"
								/>
								<Label
									htmlFor={field.name}
									className={cn(
										"cursor-pointer text-sm leading-7 sm:text-base",
									)}
								>
									{content.form.note}
								</Label>
							</div>
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

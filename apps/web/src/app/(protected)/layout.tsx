"use client";

import { usePathname, useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Header } from "./_components/header";

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
	const router = useRouter();
	const pathname = usePathname();

	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!isPending && !session?.user) {
			router.push(routes.auth.signIn);
		}

		if (
			!isPending &&
			session?.user.role === "admin" &&
			!pathname.startsWith(routes.protected.admin.index)
		) {
			router.push(routes.protected.admin.index);
		}

		if (
			!isPending &&
			session?.user.role !== "admin" &&
			pathname.startsWith(routes.protected.admin.index)
		) {
			router.push(routes.protected.dashboard);
		}
	}, [session, isPending, router, pathname]);

	if (isPending) {
		return (
			<main>
				<section
					className={cn(
						"relative flex min-h-dvh flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-24 lg:py-12",
					)}
				>
					<div
						className={cn(
							"container mx-auto flex flex-1 items-center justify-center",
						)}
					>
						<Loader />
					</div>
				</section>
			</main>
		);
	}

	if (!session?.user) {
		return null;
	}

	return (
		<main>
			<section
				className={cn(
					"relative flex min-h-dvh flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-24 lg:py-12",
				)}
			>
				<div
					className={cn(
						"container mx-auto flex flex-1 flex-col space-y-8 sm:space-y-12 lg:space-y-16",
					)}
				>
					<Header />
					{children}
				</div>
			</section>
		</main>
	);
}

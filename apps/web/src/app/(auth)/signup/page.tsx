import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets";
import { cn } from "@/lib/utils";
import { content } from "./content";
import { SignUpForm } from "./form";

export default function SignUpPage() {
	return (
		<main>
			<section
				className={cn(
					"relative flex min-h-screen flex-col p-4 py-8 sm:p-8 sm:py-12 lg:p-24",
				)}
			>
				<Image
					src={assets.pattern.src}
					alt={assets.pattern.alt}
					className={cn(
						"-z-50 absolute inset-0 size-full rotate-180 object-fill",
					)}
				/>

				<div
					className={cn(
						"container mx-auto flex flex-1 flex-col gap-8 lg:flex-row",
					)}
				>
					{/* Left Section */}
					<div className={cn("flex flex-1 flex-col justify-between gap-6")}>
						{/* Brand */}
						<div>
							<h1 className={cn("font-bold text-xl sm:text-2xl lg:text-3xl")}>
								{content.brand}
							</h1>
						</div>

						{/* Main Heading */}
						<div className={cn("space-y-6 sm:space-y-8 lg:space-y-12")}>
							<h2
								className={cn(
									"text-3xl tracking-wider sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
								)}
							>
								{content.heading.title} <br />
								<span className={cn("font-bold")}>
									{content.heading.highlight}
								</span>
							</h2>

							{/* Auth Link */}
							<p className={cn("text-base sm:text-lg lg:text-xl xl:text-2xl")}>
								{content.auth.question}{" "}
								<Link
									href={content.auth.linkUrl}
									className="font-semibold underline"
								>
									{content.auth.linkText}
								</Link>
							</p>
						</div>

						{/* Footer */}
						<div>
							<p className={cn("text-sm sm:text-base lg:text-lg")}>
								{content.footer.text}
							</p>
						</div>
					</div>

					{/* Right Section */}
					<div className={cn("flex flex-1 flex-col justify-between gap-6")}>
						<div className={cn("space-y-4")}>
							<h3 className={cn("font-bold text-lg tracking-wide sm:text-xl")}>
								{content.form.heading}
							</h3>
							<h4
								className={cn(
									"text-2xl tracking-wider sm:text-3xl lg:text-4xl",
								)}
							>
								{content.form.subheading}
							</h4>
						</div>

						{/* Sign Up Form */}
						<SignUpForm />

						{/* Info Text */}
						<div className={cn("space-y-4")}>
							<p className={cn("text-sm leading-7 sm:text-base")}>
								{content.form.note}
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

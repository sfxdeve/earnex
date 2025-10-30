import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets";
import { cn } from "@/lib/utils";
import { content } from "./content";
import { SignInForm } from "./form";

export default function SignInPage() {
	return (
		<main>
			<section className={cn("relative flex min-h-screen flex-col p-24")}>
				<Image
					src={assets.pattern.src}
					alt={assets.pattern.alt}
					className={cn(
						"-z-50 absolute inset-0 size-full rotate-180 object-fill",
					)}
				/>

				<div className={cn("container mx-auto flex flex-1")}>
					{/* Left Section */}
					<div className={cn("flex flex-1 flex-col justify-between gap-6")}>
						{/* Brand */}
						<div>
							<h1 className={cn("font-bold text-3xl")}>{content.brand}</h1>
						</div>

						{/* Main Heading */}
						<div className={cn("space-y-12")}>
							<h2 className={cn("text-7xl tracking-wider")}>
								{content.heading.title} <br />
								<span className={cn("font-bold")}>
									{content.heading.highlight}
								</span>
							</h2>

							{/* Auth Link */}
							<p className={cn("text-2xl")}>
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
							<p className={cn("text-lg")}>{content.footer.text}</p>
						</div>
					</div>

					{/* Right Section */}
					<div className={cn("flex flex-1 flex-col justify-between gap-6")}>
						<div className={cn("space-y-4")}>
							<h3 className={cn("font-bold text-xl tracking-wide")}>
								{content.form.heading}
							</h3>
							<h4 className={cn("text-4xl tracking-wider")}>
								{content.form.subheading}
							</h4>
						</div>

						{/* Sign In Form */}
						<SignInForm />

						{/* Info Text */}
						<div className={cn("space-y-4")}>
							<p className={cn("leading-7")}>{content.form.note}</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

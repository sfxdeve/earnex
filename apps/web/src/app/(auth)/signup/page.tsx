import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets";
import { cn } from "@/lib/utils";
import { content } from "./content";

export default function SignUpPage() {
	return (
		<main>
			<section className={cn("relative flex min-h-[95vh] flex-col p-24")}>
				<Image
					src={assets.pattern.src}
					alt={assets.pattern.alt}
					className={cn(
						"-z-50 absolute inset-0 size-full rotate-180 object-fill",
					)}
				/>
				<div className={cn("container mx-auto flex flex-1")}>
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
								<Link href={content.auth.linkUrl}>{content.auth.linkText}</Link>
							</p>
						</div>

						{/* Footer */}
						<div>
							<p className={cn("text-lg")}>{content.footer.text}</p>
						</div>
					</div>

					<div className={cn("flex-1")} />
				</div>
			</section>
		</main>
	);
}

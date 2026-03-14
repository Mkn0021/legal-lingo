import React from "react";
import Link from "next/link";
import { Navbar } from "./navbar";
import { Button } from "@/components/ui/button";
import { GradientBackground } from "./gradient-background";

export function HeroSection() {
	return (
		<HeroContainer>
			<Navbar />
			<div className="py-16 sm:py-24">
				<h1 className="font-display text-5xl font-medium tracking-tight text-balance text-gray-950 sm:text-6xl lg:text-8xl">
					Sign documents, Not confusion.
				</h1>
				<p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
					Upload any legal document. We translate it, flag the traps, and explain everything.
				</p>
				<div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
					<Button asChild>
						<Link href="/scan">Try LegalLingo</Link>
					</Button>
					<Button variant="secondary" asChild>
						<Link target="_blank" href="https://github.com/Mkn0021/legal-lingo">
							View on GitHub
						</Link>
					</Button>
				</div>
			</div>
		</HeroContainer>
	);
}

const HeroContainer = ({ children }: { children?: React.ReactNode }) => (
	<div className="relative max-w-full overflow-hidden">
		<GradientBackground className="ring-1 ring-black/5 ring-inset" />
		<div className="relative px-6 lg:px-8">
			<div className="mx-auto max-w-2xl lg:max-w-7xl">{children}</div>
		</div>
	</div>
);


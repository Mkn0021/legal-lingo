import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

interface BaseProps {
	children: React.ReactNode;
	className?: string;
}

export function Section({
	children,
	className,
}: BaseProps) {
	return (
		<section className={cn("px-6 pt-24 lg:px-8", className)}>
			<div className="mx-auto max-w-2xl lg:max-w-7xl">
				{children}
			</div>
		</section>
	);
}

export const SectionTitle = ({ children, className }: BaseProps) => (
	<h3 className={cn("max-w-3xl text-4xl font-medium tracking-tighter text-pretty text-gray-950 data-dark:text-white md:text-6xl", className)}>
		{children}
	</h3>
);

export const SectionPin = ({ children, className }: BaseProps) => (
	<h2 className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mb-4 shadow-sm cursor-text", className)}>
		{children}
	</h2>
);

export const SectionContent = ({ children, className }: BaseProps) => (
	<div className={cn("mt-10 sm:mt-16", className)}>
		{children}
	</div>
);

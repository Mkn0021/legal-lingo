import React from "react";
import { cn } from "@/lib/utils";
import { Section, SectionContent, SectionPin, SectionTitle } from "./section";

const features: Feature[] = [
	{
		pinLabel: "Upload",
		title: "Drop your legal document.",
		description:
			"Upload any lease, employment contract, or visa letter as a PDF or DOCX. We extract and prepare it instantly.",
		className: "max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl",
		children: <div className="h-full" />,
	},
	{
		pinLabel: "Translate",
		title: "Get the full picture.",
		description:
			"We translate your document using Lingo.dev, preserving legal structure, tone, and clause formatting throughout.",
		className: "lg:col-span-3 lg:rounded-tr-4xl",
		children: <div className="h-full" />,
	},
	{
		pinLabel: "Detect",
		title: "Flag the hidden traps.",
		description:
			"Legal concepts with no equivalent in your country are highlighted automatically, so nothing gets lost in translation.",
		className: "lg:col-span-2 lg:rounded-bl-4xl",
		children: <div className="h-full" />,
	},
	{
		pinLabel: "Understand",
		title: "Read the plain truth.",
		description:
			"Every flagged term comes with a plain-language explanation of what it means and whether it exists in your legal system.",
		className: "lg:col-span-2",
		children: <div className="h-full" />,
	},
	{
		pinLabel: "Ask",
		title: "Chat with your document.",
		description:
			"Ask questions about any clause in your language. Get answers grounded in your specific document, not generic legal advice.",
		className: "lg:col-span-2 lg:rounded-br-4xl",
		children: <div className="h-full" />,

	},
]

export function FeatureSection() {
	return (
		<Section>
			<SectionPin>Features</SectionPin>
			<SectionTitle>Language should never <br /> block your legal rights.</SectionTitle>
			<SectionContent className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2">
				{features.map((feature) => (
					<FeatureSkeleton key={feature.pinLabel} {...feature} />
				))}
			</SectionContent>
		</Section>
	);
}

interface Feature {
	pinLabel: string;
	title: string;
	description: string;
	className: string;
	children: React.JSX.Element;
}

const FeatureSkeleton = (feature: Feature) => (
	<div
		className={cn(
			"group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-xs ring-1 ring-black/5 data-dark:bg-gray-800 data-dark:ring-white/15",
			feature.className,
		)}
	>
		<div className="flex min-h-80 flex-1 flex-col justify-stretch">
			{feature.children}
		</div>
		<div className="relative p-8 sm:p-10">
			<h3 className="font-mono text-xs/5 font-semibold tracking-widest text-gray-500 uppercase data-dark:text-gray-400">
				{feature.pinLabel}
			</h3>
			<p className="mt-1 text-2xl/8 font-medium tracking-tight text-gray-950 group-data-dark:text-white">
				{feature.title}
			</p>
			<p className="mt-2 max-w-150 text-sm/6 text-gray-600 group-data-dark:text-gray-400">
				{feature.description}
			</p>
		</div>
	</div>
);

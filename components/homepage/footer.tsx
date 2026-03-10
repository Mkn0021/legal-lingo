import React from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { Grid } from "./grid";
import { Button } from "@/components/ui/button";
import { GradientBackground } from "./gradient-background";
import { FacebookIcon, LinkedinIcon, XIcon } from "@/components/ui/icons";
import { SectionPin } from "./section";

const footerLinks = [
	{
		title: "Product",
		links: [
			{ label: "Pricing", href: "#" },
			{ label: "Analysis", href: "#" },
			{ label: "API", href: "#" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "Careers", href: "#" },
			{ label: "Blog", href: "#" },
			{ label: "Company", href: "#" },
		],
	},
	{
		title: "Support",
		links: [
			{ label: "Help center", href: "#" },
			{ label: "Community", href: "#" },
		],
	},
	{
		title: "Legal",
		links: [
			{ label: "Terms of service", href: "#" },
			{ label: "Privacy policy", href: "#" },
		],
	},
] as const;

const socialLinks = [
	{
		label: "Visit us on Facebook",
		href: "https://facebook.com",
		Icon: FacebookIcon,
	},
	{
		label: "Visit us on X",
		href: "https://x.com",
		Icon: XIcon,
	},
	{
		label: "Visit us on LinkedIn",
		href: "https://linkedin.com",
		Icon: LinkedinIcon,
	},
] as const;

export function Footer() {
	return (
		<FooterContainer>
			<div className="relative pt-20 pb-16 text-center sm:py-24">
				<hgroup>
					<SectionPin className="mx-auto">
						Get started
					</SectionPin>
					<p className="text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl">
						Don't sign blind. <br /> Upload your document and get clarity.
					</p>
				</hgroup>
				<p className="mx-auto mt-6 text-sm/6 text-gray-500">
					No lawyers needed. Upload any legal document and understand it in your language.
				</p>
				<Button className="mt-6 py-3 px-4">
					<Link href="#">Analyze your document</Link>
				</Button>
			</div>
			<div className="pb-16">
				<Grid.Row bottom={false}>
					<div className="grid grid-cols-2 gap-y-10 py-6 lg:grid-cols-6 lg:gap-8">
						<Grid.Cell className="hidden lg:flex col-span-2 justify-start pt-6 lg:pb-6" bottom={false} top={false}>
							<Logo />
						</Grid.Cell>
						<FooterLink />
					</div>
				</Grid.Row>
				<Grid.Row className="flex items-center justify-between">
					<Grid.Cell className="py-2 text-sm/6 text-gray-950 px-4">
						© 2026 LegalLingo Inc.
					</Grid.Cell>
					<Grid.Cell className="gap-8 py-3 px-4">
						<SocialLinks />
					</Grid.Cell>
				</Grid.Row>
			</div>
		</FooterContainer>
	);
}

const FooterContainer = ({ children }: { children: React.ReactNode }) => (
	<footer className="relative mt-24">
		<GradientBackground className="inset-0 rounded-none" />
		<div className="absolute inset-2 rounded-4xl bg-white/80" />
		<div className="px-6 lg:px-8">
			<div className="mx-auto max-w-2xl lg:max-w-7xl">{children}</div>
		</div>
	</footer>
);

const FooterLink = () => (
	<div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-12 md:col-span-4 md:grid-cols-subgrid">
		{footerLinks.map((section) => (
			<div key={section.title}>
				<h3 className="text-[16px]/6 font-medium text-gray-950/50">
					{section.title}
				</h3>

				<ul className="mt-6 space-y-2 text-sm/6">
					{section.links.map((link) => (
						<li key={link.label}>
							<a
								className="font-medium text-gray-950 data-hover:text-gray-950/75"
								href={link.href}
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>
			</div>
		))}
	</div>
);

const SocialLinks = () => (
	<>
		{socialLinks.map(({ href, label, Icon }) => (
			<Link
				key={href}
				target="_blank"
				rel="noreferrer"
				aria-label={label}
				className="text-gray-950 data-hover:text-gray-950/75"
				href={href}
			>
				<Icon />
			</Link>
		))}
	</>
);

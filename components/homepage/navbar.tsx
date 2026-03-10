import React from "react";
import { Grid} from "./grid";
import Link from "next/link";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { ArrowRight, MenuIcon } from "@/components/ui/icons";

const navList = [
	{ title: "Home", link: "/" },
	{ title: "About", link: "#" },
	{ title: "Services", link: "#" },
	{ title: "Login", link: "/login" },
];

export function Navbar() {
	return (
		<header className="pt-12 sm:pt-16">
			<Grid.Row className="flex justify-between">
				<div className="relative flex gap-6">
					<Grid.Cell className="py-3">
						<Logo />
					</Grid.Cell>
					<Banner href="#" className="hidden lg:flex">
						Introducing Legal Lingo: Your AI-Powered Legal Assistant
					</Banner>
				</div>
				<DesktopNavbar />
				<HamburgerMenu />
			</Grid.Row>
		</header>
	);
}

const DesktopNavbar = () => (
	<nav className="relative hidden lg:flex">
		{navList.map((item) => (
			<Grid.Cell key={item.title}>
				<Link
					href={item.link}
					className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply hover:bg-black/2.5"
				>
					{item.title}
				</Link>
			</Grid.Cell>
		))}
	</nav>
);

type BannerProps = React.ComponentProps<typeof Link> & {
  children: React.ReactNode;
  className?: string;
};

const Banner = ({ children, className, ...props }: BannerProps) => (
	<div className={cn("relative items-center py-3", className)}>
		<Link
			className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white hover:bg-fuchsia-950/30"
			{...props}
		>
			{children}
			<ArrowRight />
		</Link>
	</div>
);

const HamburgerMenu = () => (
	<button
		className="flex size-12 items-center justify-center self-center rounded-lg hover:bg-black/5 lg:hidden"
		aria-label="Open main menu"
		type="button"
		aria-expanded="false"
	>
		<MenuIcon />
	</button>
);

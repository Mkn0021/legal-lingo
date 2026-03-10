import { cn } from "@/lib/utils";

export const GradientBackground = ({ className }: { className?: string }) => (
	<div
		className={cn(
			"absolute inset-2 bottom-0 rounded-4xl bg-linear-115 from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff] sm:bg-linear-145",
			className,
		)}
	/>
);
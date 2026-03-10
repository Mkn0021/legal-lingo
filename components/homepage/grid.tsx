import { cn } from "@/lib/utils";
import { PlusIcon } from "@/components/ui/icons";

interface BaseProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	className?: string;
	top?: boolean;
	bottom?: boolean;
}

function Row({ children, className, top = true, bottom = true, ...props }: BaseProps) {
	return (
		<div
			className={cn(
				"relative isolate pt-[calc(--spacing(2)+1px)] last:pb-[calc(--spacing(2)+1px)]",
				className
			)}
			{...props}
		>
			<Border top={top} bottom={bottom} />
			{children}
		</div>
	);
}

function Border({ className, top = true, bottom = true, ...props }: BaseProps) {
	return (
		<div className={cn("absolute inset-y-0 left-1/2 w-screen -translate-x-1/2", className)} {...props}>
			{top && (
				<>
					<div className="absolute inset-x-0 top-0 border-t border-black/5" />
					<div className="absolute inset-x-0 top-2 border-t border-black/5" />
				</>
			)}
			{bottom && (
				<>
					<div className="absolute inset-x-0 bottom-0 border-b border-black/5" />
					<div className="absolute inset-x-0 bottom-2 border-b border-black/5" />
				</>
			)}
		</div>
	);
}

function Cell({ children, className, top = true, bottom = true, ...props }: BaseProps) {
	return (
		<div className={cn("relative flex items-center justify-center", className)} {...props}>
			{top && (
				<>
					<PlusIcon className="-top-2 -left-2 absolute" />
					<PlusIcon className="-top-2 -right-2 absolute" />
				</>
			)}
			{bottom && (
				<>
					<PlusIcon className="-bottom-2 -left-2 absolute" />
					<PlusIcon className="-bottom-2 -right-2 absolute" />
				</>
			)}
			{children}
		</div>
	);
}

export const Grid = {
	Row,
	Cell,
	Border,
};
import { cn } from "@/lib/utils";

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 34 34" fill="none" className="h-9 fill-black" {...props}>
		<path d="M19.598 18.5a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3m3.634-8.294a2 2 0 1 1-3.464-2 2 2 0 0 1 3.464 2m-3.464 15.588a2 2 0 1 1 3.464-2 2 2 0 0 1-3.464 2M26 19a2 2 0 1 1 0-4 2 2 0 0 1 0 4m-11.768 6.794a2 2 0 1 1-3.464-2 2 2 0 0 1 3.464 2m-3.464-15.588a2 2 0 1 1 3.464-2 2 2 0 0 1-3.464 2M8 19a2 2 0 1 1 0-4 2 2 0 0 1 0 4M25.866 3.644a1 1 0 1 1-1.732-1 1 1 0 0 1 1.732 1M33 18a1 1 0 1 1 0-2 1 1 0 0 1 0 2m-1.644-8.134a1 1 0 1 1-1-1.732 1 1 0 0 1 1 1.732m-1 16a1 1 0 1 1 1-1.732 1 1 0 0 1-1 1.732M16 33a1 1 0 1 1 2 0 1 1 0 0 1-2 0m8.134-1.643a1 1 0 1 1 1.732-1 1 1 0 0 1-1.732 1m-14.268-.001a1 1 0 1 1-1.732-1 1 1 0 0 1 1.732 1M1 18a1 1 0 1 1 0-2 1 1 0 0 1 0 2m2.643 7.866a1 1 0 1 1-1-1.732 1 1 0 0 1 1 1.732m-.999-16a1 1 0 1 1 1-1.732 1 1 0 0 1-1 1.732M16 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0M8.134 3.644a1 1 0 1 1 1.732-1 1 1 0 0 1-1.732 1" />
	</svg>
);

export const GoogleIcon = () => (
	<svg className="size-4" viewBox="0 0 24 24">
		<path
			fill="#4285F4"
			d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
		/>
		<path
			fill="#34A853"
			d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
		/>
		<path
			fill="#FBBC05"
			d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
		/>
		<path
			fill="#EA4335"
			d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
		/>
	</svg>
);

export const PlusIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 15 15"
		aria-hidden="true"
		className={cn("absolute size-3.75 fill-black/10", className)}
	>
		<path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z"></path>
	</svg>
);

export const ArrowRight = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 16 16"
		fill="currentColor"
		aria-hidden="true"
		data-slot="icon"
		className="size-4"
	>
		<path
			fillRule="evenodd"
			d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
			clipRule="evenodd"
		></path>
	</svg>
);

export const MenuIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
		data-slot="icon"
		className="size-6"
	>
		<path
			fillRule="evenodd"
			d="M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
			clipRule="evenodd"
		></path>
	</svg>
);

export const FacebookIcon = () => (
	<svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M16 8.05C16 3.603 12.418 0 8 0S0 3.604 0 8.05c0 4.016 2.926 7.346 6.75 7.95v-5.624H4.718V8.05H6.75V6.276c0-2.017 1.194-3.131 3.022-3.131.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.62-1.304 1.257v1.51h2.219l-.355 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.95z"
		></path>
	</svg>
);

export const XIcon = () => (
	<svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
		<path d="M12.6 0h2.454l-5.36 6.778L16 16h-4.937l-3.867-5.594L2.771 16H.316l5.733-7.25L0 0h5.063l3.495 5.114L12.6 0zm-.86 14.376h1.36L4.323 1.539H2.865l8.875 12.837z"></path>
	</svg>
);

export const LinkedinIcon = () => (
	<svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
		<path d="M14.82 0H1.18A1.169 1.169 0 000 1.154v13.694A1.168 1.168 0 001.18 16h13.64A1.17 1.17 0 0016 14.845V1.15A1.171 1.171 0 0014.82 0zM4.744 13.64H2.369V5.996h2.375v7.644zm-1.18-8.684a1.377 1.377 0 11.52-.106 1.377 1.377 0 01-.527.103l.007.003zm10.075 8.683h-2.375V9.921c0-.885-.015-2.025-1.234-2.025-1.218 0-1.425.966-1.425 1.968v3.775H6.233V5.997H8.51v1.05h.032c.317-.601 1.09-1.235 2.246-1.235 2.405-.005 2.851 1.578 2.851 3.63v4.197z"></path>
	</svg>
);

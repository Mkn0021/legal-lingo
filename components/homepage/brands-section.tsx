import React from "react";
import Image from "next/image";

const brands = [
	{
		name: "SavvyCal",
		url: "https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-gray-900.svg",
	},
	{
		name: "Transistor",
		url: "https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-gray-900.svg",
	},
	{
		name: "Reform",
		url: "https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-gray-900.svg",
	},
	{
		name: "Tuple",
		url: "https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-gray-900.svg",
	},
	{
		name: "Statamic",
		url: "https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-gray-900.svg",
	},
];

export function BrandsSection() {
	return (
		<Container>
			{brands.map((brand) => (
				<Image
					key={brand.name}
					src={brand.url}
					alt={brand.name}
					width={158}
					height={48}
					className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
				/>
			))}
		</Container>
	);
}

const Container = ({ children }: { children: React.ReactNode }) => (
	<div className="my-10 px-6 lg:px-8">
		<div className="mx-auto max-w-2xl lg:max-w-7xl">
			<div className="flex justify-between max-sm:mx-auto max-sm:max-w-md max-sm:flex-wrap max-sm:justify-evenly max-sm:gap-x-4 max-sm:gap-y-4">
				{children}
			</div>
		</div>
	</div>
);

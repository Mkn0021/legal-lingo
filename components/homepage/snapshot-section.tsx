import { Section, SectionContent, SectionPin, SectionTitle } from "./section";

export function SnapshotSection() {
	return (
		<Section>
			<SectionPin>
				AI powered
			</SectionPin>
			<SectionTitle>
				The meaning behind <br /> every legal term explained.
			</SectionTitle>
			<SectionContent className="relative aspect-1216/768 h-144 [--radius:var(--radius-xl)] sm:h-auto sm:w-304">
				<div className="absolute -inset-(--padding) rounded-[calc(var(--radius)+var(--padding))] shadow-xs ring-1 ring-black/5 [--padding:--spacing(2)]" />
				<div className="h-full rounded-lg shadow-2xl ring-1 ring-black/10" />
			</SectionContent>
		</Section>
	);
}


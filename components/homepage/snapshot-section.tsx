import { TopGradient } from "./gradient-background";
import { ProjectOverview } from "./project-overview";
import { Section, SectionBox, SectionPin, SectionTitle } from "./section";

export function SnapshotSection() {
	return (
		<Section>
			<SectionPin>
				AI powered
			</SectionPin>
			<SectionTitle>
				The meaning behind <br /> every legal term explained.
			</SectionTitle>
			<SectionBox className="aspect-1216/768 h-144 sm:h-auto sm:w-304">
				<div className="h-full w-full relative rounded-2xl overflow-hidden">
					<TopGradient />
					<ProjectOverview />
				</div>
			</SectionBox>
		</Section>
	);
}


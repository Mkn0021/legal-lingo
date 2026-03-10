import { Footer } from "@/components/homepage/footer";
import { HeroSection } from "@/components/homepage/hero-section";
import { BrandsSection } from "@/components/homepage/brands-section";
import { FeatureSection } from "@/components/homepage/feature-section";
import { SnapshotSection } from "@/components/homepage/snapshot-section";

export default function Home() {
	return (
		<div className="overflow-x-hidden">
			<HeroSection />
			<BrandsSection />
			<SnapshotSection />
			<FeatureSection />
			<Footer />
		</div>
	);
}

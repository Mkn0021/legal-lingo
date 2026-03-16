import { Metadata } from "next";
import { Footer } from "@/components/homepage/footer";
import { HeroSection } from "@/components/homepage/hero-section";
import { BrandsSection } from "@/components/homepage/brands-section";
import { FeatureSection } from "@/components/homepage/feature-section";
import { SnapshotSection } from "@/components/homepage/snapshot-section";

export const metadata: Metadata = {
	title: "LegalLingo - Understand Legal Documents in Your Language",
	description: "Sign documents, not confusion. Upload any legal document, get it translated with legal expertise, flag tricky terms, and chat about what you don't understand.",
	keywords: ["legal translation", "document analysis", "legal terms", "multilingual", "contract review"],
};

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

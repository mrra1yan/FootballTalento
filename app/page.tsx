import HeroSection from "./components/home/HeroSection";
import FeaturedPlayersSection from "./components/home/featured-players/FeaturedPlayersSection";
import StoriesHighlightsSection from "./components/home/StoriesHighlightsSection";
import HowItWorksSection from "./components/home/HowItWorksSection";
import TrustedClubs from "./components/home/TrustedClubs";
import RankingsPreview from "./components/home/rankings-preview/RankingsPreview";
import SafetyTrust from "./components/home/SafetyTrust";
import Testimonials from "./components/home/Testimonials";
export default function HomePage() {
	return (
		<>
			<main className="pt-20">
			    <HeroSection />
                <FeaturedPlayersSection />
                <StoriesHighlightsSection />
                <HowItWorksSection />
                <TrustedClubs />
                <RankingsPreview />
                <SafetyTrust />
                <Testimonials />
            </main>
		</>
	);
}

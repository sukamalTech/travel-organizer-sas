

// app/page.tsx
import LandingPageWrapper from "@/components/landing-page/LandingPageWrapper";
import Navbar from "@/components/landing-page/Navbar";
import OfflineLandingGate from "@/components/landing-page/OfflineLandingGate";
import HeroSection from "@/components/landing-page/HeroSection";
import SocialProofSection from "@/components/landing-page/SocialProofSection";
import ProblemAgitationMatrix from "@/components/landing-page/ProblemAgitationMatrix";
import CoreFeatureGrid from "@/components/landing-page/CoreFeatureGrid";
import InteractiveWorkflowTabs from "@/components/landing-page/InteractiveWorkflowTabs";
import PricingTiers from "@/components/landing-page/PricingTiers";
import FAQSection from "@/components/landing-page/FAQSection";
import Footer from "@/components/ui/Footer";
import TripWorkflowView from "@/components/dashboards/TripWorkflowView";
import TripWorkflowHero from "@/components/landing-page/TripWorkflowHero";

export default function DynamicExplorerLanding() {
  return (
    <LandingPageWrapper>
      <Navbar />
      <OfflineLandingGate>
        <HeroSection />
        <SocialProofSection />
        <TripWorkflowHero />
        <ProblemAgitationMatrix />
        <CoreFeatureGrid />
        <InteractiveWorkflowTabs />
        <PricingTiers />
        <FAQSection />
        <Footer />
        <TripWorkflowView />
      </OfflineLandingGate>
    </LandingPageWrapper>
  );
}
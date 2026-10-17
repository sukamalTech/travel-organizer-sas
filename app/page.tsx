// import { DeployButton } from "@/components/deploy-button";
// import { EnvVarWarning } from "@/components/env-var-warning";
// import { AuthButton } from "@/components/auth-button";

// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
// import Hero from "@/components/landing-page/Hero";

// export default function Home() {
//   return (
//     <main className="min-h-screen flex flex-col items-center">
//       <div className="flex-1 w-full flex flex-col gap-20 items-center">
//         <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//           <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
//             <div className="flex gap-5 items-center font-semibold">
//               <Link href={"/"}>TravellE</Link>

//             </div>
//             {!hasEnvVars ? (
//               <EnvVarWarning />
//             ) : (
//               <Suspense>
//                 <AuthButton />
//               </Suspense>
//             )}
//           </div>
//         </nav>

//       </div>
//       <Hero />
//     </main>
//   );
// }


//2nd start -------------------------------------------

// app/page.tsx (or wherever your landing page is)
import LandingPageWrapper from "@/components/landing-page/LandingPageWrapper";
import Navbar from "@/components/landing-page/Navbar";
import HeroSection from "@/components/landing-page/HeroSection";
import SocialProofSection from "@/components/landing-page/SocialProofSection";
import ProblemAgitationMatrix from "@/components/landing-page/ProblemAgitationMatrix";
import CoreFeatureGrid from "@/components/landing-page/CoreFeatureGrid";
import InteractiveWorkflowTabs from "@/components/landing-page/InteractiveWorkflowTabs";
import PricingTiers from "@/components/landing-page/PricingTiers";
import FAQSection from "@/components/landing-page/FAQSection";
import Footer from "@/components/ui/Footer";
import HeroExplorer from "@/components/landing-page/HeroExplorer";
import TripWorkflowView from "@/components/dashboards/TripWorkflowView";
import TripWorkflowHero from "@/components/landing-page/TripWorkflowHero";

export default async function DynamicExplorerLanding() {

  return (
    <LandingPageWrapper>
      <Navbar />
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
    </LandingPageWrapper>
  );
}
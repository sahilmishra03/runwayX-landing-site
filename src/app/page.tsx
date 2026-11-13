import Navbar from "@/components/Navbar";
import { Hero, CenterAI, Footer } from "@/components/Duna";
import { Intro, Features, Showcase, HowItWorks, Stats, Pricing, FAQ } from "@/components/Sections";
import VideoTour from "@/components/VideoTour";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="mx-auto max-w-[1100px] border-x border-line bg-paper">
          <VideoTour />
          <Intro />
          <Features />
          <Showcase />
          <HowItWorks />
        </div>
        <CenterAI />
        <div className="mx-auto max-w-[1100px] border-x border-line bg-paper">
          <Stats />
          <Pricing />
          <FAQ />
        </div>
      </main>
      <Footer />
    </>
  );
}

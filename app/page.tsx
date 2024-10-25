import EmailWaitlist from "@/components/email-waitlist";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import Particles from "@/components/ui/particles";
import { Navbar } from "@/components/navbar";
import Safari from "@/components/ui/safari";
import { BorderBeam } from "@/components/ui/border-beam";
import Link from "next/link";
import { QnA } from "@/components/qna";
import { RainbowButton } from "@/components/ui/rainbow-button";
import FeaturesSectionDemo from "@/components/ui/features-section-demo-2";
import Avatars from "@/components/avatars";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col bg-black text-white">
      <Navbar />
      <Particles
        className="absolute inset-0 w-full h-full z-0"
        quantity={200}
        color="#ffffff"
      />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 relative z-10 mt-16 space-y-6">
        <div
          className={cn(
            "group rounded-full border border-black/5 bg-neutral-100 text-sm text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-3 py-0.5 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Introducing Vyapaar</span>
            <ArrowRightIcon className="ml-1 size-2.5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
        <div className="text-center max-w-4xl mx-auto z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Manage customers with ease. Provide extraordinary value.
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            The best AI integrated CRM for your business.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 mb-8 w-full">
          <div className="flex flex-col justify-center">
            <RainbowButton>
              <Link href="/plans">Get Started</Link>
            </RainbowButton>
          </div>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 blur-3xl"></div>
          <div className="absolute inset-0 -inset-x-20 h-[150%] bg-gradient-to-t from-black via-black to-transparent opacity-100 z-10"></div>
          <div className="absolute inset-0 -inset-x-20 h-[150%] bg-gradient-to-t from-black via-black to-transparent opacity-100 z-30"></div>
          <div className="relative z-20 overflow-hidden rounded-lg">
            <BorderBeam size={250} duration={12} delay={9} className="absolute inset-0 z-20" />
            <Safari url="starter.com" className="w-full h-full relative z-10" />
          </div>
          <div className="flex flex-col justify-center items-center relative z-40">
            <p className="text-sm text-gray-200 mb-2">Trusted by alotta companies for handling their customers.</p>
            <Avatars />
          </div>
        </div>
        <div className="relative z-40 min-h-screen bg-white dark:bg-black">
        <FeaturesSectionDemo />
        </div>
        <div className="relative z-40 w-full py-4">
          <QnA />
        </div>
        <div className="relative z-40 py-4 flex justify-center">
          <EmailWaitlist />
        </div>
      </main>
    </div>
  );
}

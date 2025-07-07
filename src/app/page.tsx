"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Check, Handshake, Lightbulb, Rocket, Users, Target } from "lucide-react";

import Logo from "@/components/cofound/logo";
import { SignupView } from "@/components/cofound/signup-view";
import { ProfilePromptView } from "@/components/cofound/profile-prompt-view";
import { ProfileFormView } from "@/components/cofound/profile-form-view";
import { ThankYouView } from "@/components/cofound/thank-you-view";
import { Button } from "@/components/ui/button";

type Stage = "signup" | "prompt" | "profile" | "complete";
type AppUser = Pick<User, "id" | "email">;

const FeatureCard = ({ icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => {
  const Icon = icon;
  return (
    <div className="bg-card/50 p-6 rounded-2xl border border-border/30 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 text-primary p-3 rounded-xl">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground">{children}</p>
    </div>
  );
};

export default function Home() {
  const [stage, setStage] = useState<Stage>("signup");
  const [user, setUser] = useState<AppUser | null>(null);
  const [profileSkipped, setProfileSkipped] = useState(false);

  const handleSignupSuccess = (newUser: AppUser) => {
    setUser(newUser);
    setStage("prompt");
  };

  const handlePromptChoice = (createProfile: boolean) => {
    if (createProfile) {
      setStage("profile");
    } else {
      setProfileSkipped(true);
      setStage("complete");
    }
  };

  const handleProfileSuccess = () => {
    setProfileSkipped(false);
    setStage("complete");
  };

  const renderStage = () => {
    switch (stage) {
      case "signup":
        // This is part of the hero now, no separate component needed
        return null;
      case "prompt":
        return (
          <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg mx-auto">
            <ProfilePromptView
              email={user?.email || ""}
              onChoice={handlePromptChoice}
            />
          </motion.div>
        );
      case "profile":
        return (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
            <ProfileFormView
              userId={user!.id}
              onSuccess={handleProfileSuccess}
            />
          </motion.div>
        );
      case "complete":
        return (
          <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg mx-auto">
            <ThankYouView
              email={user?.email || ""}
              skippedProfile={profileSkipped}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background text-foreground font-body antialiased">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-900/[0.04] [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
      
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/50 backdrop-blur-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Logo />
          <Button>Get Started</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 sm:py-24 md:py-32 flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {stage !== "signup" ? (
            renderStage()
          ) : (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <section className="text-center flex flex-col items-center">
                <div className="mb-4">
                  <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1 rounded-full">
                    Now in Private Beta
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground leading-tight">
                  Find Your Perfect Co-Founder
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                  The ultimate platform for entrepreneurs, engineers, and visionaries to connect and build the future, together.
                </p>

                <div className="mt-10 w-full max-w-3xl">
                  <SignupView onSuccess={handleSignupSuccess} />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Join thousands of builders on the waitlist.</p>
              
                <div className="mt-20 w-full">
                  <div className="relative">
                    <div className="absolute -inset-2 h-full w-full bg-gradient-to-r from-primary to-accent rounded-2xl transform-gpu blur-3xl opacity-30" />
                    <Image 
                      src="https://placehold.co/1200x600.png"
                      alt="Dashboard preview"
                      width={1200}
                      height={600}
                      data-ai-hint="dashboard screen"
                      className="relative rounded-2xl border border-border/30 shadow-2xl"
                    />
                  </div>
                </div>
              </section>

              <section id="features" className="py-24 sm:py-32">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold">Everything You Need to Find a Match</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                      CoFound isn't just a list. It's a comprehensive platform to discover, vet, and connect with your future business partner.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard title="Smart Matching" icon={Rocket}>
                      Our AI-powered algorithm analyzes profiles to suggest co-founders with complementary skills and compatible personalities.
                    </FeatureCard>
                    <FeatureCard title="Detailed Profiles" icon={Users}>
                      Go beyond the resume. See their skills, experience, project ideas, and what they're looking for in a partner.
                    </FeatureCard>
                    <FeatureCard title="Idea Validation" icon={Lightbulb}>
                      Have an idea? Or looking for one? Connect with people who share your vision or can help you shape it.
                    </FeatureCard>
                    <FeatureCard title="Skill Verification" icon={Target}>
                        Verified skills and experience help you trust that your potential co-founder has the expertise they claim.
                    </FeatureCard>
                     <FeatureCard title="Secure Communication" icon={Check}>
                        Chat safely within the platform to discuss ideas and get to know each other before sharing personal details.
                    </FeatureCard>
                    <FeatureCard title="Partnership Agreements" icon={Handshake}>
                        We provide templates and resources to help you formalize your partnership and start your journey on the right foot.
                    </FeatureCard>
                </div>
              </section>
              
              <section id="logos" className="text-center py-16">
                  <p className="text-muted-foreground mb-8">POWERING THE NEXT GENERATION OF STARTUPS</p>
                  <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    <p className="font-mono text-xl text-muted-foreground">Innovate Inc.</p>
                    <p className="font-mono text-xl text-muted-foreground">Future Ventures</p>
                    <p className="font-mono text-xl text-muted-foreground">TechBuilders</p>
                    <p className="font-mono text-xl text-muted-foreground">Synergy Labs</p>
                    <p className="font-mono text-xl text-muted-foreground">Visionary Co.</p>
                  </div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full border-t border-border/30">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8 gap-6">
          <Logo />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CoFound. All rights reserved.</p>
          <div className="flex space-x-4">
              <Button variant="ghost" size="sm">Terms</Button>
              <Button variant="ghost" size="sm">Privacy</Button>
              <Button variant="ghost" size="sm">Contact</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

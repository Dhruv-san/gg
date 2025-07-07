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

const features = [
  {
    icon: Rocket,
    title: "Smart Matching",
    description: "Our AI-powered algorithm analyzes profiles to suggest co-founders with complementary skills and compatible personalities.",
  },
  {
    icon: Users,
    title: "Detailed Profiles",
    description: "Go beyond the resume. See their skills, experience, project ideas, and what they're looking for in a partner.",
  },
  {
    icon: Lightbulb,
    title: "Idea Validation",
    description: "Have an idea? Or looking for one? Connect with people who share your vision or can help you shape it.",
  },
  {
    icon: Target,
    title: "Skill Verification",
    description: "Verified skills and experience help you trust that your potential co-founder has the expertise they claim.",
  },
  {
    icon: Check,
    title: "Secure Communication",
    description: "Chat safely within the platform to discuss ideas and get to know each other before sharing personal details.",
  },
  {
    icon: Handshake,
    title: "Partnership Agreements",
    description: "We provide templates and resources to help you formalize your partnership and start your journey on the right foot.",
  },
];

const logos = [ "Innovate Inc.", "Future Ventures", "TechBuilders", "Synergy Labs", "Visionary Co."];

const FeatureCard = ({ icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => {
  const Icon = icon;
  return (
    <div className="bg-card/50 p-6 rounded-2xl border border-border/30 shadow-lg backdrop-blur-sm h-full">
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

const heroItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
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
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.1),rgba(255,255,255,0))]"></div>
      
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
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="w-full"
            >
              <section className="text-center flex flex-col items-center">
                <motion.div variants={heroItemVariants} className="mb-4">
                  <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1 rounded-full">
                    Now in Private Beta
                  </span>
                </motion.div>
                <motion.h1 variants={heroItemVariants} className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground leading-tight">
                  Find Your Perfect Co-Founder
                </motion.h1>
                <motion.p variants={heroItemVariants} className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                  The ultimate platform for entrepreneurs, engineers, and visionaries to connect and build the future, together.
                </motion.p>

                <motion.div variants={heroItemVariants} className="mt-10 w-full max-w-3xl">
                  <SignupView onSuccess={handleSignupSuccess} />
                </motion.div>
                <motion.p variants={heroItemVariants} className="mt-4 text-sm text-muted-foreground">Join thousands of builders on the waitlist.</motion.p>
              
                <motion.div 
                  className="mt-20 w-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="relative">
                    <div className="absolute -inset-2 h-full w-full bg-gradient-to-r from-primary to-accent rounded-2xl transform-gpu blur-3xl opacity-20" />
                    <Image 
                      src="https://placehold.co/1200x600.png"
                      alt="Dashboard preview"
                      width={1200}
                      height={600}
                      data-ai-hint="dashboard screen"
                      className="relative rounded-2xl border border-border/30 shadow-2xl"
                    />
                  </div>
                </motion.div>
              </section>

              <motion.section 
                id="features" 
                className="py-24 sm:py-32"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
              >
                <div className="text-center max-w-3xl mx-auto">
                    <motion.h2 variants={heroItemVariants} className="text-4xl font-bold">Everything You Need to Find a Match</motion.h2>
                    <motion.p variants={heroItemVariants} className="mt-4 text-lg text-muted-foreground">
                      CoFound isn't just a list. It's a comprehensive platform to discover, vet, and connect with your future business partner.
                    </motion.p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, i) => (
                    <motion.div key={i} variants={heroItemVariants}>
                      <FeatureCard title={feature.title} icon={feature.icon}>
                        {feature.description}
                      </FeatureCard>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
              
              <motion.section 
                id="logos" 
                className="text-center py-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={sectionVariants}
              >
                  <motion.p variants={heroItemVariants} className="text-muted-foreground mb-8">POWERING THE NEXT GENERATION OF STARTUPS</motion.p>
                  <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    {logos.map((logo, i) => (
                      <motion.p key={i} variants={heroItemVariants} className="font-mono text-xl text-muted-foreground">{logo}</motion.p>
                    ))}
                  </div>
              </motion.section>

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

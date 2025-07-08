
"use client";

import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Handshake, Lightbulb, Rocket, Users, Target, Code, Megaphone, PenTool, AlertCircle, Loader2 } from "lucide-react";

import Logo from "@/components/cofound/logo";
import { SignupView } from "@/components/cofound/signup-view";
import { ProfilePromptView } from "@/components/cofound/profile-prompt-view";
import { ProfileFormView } from "@/components/cofound/profile-form-view";
import { ThankYouView } from "@/components/cofound/thank-you-view";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupabaseClient } from "@supabase/supabase-js";

type Stage = "signup" | "prompt" | "profile" | "complete" | "check_email";
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

const floatingIcons = [
  { icon: Rocket, delay: 0, size: 'w-10 h-10 md:w-12 md:h-12', position: 'top-0 left-1/4' },
  { icon: PenTool, delay: 0.5, size: 'w-12 h-12 md:w-16 md:h-16', position: 'top-1/3 right-0' },
  { icon: Lightbulb, delay: 1, size: 'w-10 h-10 md:w-14 md:h-14', position: 'top-3/4 left-0' },
  { icon: Code, delay: 1.5, size: 'w-12 h-12', position: 'bottom-0 right-1/4' },
  { icon: Megaphone, delay: 2, size: 'w-8 h-8 md:w-10 md:h-10', position: 'top-1/2 left-1/5' },
  { icon: Target, delay: 2.5, size: 'w-10 h-10 md:w-14 md:h-14', position: 'bottom-1/4 right-1/5' },
];

const FeatureCard = ({ icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => {
  const Icon = icon;
  return (
    <div className="bg-card/50 p-6 rounded-2xl border border-border/30 shadow-lg backdrop-blur-sm h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 text-primary p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-12deg]">
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

const sentenceVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
        },
    },
};


export default function Home() {
  const [stage, setStage] = useState<Stage>("signup");
  const [user, setUser] = useState<AppUser | null>(null);
  const [profileSkipped, setProfileSkipped] = useState(false);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (
      supabaseUrl &&
      supabaseUrl !== "YOUR_SUPABASE_URL" &&
      supabaseAnonKey &&
      supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY"
    ) {
      setSupabase(createClient());
      setIsConfigured(true);
    } else {
      setIsConfigured(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        if (stage === 'signup') {
          const { count } = await supabase
            .from('waitlist_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('id', authUser.id);
          
          if (count === 0) {
            setUser({ id: authUser.id, email: authUser.email! });
            setStage('profile');
          }
        }
      }
    };
    checkUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const handleSignupSuccess = (newUser: AppUser) => {
    setUser(newUser);
    setStage("check_email");
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
  
  const handleLogoClick = () => {
    setStage("signup");
    setUser(null);
    setProfileSkipped(false);
  };

  const renderStage = () => {
    switch (stage) {
      case "signup":
        return null;
      case "check_email":
        return (
          <motion.div key="check_email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg mx-auto">
            <ThankYouView
              email={user?.email || ""}
              isCheckEmailStage={true}
            />
          </motion.div>
        );
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
              email={user!.email!}
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
  
  if (isConfigured === null) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (isConfigured === false) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg border-destructive">
          <CardHeader>
            <div className="flex items-center gap-4 text-destructive">
              <AlertCircle className="h-8 w-8" />
              <CardTitle>Configuration Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Your application is not configured to connect to Supabase.</p>
            <p className="text-sm text-muted-foreground">
              Please create a <code>.env</code> file in your project's root directory and add your Supabase URL and Anon Key. You can find these credentials in your Supabase project's API settings.
            </p>
            <div className="bg-muted p-4 rounded-md text-sm font-mono text-muted-foreground">
              NEXT_PUBLIC_SUPABASE_URL=...<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background text-foreground font-body antialiased">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-gradient-to-tr from-background via-primary/10 to-accent/10 bg-[size:400%_400%] animate-aurora"></div>
      
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/50 backdrop-blur-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Logo onClick={handleLogoClick} />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button>Get Started</Button>
          </motion.div>
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
                <motion.h1
                  variants={sentenceVariants}
                  className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground leading-tight"
                >
                  {"Find Your Perfect Co-founder".split(" ").map((word, index) => (
                    <motion.span
                      key={word + "-" + index}
                      variants={wordVariants}
                      className="inline-block mr-4"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>
                <motion.p variants={heroItemVariants} className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                  The ultimate platform for entrepreneurs, engineers, and visionaries to connect and build the future, together.
                </motion.p>

                <motion.div variants={heroItemVariants} className="mt-10 w-full max-w-lg mx-auto">
                  <SignupView onSuccess={handleSignupSuccess} />
                </motion.div>
              
                <motion.div 
                  className="mt-20 w-full flex justify-center items-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="relative w-full max-w-xs md:max-w-xl h-80">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
                    <motion.div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Handshake className="w-16 h-16 md:w-20 md:h-20 text-primary opacity-50" />
                    </motion.div>

                    {floatingIcons.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={index}
                          className={`absolute p-3 bg-card/60 backdrop-blur-md rounded-2xl shadow-lg border border-border/30 ${item.position}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
                          transition={{
                            opacity: { delay: item.delay, duration: 0.5 },
                            scale: { delay: item.delay, duration: 0.5 },
                            y: {
                              delay: item.delay,
                              duration: 4 + Math.random() * 2,
                              repeat: Infinity,
                              repeatType: 'mirror',
                              ease: 'easeInOut',
                            },
                          }}
                        >
                          <Icon className={`${item.size} text-primary`} />
                        </motion.div>
                      );
                    })}
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
                      CoFoundr isn't just a list. It's a comprehensive platform to discover, vet, and connect with your future business partner.
                    </motion.p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      variants={heroItemVariants}
                      whileHover={{ y: -8, scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="group"
                    >
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
                      <motion.p 
                        key={i} 
                        variants={heroItemVariants} 
                        className="font-mono text-xl text-muted-foreground transition-colors duration-300 hover:text-foreground"
                        whileHover={{ scale: 1.1 }}
                      >
                        {logo}
                      </motion.p>
                    ))}
                  </div>
              </motion.section>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full border-t border-border/30">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8 gap-6">
          <Logo onClick={handleLogoClick} />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CoFoundr. All rights reserved.</p>
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

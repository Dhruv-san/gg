"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";

import Logo from "@/components/cofound/logo";
import { SignupView } from "@/components/cofound/signup-view";
import { ProfilePromptView } from "@/components/cofound/profile-prompt-view";
import { ProfileFormView } from "@/components/cofound/profile-form-view";
import { ThankYouView } from "@/components/cofound/thank-you-view";

type Stage = "signup" | "prompt" | "profile" | "complete";
type AppUser = Pick<User, "id" | "email">;

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
        return (
          <SignupView key="signup" onSuccess={handleSignupSuccess} />
        );
      case "prompt":
        return (
          <ProfilePromptView
            key="prompt"
            email={user?.email || ""}
            onChoice={handlePromptChoice}
          />
        );
      case "profile":
        return (
          <ProfileFormView
            key="profile"
            userId={user!.id}
            onSuccess={handleProfileSuccess}
          />
        );
      case "complete":
        return (
          <ThankYouView
            key="complete"
            email={user?.email || ""}
            skippedProfile={profileSkipped}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background to-slate-900/50 p-4 font-body">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <Logo />
        </motion.div>
        <AnimatePresence mode="wait">
          {renderStage()}
        </AnimatePresence>
      </div>
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CoFound. All rights reserved.
      </footer>
    </main>
  );
}

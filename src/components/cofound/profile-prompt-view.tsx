"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfilePromptViewProps {
  email: string;
  onChoice: (createProfile: boolean) => void;
}

export const ProfilePromptView = ({ email, onChoice }: ProfilePromptViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">You're on the list!</CardTitle>
          <CardDescription className="pt-2">
            Thanks for signing up, <span className="font-semibold text-primary">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-foreground">
            Want to get a head start? Create your Cofindr profile now to be among the first to get matched.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="w-full sm:w-auto font-bold"
              onClick={() => onChoice(true)}
            >
              Yes, Create My Profile
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onChoice(false)}
            >
              No, Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

"use client";

import { motion } from "framer-motion";
import { PartyPopper, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ThankYouViewProps {
  email: string;
  skippedProfile: boolean;
}

export const ThankYouView = ({ email, skippedProfile }: ThankYouViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center items-center">
          {skippedProfile ? (
             <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
          ) : (
             <PartyPopper className="h-16 w-16 text-primary mb-4" />
          )}
          <CardTitle className="text-3xl font-bold">
            {skippedProfile ? "Got It, You're In!" : "THANK YOU!"}
          </CardTitle>
          <CardDescription className="pt-2">
            We'll be in touch at <span className="font-semibold text-primary">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-foreground">
            {skippedProfile
              ? "We'll keep you updated on our launch. You can complete your profile any time from a link we'll send later."
              : "Your CoFoundr profile has been submitted successfully. Get ready for an exciting journey ahead!"}
          </p>
          <p className="text-sm text-muted-foreground">
            Important: Please remember to click the confirmation link sent to your inbox to fully activate your spot.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};


"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, LockKeyhole, Loader2, ArrowRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AppUser = Pick<User, "id" | "email">;

interface SignupViewProps {
  onSuccess: (user: AppUser) => void;
}

const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.3 512 0 398.5 0 256S111.3 0 244 0c69.8 0 125.8 27.9 170.6 69.1L369.5 121.3c-39.8-38.3-91.2-61.4-125.5-61.4C153 60 76.2 135.4 76.2 228.4c0 93.1 76.8 168.4 167.8 168.4 100.3 0 146.5-63.3 150.2-97.1H244v-75.3h236.4c2.5 12.8 3.6 26.4 3.6 40.8z"></path>
  </svg>
);

export const SignupView = ({ onSuccess }: SignupViewProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: location.origin,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "An unexpected error occurred.",
      });
      setIsSubmitting(false);
    }
    // Note: The user will be redirected to Google and then back to the app.
    // The onSuccess callback will be handled by the main page's useEffect.
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 shadow-2xl text-left">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Account</CardTitle>
        <CardDescription>Join the waitlist and be the first to get matched.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full font-bold text-base h-12" 
          size="lg" 
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <GoogleIcon />
              Sign in with Google
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

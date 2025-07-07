"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, LockKeyhole, Loader2, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/lib/schemas";
import { signUpWithEmailAndPassword } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type SignupFormValues = z.infer<typeof signupSchema>;
type AppUser = Pick<User, "id" | "email">;

interface SignupViewProps {
  onSuccess: (user: AppUser) => void;
}

export const SignupView = ({ onSuccess }: SignupViewProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    const result = await signUpWithEmailAndPassword(values);
    setIsSubmitting(false);

    if (result.success && result.user) {
      toast({
        title: "Welcome aboard!",
        description: "Please check your email to confirm your account.",
      });
      onSuccess(result.user);
    } else {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: result.error || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      className="pl-10 h-14 bg-background/50 border-border/50 text-base"
                      {...field}
                      onFocus={() => setShowPassword(true)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full sm:w-auto font-bold text-lg h-14 shrink-0" disabled={isSubmitting}>
            <AnimatePresence mode="wait" initial={false}>
              {isSubmitting ? (
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 className="animate-spin" />
                </motion.div>
              ) : (
                <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
        <AnimatePresence>
        {showPassword && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="password" placeholder="Create password" className="pl-10 h-12 bg-background/50 border-border/50" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="password" placeholder="Confirm password" className="pl-10 h-12 bg-background/50 border-border/50" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}
        </AnimatePresence>
      </form>
    </Form>
  );
};

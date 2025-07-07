"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2, UploadCloud, User, MapPin, Briefcase, Lightbulb, Linkedin, Link as LinkIcon, Users, Heart, Building, DraftingCompass, Handshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { profileSchema } from "@/lib/schemas";
import { createOrUpdateProfile } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormViewProps {
  userId: string;
  onSuccess: () => void;
}

const Section = ({ title, description, children, icon: Icon }: { title: string, description: string, children: React.ReactNode, icon: React.ElementType }) => (
  <Card className="bg-card/50 border-border/30">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </CardContent>
  </Card>
);


export const ProfileFormView = ({ userId, onSuccess }: ProfileFormViewProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      has_idea: false,
      willing_to_relocate: false,
    }
  });

  const watchHasIdea = form.watch("has_idea");

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'avatar' && value?.[0]) {
        formData.append(key, value[0]);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const result = await createOrUpdateProfile(userId, formData);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Profile Saved!",
        description: "Your co-founder profile is ready.",
      });
      onSuccess();
    } else {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: result.error || "An unexpected error occurred.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Create Your CoFounder Profile</h1>
        <p className="text-muted-foreground">This will help us find your ideal match.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <Section title="About You" description="Your personal and professional identity." icon={User}>
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                          {avatarPreview ? (
                            <Image src={avatarPreview} alt="Avatar Preview" layout="fill" objectFit="cover" />
                          ) : (
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="avatar-upload"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            if (e.target.files && e.target.files[0]) {
                              setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                            }
                          }}
                        />
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" onClick={() => document.getElementById('avatar-upload')?.click()}>
                            Upload Image
                          </Button>
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField control={form.control} name="username" render={({ field }) => ( <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="your_unique_username" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="full_name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Ada Lovelace" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="location" render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="City, Country" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <div className="md:col-span-2">
            <FormField control={form.control} name="bio" render={({ field }) => ( <FormItem><FormLabel>Short Bio</FormLabel><FormControl><Textarea placeholder="A brief introduction about yourself (max 500 chars)" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>
            <FormField control={form.control} name="linkedin_url" render={({ field }) => ( <FormItem><FormLabel>LinkedIn Profile</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="website_url" render={({ field }) => ( <FormItem><FormLabel>Personal Website</FormLabel><FormControl><Input placeholder="https://your-portfolio.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
          </Section>

          <Section title="Your Expertise" description="What you bring to the table." icon={DraftingCompass}>
            <FormField control={form.control} name="primary_role_seeking" render={({ field }) => ( <FormItem><FormLabel>Primary Role</FormLabel><FormControl><Input placeholder="e.g., CTO, Lead Engineer" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="years_experience" render={({ field }) => ( <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" placeholder="5" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <div className="md:col-span-2">
            <FormField control={form.control} name="core_skills" render={({ field }) => ( <FormItem><FormLabel>Core Skills & Expertise</FormLabel><FormControl><Input placeholder="React, Node.js, Product Management" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem> )} />
            </div>
            <div className="md:col-span-2">
            <FormField control={form.control} name="industry_experience" render={({ field }) => ( <FormItem><FormLabel>Industry Experience</FormLabel><FormControl><Input placeholder="Fintech, SaaS, HealthTech" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem> )} />
            </div>
          </Section>

          <Section title="Your Idea" description="Share your vision if you have one." icon={Lightbulb}>
             <div className="md:col-span-2 flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="has_idea"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I have a startup idea...</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              {watchHasIdea && (
                <>
                 <div className="md:col-span-2">
                  <FormField control={form.control} name="idea_description" render={({ field }) => ( <FormItem><FormLabel>Idea Description</FormLabel><FormControl><Textarea placeholder="Describe your startup idea (max 1000 chars)" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <FormField control={form.control} name="idea_stage" render={({ field }) => ( <FormItem><FormLabel>Idea Stage</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Idea">Idea</SelectItem><SelectItem value="MVP/Prototype">MVP/Prototype</SelectItem><SelectItem value="Early Traction">Early Traction</SelectItem><SelectItem value="Growth">Growth</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                </>
              )}
          </Section>
          
          <Section title="Ideal Co-Founder" description="Describe who you're looking for." icon={Users}>
            <div className="md:col-span-2"><FormField control={form.control} name="cofounder_looking_for_roles" render={({ field }) => ( <FormItem><FormLabel>Role(s) you're looking for</FormLabel><FormControl><Input placeholder="CEO, Marketing Lead" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem> )} /></div>
            <div className="md:col-span-2"><FormField control={form.control} name="cofounder_looking_for_skills" render={({ field }) => ( <FormItem><FormLabel>Key skills they should have</FormLabel><FormControl><Input placeholder="Sales, UI/UX Design, Go-to-market" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem> )} /></div>
            <div className="md:col-span-2"><FormField control={form.control} name="cofounder_personality_traits" render={({ field }) => ( <FormItem><FormLabel>Important personality traits</FormLabel><FormControl><Textarea placeholder="e.g., Data-driven, visionary, resilient" {...field} /></FormControl><FormMessage /></FormItem> )} /></div>
            <div className="md:col-span-2"><FormField control={form.control} name="cofounder_industry_background" render={({ field }) => ( <FormItem><FormLabel>Preferred industry background</FormLabel><FormControl><Input placeholder="e.g., B2B SaaS" {...field} /></FormControl><FormMessage /></FormItem> )} /></div>
          </Section>

          <Section title="Logistics & Interests" description="Commitment levels, location, and what excites you." icon={Building}>
             <FormField control={form.control} name="commitment_level" render={({ field }) => ( <FormItem><FormLabel>Your Commitment</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select commitment level" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Flexible">Flexible</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
             <FormField control={form.control} name="equity_split_expectation" render={({ field }) => ( <FormItem><FormLabel>Equity Split Expectation</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select equity expectation" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Negotiable">Negotiable</SelectItem><SelectItem value="Equal Split">Equal Split</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
             <div className="md:col-span-2"><FormField control={form.control} name="preferred_cofounder_location" render={({ field }) => ( <FormItem><FormLabel>Preferred Co-founder Location</FormLabel><FormControl><Input placeholder="Remote, New York, etc." {...field} /></FormControl><FormMessage /></FormItem> )} /></div>
             <div className="md:col-span-2"><FormField control={form.control} name="interests" render={({ field }) => ( <FormItem><FormLabel>Areas of Interest</FormLabel><FormControl><Input placeholder="AI, SaaS, Fintech, Creator Economy" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem> )} /></div>
             <div className="md:col-span-2 flex items-center space-x-2">
              <FormField control={form.control} name="willing_to_relocate" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Willing to relocate</FormLabel></div></FormItem>)}/>
            </div>
          </Section>

          <div className="flex justify-end pt-8">
            <Button type="submit" size="lg" className="font-bold" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit My Profile"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

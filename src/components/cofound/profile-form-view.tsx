
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Loader2, UploadCloud, User, MapPin, Briefcase, Lightbulb, Linkedin, Link as LinkIcon, Users, Building, DraftingCompass, Handshake, ArrowLeft, Check } from "lucide-react";

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
import { Progress } from "@/components/ui/progress";

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormViewProps {
  userId: string;
  onSuccess: () => void;
}

const steps = [
  {
    id: 'about',
    title: 'About You',
    icon: User,
    description: "Your personal and professional identity.",
    fields: ['avatar', 'username', 'full_name', 'location', 'bio', 'linkedin_url', 'website_url']
  },
  {
    id: 'expertise',
    title: 'Your Expertise',
    icon: DraftingCompass,
    description: "What you bring to the table.",
    fields: ['primary_role_seeking', 'years_experience', 'core_skills', 'industry_experience']
  },
  {
    id: 'idea',
    title: 'Your Idea',
    icon: Lightbulb,
    description: "Share your vision if you have one.",
    fields: ['has_idea', 'idea_description', 'idea_stage']
  },
  {
    id: 'cofounder',
    title: "Ideal Co-founder",
    icon: Users,
    description: "Describe who you're looking for.",
    fields: ['cofounder_looking_for_roles', 'cofounder_looking_for_skills', 'cofounder_personality_traits', 'cofounder_industry_background']
  },
  {
    id: 'logistics',
    title: "Logistics & Interests",
    icon: Building,
    description: "Commitment levels, location, and what excites you.",
    fields: ['commitment_level', 'equity_split_expectation', 'willing_to_relocate', 'preferred_cofounder_location', 'interests']
  }
];

const Stepper = ({ currentStep }: { currentStep: number }) => (
  <ol className="flex items-center w-full mb-8">
    {steps.map((step, index) => (
      <li key={step.id} className="flex w-full items-center">
        <div className="flex items-center">
          <motion.div
            animate={{
              backgroundColor: index <= currentStep ? "hsl(var(--primary))" : "hsl(var(--muted))",
              color: index <= currentStep ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))"
            }}
            transition={{ duration: 0.3 }}
            className="flex z-10 items-center justify-center w-10 h-10 rounded-full ring-0 sm:ring-4 ring-background shrink-0"
          >
            {index < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
          </motion.div>
          <div className="hidden sm:flex flex-col ml-4">
            <h3 className={`font-medium ${index === currentStep ? "text-primary" : ""}`}>{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        </div>
        {index < steps.length - 1 && (
          <div className="flex-auto border-t-2 border-border transition-colors duration-300 mx-4"></div>
        )}
      </li>
    ))}
  </ol>
);

const stepVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? '20%' : '-20%',
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 30 },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? '20%' : '-20%',
    transition: { type: 'spring', stiffness: 260, damping: 30 },
  }),
};

export const ProfileFormView = ({ userId, onSuccess }: ProfileFormViewProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      has_idea: false,
      willing_to_relocate: false,
    }
  });

  const watchHasIdea = form.watch("has_idea");

  const processForm = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'avatar' && (value as any)?.[0]) {
        formData.append(key, (value as any)[0]);
      } else if (value !== undefined && value !== null) {
        // Convert boolean to string
        if (typeof value === 'boolean') {
           formData.append(key, String(value));
        } else {
           formData.append(key, value as string | Blob);
        }
      }
    });
    
    // Correctly append checkbox values
    formData.set('has_idea', String(values.has_idea));
    formData.set('willing_to_relocate', String(values.willing_to_relocate));

    const result = await createOrUpdateProfile(userId, formData);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Profile Saved!",
        description: "Your CoFoundr profile is ready.",
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

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as any, { shouldFocus: true });
    
    if (!output) return;

    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
  };
  
  const currentSection = steps[currentStep];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Create Your CoFoundr Profile</h1>
        <p className="text-muted-foreground mt-2">This will help us find your ideal match.</p>
      </div>

      <Stepper currentStep={currentStep} />
      <Progress value={(currentStep + 1) / steps.length * 100} className="mb-8 h-2" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card className="bg-card/50 border-border/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <currentSection.icon className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{currentSection.title}</CardTitle>
                      <CardDescription>{currentSection.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentStep === 0 && (
                    <>
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
                    </>
                  )}

                  {currentStep === 1 && (
                     <>
                      <FormField control={form.control} name="primary_role_seeking" render={({ field }) => ( <FormItem><FormLabel>Primary Role</FormLabel><FormControl><Input placeholder="e.g., CTO, Lead Engineer" {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="years_experience" render={({ field }) => ( <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" placeholder="5" {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <div className="md:col-span-2">
                      <FormField control={form.control} name="core_skills" render={({ field }) => ( <FormItem><FormLabel>Core Skills & Expertise</FormLabel><FormControl><Input placeholder="React, Node.js, Product Management" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem> )} />
                      </div>
                      <div className="md:col-span-2">
                      <FormField control={form.control} name="industry_experience" render={({ field }) => ( <FormItem><FormLabel>Industry Experience</FormLabel><FormControl><Input placeholder="Fintech, SaaS, HealthTech" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem> )} />
                      </div>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
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
                    </>
                  )}

                  {currentStep === 3 && (
                     <>
                      <div className="md:col-span-2"><FormField control={form.control} name="cofounder_looking_for_roles" render={({ field }) => ( <FormItem><FormLabel>Role(s) you're looking for</FormLabel><FormControl><Input placeholder="CEO, Marketing Lead" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem> )} /></div>
                      <div className="md:col-span-2"><FormField control={form.control} name="cofounder_looking_for_skills" render={({ field }) => ( <FormItem><FormLabel>Key skills they should have</FormLabel><FormControl><Input placeholder="Sales, UI/UX Design, Go-to-market" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem> )} /></div>
                      <div className="md:col-span-2"><FormField control={form.control} name="cofounder_personality_traits" render={({ field }) => ( <FormItem><FormLabel>Important personality traits</FormLabel><FormControl><Textarea placeholder="e.g., Data-driven, visionary, resilient" {...field} /></FormControl><FormMessage /></FormItem> )} /></div>
                      <div className="md:col-span-2"><FormField control={form.control} name="cofounder_industry_background" render={({ field }) => ( <FormItem><FormLabel>Preferred industry background</FormLabel><FormControl><Input placeholder="e.g., B2B SaaS" {...field} /></FormControl><FormMessage /></FormItem> )} /></div>
                    </>
                  )}
                  
                  {currentStep === 4 && (
                    <>
                       <FormField control={form.control} name="commitment_level" render={({ field }) => ( <FormItem><FormLabel>Your Commitment</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select commitment level" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Flexible">Flexible</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                       <FormField control={form.control} name="equity_split_expectation" render={({ field }) => ( <FormItem><FormLabel>Equity Split Expectation</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select equity expectation" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Negotiable">Negotiable</SelectItem><SelectItem value="Equal Split">Equal Split</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                       <div className="md:col-span-2"><FormField control={form.control} name="preferred_cofounder_location" render={({ field }) => ( <FormItem><FormLabel>Preferred Co-founder Location</FormLabel><FormControl><Input placeholder="Remote, New York, etc." {...field} /></FormControl><FormMessage /></FormItem> )} /></div>
                       <div className="md:col-span-2"><FormField control={form.control} name="interests" render={({ field }) => ( <FormItem><FormLabel>Areas of Interest</FormLabel><FormControl><Input placeholder="AI, SaaS, Fintech, Creator Economy" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem> )} /></div>
                       <div className="md:col-span-2 flex items-center space-x-2">
                        <FormField control={form.control} name="willing_to_relocate" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Willing to relocate</FormLabel></div></FormItem>)}/>
                      </div>
                    </>
                  )}

                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-8">
            <div>
              {currentStep > 0 && (
                <Button type="button" onClick={handlePrev} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>

            <div>
              {currentStep < steps.length - 1 && (
                <Button type="button" onClick={handleNext}>
                  Next Step
                </Button>
              )}

              {currentStep === steps.length - 1 && (
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
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

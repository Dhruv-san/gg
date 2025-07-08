'use server';
/**
 * @fileOverview An AI flow for generating a user bio.
 *
 * - generateBio - A function that generates a user bio based on their profile data.
 * - GenerateBioInput - The input type for the generateBio function.
 * - GenerateBioOutput - The return type for the generateBio function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateBioInputSchema, GenerateBioOutputSchema } from '@/lib/schemas';

export type GenerateBioInput = z.infer<typeof GenerateBioInputSchema>;
export type GenerateBioOutput = z.infer<typeof GenerateBioOutputSchema>;

export async function generateBio(input: GenerateBioInput): Promise<GenerateBioOutput> {
  return generateBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBioPrompt',
  input: { schema: GenerateBioInputSchema },
  output: { schema: GenerateBioOutputSchema },
  prompt: `You are a professional career coach and copywriter who helps startup founders craft compelling profiles.

  Based on the information provided, write an engaging, first-person bio for a user. The bio must be under 500 characters. It should sound confident, professional, and approachable, making them an attractive potential co-founder.

  User Details:
  - Full Name: {{fullName}}
  - Primary Role They're Seeking: {{primaryRole}}
  - Core Skills: {{#each coreSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  `,
});

const generateBioFlow = ai.defineFlow(
  {
    name: 'generateBioFlow',
    inputSchema: GenerateBioInputSchema,
    outputSchema: GenerateBioOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

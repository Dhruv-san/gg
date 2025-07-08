import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const textToArray = z.preprocess((val) => {
    if (typeof val === 'string') {
        return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    return val;
}, z.array(z.string()).optional());


export const profileSchema = z.object({
  avatar: z.any()
    .optional()
    .refine(
      (files) => !files || files.size === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 3MB.`
    )
    .refine(
      (files) => !files || files.size === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .gif formats are supported."
    ),
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  full_name: z.string().min(2, "Full name is required").max(100),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  linkedin_url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  website_url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  primary_role_seeking: z.string().optional(),
  years_experience: z.coerce.number().int().min(0).optional(),
  core_skills: textToArray,
  industry_experience: textToArray,
  has_idea: z.boolean().default(false),
  idea_description: z.string().max(1000).optional(),
  idea_stage: z.string().optional(),
  cofounder_looking_for_roles: textToArray,
  cofounder_looking_for_skills: textToArray,
  cofounder_personality_traits: z.string().optional(),
  cofounder_industry_background: z.string().optional(),
  commitment_level: z.string().optional(),
  willing_to_relocate: z.boolean().default(false),
  preferred_cofounder_location: z.string().optional(),
  interests: textToArray,
  equity_split_expectation: z.string().optional(),
});

export const GenerateBioInputSchema = z.object({
  fullName: z.string().describe('The full name of the user.'),
  primaryRole: z.string().describe('The primary role the user is seeking.'),
  coreSkills: z.array(z.string()).describe("A list of the user's core skills."),
});

export const GenerateBioOutputSchema = z.object({
  bio: z.string().describe('The generated user bio, in the first person and under 500 characters.'),
});

"use server";

import { z } from "zod";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { profileSchema, signupSchema } from "@/lib/schemas";

export async function signUpWithEmailAndPassword(
  data: z.infer<typeof signupSchema>
) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const result = signupSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: "Invalid data provided." };
  }

  const { email, password } = result.data;

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!authData.user) {
    return { success: false, error: "User not created. Please try again." };
  }

  return { success: true, user: { id: authData.user.id, email: authData.user.email! } };
}

export async function createOrUpdateProfile(userId: string, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const data = Object.fromEntries(formData);
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    console.error("Validation error:", result.error.flatten().fieldErrors);
    return { success: false, error: "Invalid profile data.", errors: result.error.flatten().fieldErrors };
  }
  
  const profileData = result.data;
  let avatarUrl: string | undefined = undefined;
  const avatarFile = formData.get('avatar') as File | null;

  if (avatarFile && avatarFile.size > 0) {
    const avatarPath = `${userId}/avatar_${Date.now()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('preliminary-avatars')
      .upload(avatarPath, avatarFile);

    if (uploadError) {
      return { success: false, error: `Avatar upload failed: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from('preliminary-avatars')
      .getPublicUrl(uploadData.path);
    
    avatarUrl = publicUrlData.publicUrl;
  }

  // Get user email
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  const { error: dbError } = await supabase.from('waitlist_profiles').upsert({
    id: userId,
    email: user.email,
    username: profileData.username,
    full_name: profileData.full_name,
    location: profileData.location,
    bio: profileData.bio,
    linkedin_url: profileData.linkedin_url,
    website_url: profileData.website_url,
    primary_role_seeking: profileData.primary_role_seeking,
    years_experience: profileData.years_experience,
    core_skills: profileData.core_skills,
    industry_experience: profileData.industry_experience,
    has_idea: profileData.has_idea,
    idea_description: profileData.idea_description,
    idea_stage: profileData.idea_stage,
    cofounder_looking_for_roles: profileData.cofounder_looking_for_roles,
    cofounder_looking_for_skills: profileData.cofounder_looking_for_skills,
    cofounder_personality_traits: profileData.cofounder_personality_traits,
    cofounder_industry_background: profileData.cofounder_industry_background,
    commitment_level: profileData.commitment_level,
    willing_to_relocate: profileData.willing_to_relocate,
    preferred_cofounder_location: profileData.preferred_cofounder_location,
    interests: profileData.interests,
    equity_split_expectation: profileData.equity_split_expectation,
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });

  if (dbError) {
    return { success: false, error: `Database error: ${dbError.message}` };
  }

  return { success: true };
}

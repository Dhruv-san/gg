
"use server";

import { z } from "zod";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { profileSchema } from "@/lib/schemas";

const checkSupabaseCredentials = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    supabaseUrl === "YOUR_SUPABASE_URL" ||
    !supabaseAnonKey ||
    supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY"
  ) {
    return {
      error: "Supabase URL and Anon Key are not configured. Please check your .env file.",
      client: null,
    };
  }
  
  const cookieStore = cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { get: (name) => cookieStore.get(name)?.value },
  });

  return { error: null, client: supabase };
}

export async function createOrUpdateProfile(userId: string, formData: FormData) {
  const { error: clientError, client: supabase } = checkSupabaseCredentials();
  if (clientError || !supabase) {
    return { success: false, error: clientError };
  }

  const rawData: {[k:string]: any} = Object.fromEntries(formData);
  
  if (rawData.has_idea) rawData.has_idea = rawData.has_idea === 'true';
  if (rawData.willing_to_relocate) rawData.willing_to_relocate = rawData.willing_to_relocate === 'true';
  if (rawData.years_experience) rawData.years_experience = parseInt(rawData.years_experience, 10);

  const result = profileSchema.safeParse(rawData);

  if (!result.success) {
    console.error("Validation error:", result.error.flatten().fieldErrors);
    return { success: false, error: "Invalid profile data.", errors: result.error.flatten().fieldErrors };
  }
  
  const profileData = result.data;
  let avatarUrl: string | null | undefined = undefined;
  const avatarFile = formData.get('avatar') as File | null;
  const avatarRemoved = formData.get('avatar_removed') === 'true';

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
  } else if (avatarRemoved) {
    avatarUrl = null;
  }

  const upsertData: any = {
    id: userId,
    email: profileData.email,
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
    updated_at: new Date().toISOString(),
  };

  if (avatarUrl !== undefined) {
    upsertData.avatar_url = avatarUrl;
  }

  const { error: dbError } = await supabase.from('waitlist_profiles').upsert(upsertData, { onConflict: 'id' });

  if (dbError) {
    return { success: false, error: `Database error: ${dbError.message}` };
  }

  return { success: true };
}


'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfilePromptView } from '@/components/cofound/profile-prompt-view';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

function ChoosePageContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Initial check
    const initialCheck = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
        }
        // Only set loading false after onAuthStateChange has had a chance to fire
        // This avoids flicker/race conditions
    };
    initialCheck();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [loading, user, router]);

  const handleChoice = (createProfile: boolean) => {
    if (createProfile) {
      router.push('/profile');
    } else {
      router.push('/complete?skipped=true');
    }
  };

  if (loading || !user) {
    return <Loader2 className="h-10 w-10 animate-spin text-primary" />;
  }

  return (
    <div className="w-full max-w-lg">
      <ProfilePromptView
        email={user.email || ''}
        onChoice={handleChoice}
      />
    </div>
  );
}

export default function ChoosePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-primary" />}>
        <ChoosePageContent />
      </Suspense>
    </div>
  );
}

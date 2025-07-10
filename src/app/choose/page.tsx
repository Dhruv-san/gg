
'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ProfilePromptView } from '@/components/cofound/profile-prompt-view';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState }from 'react';
import type { User } from '@supabase/supabase-js';

function ChoosePageContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const checkAndSetUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (isMounted) {
        setUser(user);
        // We set loading to false only after the initial check is complete.
        setLoading(false);
      }
    };
    
    // Perform the initial check.
    checkAndSetUser();

    // Set up the listener for subsequent auth events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false); // Also update loading state on auth changes
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // This effect runs whenever loading or user state changes.
    // If loading is finished and there's no user, redirect to home.
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

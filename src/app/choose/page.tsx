
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

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (isMounted) {
        if (user) {
          setUser(user);
          setLoading(false);
        } else {
          // If no user on initial check, wait for onAuthStateChange
          // A timeout is a fallback in case the auth state change doesn't fire.
          setTimeout(() => {
            if (isMounted && !user) setLoading(false);
          }, 1000);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        if (event === 'SIGNED_IN') {
          setUser(session!.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
          router.push('/');
        }
      }
    });

    checkUser();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

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

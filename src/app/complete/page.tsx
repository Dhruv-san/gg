
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ThankYouView } from '@/components/cofound/thank-you-view';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

function CompletePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const skippedProfile = searchParams.get('skipped') === 'true';

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const initialCheck = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
        }
    };
    initialCheck();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [loading, user, router]);

  if (loading) {
    return <Loader2 className="h-10 w-10 animate-spin text-primary" />;
  }
  
  return (
    <div className="w-full max-w-lg">
      <ThankYouView
        email={user?.email || 'your email'}
        skippedProfile={skippedProfile}
      />
    </div>
  );
}

export default function CompletePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-primary" />}>
        <CompletePageContent />
      </Suspense>
    </div>
  );
}

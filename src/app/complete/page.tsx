
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ThankYouView } from '@/components/cofound/thank-you-view';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

function CompletePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const skippedProfile = searchParams.get('skipped') === 'true';

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (isMounted) {
        if (user) {
          setUser(user);
        }
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setUser(session?.user || null);
        setLoading(false);
      }
    });

    checkUser();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

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

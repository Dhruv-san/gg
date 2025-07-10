
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
  
  const skippedProfile = searchParams.get('skipped') === 'true';

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      // Allow access even if not logged in, but get email if they are
      if (data.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, [router]);


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

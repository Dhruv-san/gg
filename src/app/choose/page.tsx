
'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ProfilePromptView } from '@/components/cofound/profile-prompt-view';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

function ChoosePageContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push('/');
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, [router]);

  const handleChoice = (createProfile: boolean) => {
    if (createProfile) {
      router.push('/profile');
    } else {
      router.push('/complete?skipped=true');
    }
  };

  if (!user) {
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


'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileFormView } from '@/components/cofound/profile-form-view';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

function ProfilePageContent() {
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
        setLoading(false);
      }
    };
    
    checkAndSetUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [loading, user, router]);

  const handleSuccess = () => {
    router.push('/complete');
  };

  if (loading || !user) {
    return <Loader2 className="h-10 w-10 animate-spin text-primary" />;
  }

  return (
     <ProfileFormView
      userId={user.id}
      email={user.email!}
      onSuccess={handleSuccess}
    />
  );
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-8">
       <div className="container mx-auto">
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
          <ProfilePageContent />
        </Suspense>
      </div>
    </div>
  );
}


'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message');

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-destructive">
        <CardHeader>
          <div className="flex items-center gap-4 text-destructive">
            <AlertCircle className="h-8 w-8" />
            <CardTitle>Authentication Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>There was a problem authenticating your account.</p>
          {errorMessage && (
            <div className="bg-muted p-4 rounded-md text-sm font-mono text-muted-foreground">
              <p className="font-bold">Error Details:</p>
              <p>{errorMessage}</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            This may have happened because the confirmation link has expired or has already been used.
          </p>
           <Button asChild className="w-full">
             <Link href="/">Return to Homepage</Link>
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}

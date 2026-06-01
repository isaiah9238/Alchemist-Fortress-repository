'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Calculation History"
        description="Review your past AI-powered calculations."
      />
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">History functionality is under development.</p>
            <p className="text-sm">
              Authenticated as: <strong>{user.email}</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

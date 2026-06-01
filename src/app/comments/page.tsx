
import {PageHeader} from '@/components/page-header';
import CommentsClientPage from './comments-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CommentsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Comments & Feedback"
        description="Leave your feedback to help improve ArithmaGen. All comments are public."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <CommentsClientPage />
      </Suspense>
    </div>
  );
}

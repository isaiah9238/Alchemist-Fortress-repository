
import { PageHeader } from '@/components/page-header';
import PointOffsetClientPage from './point-offset-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function PointOffsetPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Point Offset"
        description="Calculate the perpendicular distance (offset) from a point to a line segment."
      />
      <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/inverse-forward">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Offset Calculations
        </Link>
      </Button>
      <PointOffsetClientPage />
    </div>
  );
}

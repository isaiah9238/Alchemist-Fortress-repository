import {PageHeader} from '@/components/page-header';
import DistanceClientPage from './distance-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function GeometryPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <PageHeader
            title="Inverse"
            description="Calculate the distance and azimuth between two coordinates."
          />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/learn/inverse-forward">
              <HelpCircle className="mr-2 h-4 w-4" />
              Learn about Inverse and Forward Calculations
            </Link>
          </Button>
        </div>
        <div className="w-full">
          <DistanceClientPage />
        </div>
      </div>
    </div>
  );
}

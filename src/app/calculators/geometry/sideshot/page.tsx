import {PageHeader} from '@/components/page-header';
import SideshotClientPage from './sideshot-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function SideshotPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <PageHeader
            title="Forward / Sideshot"
            description="Calculate a new point's coordinates from a starting location, azimuth, and distance."
          />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/learn/inverse-forward">
              <HelpCircle className="mr-2 h-4 w-4" />
              Learn about Inverse and Forward Calculations
            </Link>
          </Button>
        </div>
        <div className="w-full">
          <SideshotClientPage />
        </div>
      </div>
    </div>
  );
}

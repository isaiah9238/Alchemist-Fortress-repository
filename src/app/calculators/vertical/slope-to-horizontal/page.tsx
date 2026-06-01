import {PageHeader} from '@/components/page-header';
import SlopeToHorizontalClientPage from './slope-to-horizontal-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function SlopeToHorizontalPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10 text-center">
        <div className="flex flex-col items-center space-y-4">
          <PageHeader
            className="text-center"
            title="Slope to Horizontal"
            description="Choose a method and input the required values to calculate the horizontal distance."
          />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/learn/vertical-calculations">
              <HelpCircle className="mr-2 h-4 w-4" />
              Learn about Slope vs. Horizontal Distance
            </Link>
          </Button>
        </div>
        <div className="text-left">
          <SlopeToHorizontalClientPage />
        </div>
      </div>
    </div>
  );
}

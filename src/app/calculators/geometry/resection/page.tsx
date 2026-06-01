import {PageHeader} from '@/components/page-header';
import ResectionClientPage from './resection-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function ResectionPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <PageHeader
            title="Resection (3-Point)"
            description="Calculate an unknown coordinate by observing angles to three known points using Tienstra's method."
          />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/learn/resection">
              <HelpCircle className="mr-2 h-4 w-4" />
              Learn about Resection
            </Link>
          </Button>
        </div>
        <div className="w-full">
          <ResectionClientPage />
        </div>
      </div>
    </div>
  );
}

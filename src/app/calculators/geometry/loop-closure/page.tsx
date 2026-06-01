import {PageHeader} from '@/components/page-header';
import LoopClosureClientPage from './loop-closure-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function LoopClosurePage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <PageHeader
            title="Loop Closure"
            description="Enter traverse data to calculate misclosure, precision, and adjusted coordinates."
          />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/learn/loop-closure">
              <HelpCircle className="mr-2 h-4 w-4" />
              Learn about Loop Closures
            </Link>
          </Button>
        </div>
        <div className="w-full">
          <LoopClosureClientPage />
        </div>
      </div>
    </div>
  );
}

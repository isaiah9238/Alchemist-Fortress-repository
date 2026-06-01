
import {PageHeader} from '@/components/page-header';
import RationalMethodClientPage from './rational-method-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function StormWaterPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Storm Water Design"
        description="Calculate peak storm water runoff using the Rational Method."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/storm-water">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about the Rational Method
        </Link>
      </Button>
      <RationalMethodClientPage />
    </div>
  );
}

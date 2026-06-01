
import {PageHeader} from '@/components/page-header';
import NrcsCurveNumberClientPage from './nrcs-curve-number-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function NrcsCurveNumberPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="NRCS Curve Number Method"
        description="Estimate direct runoff from a rainfall event."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/storm-water">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about the NRCS Curve Number Method
        </Link>
      </Button>
      <NrcsCurveNumberClientPage />
    </div>
  );
}

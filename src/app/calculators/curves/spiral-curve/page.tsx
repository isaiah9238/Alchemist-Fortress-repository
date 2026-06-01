
import {PageHeader} from '@/components/page-header';
import SpiralCurveClientPage from './spiral-curve-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function SpiralCurvePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Spiral Curve"
        description="Calculate the elements of a circular curve with symmetrical spiral transitions."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/horizontal-curves">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Spiral Curves
        </Link>
      </Button>
      <SpiralCurveClientPage />
    </div>
  );
}

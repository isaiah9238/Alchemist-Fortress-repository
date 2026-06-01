
import {PageHeader} from '@/components/page-header';
import CompoundCurveClientPage from './compound-curve-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function CompoundCurvePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Compound Curve"
        description="Calculate the elements of a compound curve, consisting of two circular arcs of different radii."
      />
      <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/horizontal-curves">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Compound Curves
        </Link>
      </Button>
      <CompoundCurveClientPage />
    </div>
  );
}

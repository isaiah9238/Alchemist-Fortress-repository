
import {PageHeader} from '@/components/page-header';
import VerticalCurveClientPage from './vertical-curve-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


export default function VerticalCurvePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Vertical Curve"
        description="Calculate the elements of a symmetrical vertical curve used in roadway design."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/horizontal-curves">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Vertical Curves
        </Link>
      </Button>
      <VerticalCurveClientPage />
    </div>
  );
}

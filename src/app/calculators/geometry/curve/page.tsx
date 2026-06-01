
import {PageHeader} from '@/components/page-header';
import CurveClientPage from './curve-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


export default function CurvePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Horizontal Curve"
        description="Solve for the elements of a circular curve from two known properties."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/horizontal-curves">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Curve Formulas
        </Link>
      </Button>
      <CurveClientPage />
    </div>
  );
}

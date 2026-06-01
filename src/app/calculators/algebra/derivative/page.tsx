
import {PageHeader} from '@/components/page-header';
import DerivativeClientPage from './derivative-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function DerivativePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Derivative Calculator"
        description="Calculate the derivative of a mathematical expression using AI."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/calculus">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Derivatives
        </Link>
      </Button>
      <DerivativeClientPage />
    </div>
  );
}

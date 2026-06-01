
import {PageHeader} from '@/components/page-header';
import IntegralClientPage from './integral-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function IntegralPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Integral Calculator"
        description="Calculate the integral of a mathematical expression using AI."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/calculus">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Integrals
        </Link>
      </Button>
      <IntegralClientPage />
    </div>
  );
}

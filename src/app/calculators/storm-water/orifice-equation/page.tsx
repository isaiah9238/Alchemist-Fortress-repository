
import {PageHeader} from '@/components/page-header';
import OrificeEquationClientPage from './orifice-equation-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function OrificeEquationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Orifice Equation"
        description="Calculate flow through a submerged orifice."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/storm-water">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about the Orifice Equation
        </Link>
      </Button>
      <OrificeEquationClientPage />
    </div>
  );
}

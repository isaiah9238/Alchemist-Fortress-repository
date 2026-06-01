
import {PageHeader} from '@/components/page-header';
import ManningsEquationClientPage from './mannings-equation-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function ManningsEquationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Manning's Equation"
        description="Calculate flow velocity and rate in an open channel."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/storm-water">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Manning's Equation
        </Link>
      </Button>
      <ManningsEquationClientPage />
    </div>
  );
}

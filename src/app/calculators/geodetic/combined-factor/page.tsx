
import { PageHeader } from '@/components/page-header';
import CombinedFactorClientPage from './combined-factor-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function CombinedFactorPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Combined Factor"
        description="Calculate the combined grid and elevation factor for reducing ground distances to grid coordinates."
      />
      <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/coordinate-systems">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Grid vs. Ground
        </Link>
      </Button>
      <CombinedFactorClientPage />
    </div>
  );
}

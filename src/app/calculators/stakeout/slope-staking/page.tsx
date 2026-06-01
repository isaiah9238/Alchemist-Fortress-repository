
import {PageHeader} from '@/components/page-header';
import SlopeStakingClientPage from './slope-staking-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


export default function SlopeStakingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Slope Staking"
        description="Calculate the catch point for a roadway slope based on design parameters and ground elevation."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/stakeout">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Slope Staking
        </Link>
      </Button>
      <SlopeStakingClientPage />
    </div>
  );
}

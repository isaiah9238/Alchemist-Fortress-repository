
import {PageHeader} from '@/components/page-header';
import CurveStakingClientPage from './curve-staking-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


export default function CurveStakingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Curve Staking"
        description="Generate a stakeout report with deflection angles and chord distances for a horizontal curve."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/stakeout">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Curve Staking
        </Link>
      </Button>
      <CurveStakingClientPage />
    </div>
  );
}


import {PageHeader} from '@/components/page-header';
import BuildingCornersClientPage from './building-corners-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


export default function BuildingCornersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Building Corner Stakeout"
        description="Generate angles and distances to stake building corners from a known instrument setup."
      />
      <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/stakeout">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Stakeout Calculations
        </Link>
      </Button>
      <BuildingCornersClientPage />
    </div>
  );
}


import {PageHeader} from '@/components/page-header';
import SpcsConverterClientPage from './spcs-converter-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


export default function SpcsConverterPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="SPCS Converter"
        description="Convert coordinates between Geodetic (Latitude/Longitude) and State Plane Coordinate Systems (NAD83)."
      />
      <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/coordinate-systems">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about State Plane Systems
        </Link>
      </Button>
      <SpcsConverterClientPage />
    </div>
  );
}

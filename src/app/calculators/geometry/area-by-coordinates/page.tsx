import {PageHeader} from '@/components/page-header';
import AreaByCoordinatesClientPage from './area-by-coordinates-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


export default function AreaByCoordinatesPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <PageHeader
            title="Area by Coordinates"
            description="Calculate the area of a polygon from a list of its coordinates."
          />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/learn/area-by-coordinates">
              <HelpCircle className="mr-2 h-4 w-4" />
              Learn about the Shoelace Formula
            </Link>
          </Button>
        </div>
        <div className="w-full text-left">
          <AreaByCoordinatesClientPage />
        </div>
      </div>
    </div>
  );
}

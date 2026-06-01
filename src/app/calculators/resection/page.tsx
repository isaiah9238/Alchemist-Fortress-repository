import {PageHeader} from '@/components/page-header';
import ResectionClientPage from './resection-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ResectionPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <PageHeader
            title="Resection (Least Squares)"
            description="Calculate an instrument's coordinate using rigorous adjustment for three or more known points."
          />
          <Alert className="max-w-2xl">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Redundant Measurements</AlertTitle>
              <AlertDescription>
                This tool is optimized for 4 or more points. For exactly 3 points, consider the specialized{" "}
                <Link href="/calculators/geometry/resection" className="font-semibold underline">
                  3-Point Resection calculator
                </Link>.
              </AlertDescription>
          </Alert>
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/learn/resection-least-squares">
              <HelpCircle className="mr-2 h-4 w-4" />
              Learn about Least Squares Resection
            </Link>
          </Button>
        </div>
        <div className="w-full text-left">
          <ResectionClientPage />
        </div>
      </div>
    </div>
  );
}

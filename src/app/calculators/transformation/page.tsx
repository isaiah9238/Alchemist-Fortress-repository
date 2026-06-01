
import {PageHeader} from '@/components/page-header';
import TransformationClientPage from './transformation-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


export default function TransformationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Coordinate Transformation"
        description="Transform a set of local coordinates to a grid system using translation, rotation, and scale parameters derived from control points."
      />
       <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/coordinate-systems">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Transformations
        </Link>
      </Button>
      <TransformationClientPage />
    </div>
  );
}


import {PageHeader} from '@/components/page-header';
import IntersectionsClientPage from './intersections-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


export default function IntersectionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Intersections"
        description="Calculate the intersection of lines using various geometric methods."
      />
      <Button asChild variant="link" className="p-0 h-auto">
        <Link href="/learn/intersections">
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn about Intersection Routines
        </Link>
      </Button>
      <IntersectionsClientPage />
    </div>
  );
}

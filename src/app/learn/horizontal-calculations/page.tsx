
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function HorizontalCalculationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Horizontal Calculations"
        description="This page has been split into multiple, more specific articles. Please use the links in the sidebar."
      />
        <Card>
            <CardHeader>
                <CardTitle>Content Moved</CardTitle>
                <CardDescription>
                    The learning content for horizontal calculations has been organized into dedicated pages for each topic.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>You can find the new pages in the &quot;Learn&quot; section of the sidebar.</p>
                <ul>
                    <li><Link href="/learn/inverse-forward" className="underline">Inverse & Forward Calculations</Link></li>
                    <li><Link href="/learn/intersections" className="underline">Intersection Routines</Link></li>
                    <li><Link href="/learn/loop-closure" className="underline">Loop Closure</Link></li>
                    <li><Link href="/learn/area-by-coordinates" className="underline">Area by Coordinates</Link></li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}

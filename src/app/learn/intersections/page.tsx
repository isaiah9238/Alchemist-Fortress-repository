
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function IntersectionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Intersection Routines"
        description="Calculating a point's coordinates from its geometric relationship to known points and lines."
      />

      <Card>
        <CardHeader>
          <CardTitle>Intersection Methods</CardTitle>
          <CardDescription>
            These are some of the most fundamental calculations in coordinate geometry (COGO).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h4>Bearing-Bearing Intersection</h4>
            <p>
                This method finds the intersection point of two lines. You need two known points (P1, P2) and the bearing (direction) from each of those points toward the unknown intersection point. As long as the two bearings are not parallel, they will intersect at a single, unique point.
            </p>
            
            <h4>Bearing-Distance Intersection</h4>
             <p>
                This method finds the intersection of a line and a circle. You need a known point and a bearing from it (which defines the line), plus a second known point and a distance (which defines the circle's radius). This can result in:
            </p>
            <ul>
                <li><strong>Two solutions:</strong> The line crosses the circle at two distinct points.</li>
                <li><strong>One solution:</strong> The line is tangent to the circle, touching it at exactly one point.</li>
                <li><strong>No solution:</strong> The line and the circle do not intersect at all.</li>
            </ul>

            <h4>Distance-Distance Intersection</h4>
            <p>
                This method finds the intersection of two circles. You need two known points and the distance (radius) from each to the unknown intersection point. This can also result in two, one, or no solutions, depending on whether the circles overlap, touch at one point, or are too far apart to intersect.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

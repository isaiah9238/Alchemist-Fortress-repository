
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { VerticalCurveDiagram } from '@/components/vertical-curve-diagram';

export default function VerticalCurveDiagramPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Vertical Curve Diagram"
        description="A visual reference for the elements of a symmetrical parabolic curve."
      />
      <Card>
        <CardContent className="p-6">
            <VerticalCurveDiagram />
        </CardContent>
      </Card>
    </div>
  );
}


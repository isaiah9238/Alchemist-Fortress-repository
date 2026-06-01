
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HorizontalCurveDiagram } from '@/components/horizontal-curve-diagram';

export default function CurveDiagramPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Horizontal Curve Diagram"
        description="A visual reference for the elements of a simple circular curve."
      />
      <Card>
        <CardContent className="p-6">
            <HorizontalCurveDiagram />
        </CardContent>
      </Card>
    </div>
  );
}


import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SpiralCurveDiagram from '@/components/spiral-curve-diagram';

export default function SpiralCurveDiagramPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Spiral Curve Diagram"
        description="A visual reference for the elements of a symmetrical spiral-curve-spiral."
      />
      <Card>
         <CardHeader>
          <CardTitle>Diagram Components</CardTitle>
          <CardDescription>
            This diagram illustrates the transition from a straight tangent to the central circular curve and back out again.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            <SpiralCurveDiagram />
            <div className="flex gap-4 mt-4 justify-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-primary"></span> Spiral (TS-SC & CS-ST)
                </div>
                <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-destructive"></span> Circular Curve (SC-CS)
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { VerticalCurveDiagram } from '@/components/vertical-curve-diagram';
import { Separator } from '@/components/ui/separator';

export default function VerticalCurveReportPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Analysis Report: The Symmetrical Vertical Curve"
        description="A detailed report on the geometric properties of a parabolic vertical curve, a fundamental component in roadway and path design."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Geometric Visualization</CardTitle>
                    <CardDescription>Visual representation of a crest vertical curve with its key components labeled.</CardDescription>
                </CardHeader>
                <CardContent>
                    <VerticalCurveDiagram />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Function Definition</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">The elevation on a symmetrical vertical curve is defined by a quadratic equation:</p>
                    <code className="font-mono text-sm text-primary font-bold mt-2 block bg-muted p-4 rounded-md">
                        y = y₀ + g₁x + (r/2)x²
                    </code>
                     <p className="text-xs text-muted-foreground mt-2">Where 'y' is elevation, 'y₀' is PVC elevation, 'g₁' is initial grade, 'x' is distance from PVC, and 'r' is the rate of change of grade.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Key Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">PVC:</span>
                        <span className="font-mono">Point of Vertical Curvature</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">PVI:</span>
                         <span className="font-mono">Point of Vertical Intersection</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">PVT:</span>
                         <span className="font-mono">Point of Vertical Tangency</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Rate of Change (r):</span>
                        <code className="font-mono">(g₂ - g₁) / L</code>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

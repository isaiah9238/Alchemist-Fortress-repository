import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StaticParabolaGraph } from '@/components/static-parabola-graph';
import { Separator } from '@/components/ui/separator';

export default function ParabolaReportPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Analysis Report: The Parabola"
        description="A detailed report on the geometric and calculus properties of a parabola, based on the standard vertex form."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Geometric Visualization</CardTitle>
                    <CardDescription>Visual representation of a parabola with its key components labeled.</CardDescription>
                </CardHeader>
                <CardContent>
                    <StaticParabolaGraph />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Function Definition</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">The standard vertex form of a parabola is:</p>
                    <code className="font-mono text-lg text-primary font-bold mt-2 block bg-muted p-4 rounded-md">
                        y = a(x - h)² + k
                    </code>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Key Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Vertex:</span>
                        <code className="font-mono">(h, k)</code>
                    </div>
                     <Separator />
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Axis of Symmetry:</span>
                        <code className="font-mono">x = h</code>
                    </div>
                     <Separator />
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Focus:</span>
                        <code className="font-mono">(h, k + 1/4a)</code>
                    </div>
                     <Separator />
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Directrix:</span>
                        <code className="font-mono">y = k - 1/4a</code>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Calculus Insights</CardTitle>
          <CardDescription>
            The derivative and integral of the parabolic function.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h4 className="font-semibold mb-2">Derivative (Slope)</h4>
                <p className="text-sm text-muted-foreground mb-2">The derivative, `y'`, gives the slope of the tangent line at any point `x`.</p>
                <code className="font-mono text-md text-primary font-bold mt-2 block bg-muted p-4 rounded-md">
                    y' = 2a(x - h)
                </code>
            </div>
             <Separator />
             <div>
                <h4 className="font-semibold mb-2">Indefinite Integral (Area)</h4>
                <p className="text-sm text-muted-foreground mb-2">The indefinite integral represents the family of functions whose derivative is the parabola.</p>
                <code className="font-mono text-md text-primary font-bold mt-2 block bg-muted p-4 rounded-md">
                   ∫ y dx = (a/3)(x - h)³ + kx + C
                </code>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ResectionPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Resection (Three-Point Problem)"
        description="Determining an unknown coordinate by observing angles to three known points."
      />

      <Card>
        <CardHeader>
          <CardTitle>The Resection Problem</CardTitle>
          <CardDescription>
            In surveying, a resection is a method used to determine the surveyor's own position by measuring angles to known locations. In the three-point problem, the surveyor occupies an unknown point and measures the horizontal angles between three visible points whose coordinates are already known.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              This technique is incredibly useful when it is impractical or impossible to set up an instrument directly over a known point. For example, a surveyor might need to establish a new control point in a safe location with good visibility to the rest of a construction site.
            </p>
            <h4>Tienstra's Method (or the Snellius-Pothenot problem)</h4>
            <p>
              While there are several ways to solve this problem, one of the most elegant is Tienstra's method. It uses a weighted average of the coordinates of the three known points (P1, P2, P3) to find the coordinates of the unknown point (P).
            </p>
            <ol>
                <li>
                    <strong>Measure Angles at Unknown Point:</strong> From your unknown location P, measure the angles between the known points. For example, `∠P1-P-P2` and `∠P2-P-P3`.
                </li>
                <li>
                    <strong>Calculate Known Triangle Angles:</strong> Using the coordinates of P1, P2, and P3, use the Law of Cosines to calculate the interior angles of the triangle formed by these three known points.
                </li>
                <li>
                    <strong>Calculate Weights:</strong> The "weight" for each known point is calculated using the cotangents of the known triangle angles and the measured angles. The formula is:
                    <br/>
                    <code>Weight₁ = 1 / (cot(Angle_at_P1) - cot(∠P2-P-P3))</code>
                    <br/>
                    ...and so on for the other two points.
                </li>
                <li>
                    <strong>Calculate Weighted Average:</strong> The coordinate of the unknown point P is the sum of each known point's coordinate multiplied by its weight, all divided by the sum of the weights.
                    <br/>
                    <code>Px = (w₁*x₁ + w₂*x₂ + w₃*x₃) / (w₁ + w₂ + w₃)</code>
                    <br/>
                    <code>Py = (w₁*y₁ + w₂*y₂ + w₃*y₃) / (w₁ + w₂ + w₃)</code>
                </li>
            </ol>
            <h4>The Danger Circle</h4>
            <p>
              A unique solution to the resection problem is not possible if the unknown point P lies on the circle that passes through the three known points P1, P2, and P3. This is known as the "danger circle." In this geometric condition, the formulas become indeterminate. Our calculator will warn you if your setup is on or near this circle. To fix this, you must choose a different set of known points or move your instrument setup location.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

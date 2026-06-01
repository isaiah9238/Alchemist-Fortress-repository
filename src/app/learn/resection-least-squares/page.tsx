
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ResectionLeastSquaresPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Resection by Least Squares"
        description="Solving for an unknown position using redundant measurements."
      />

      <Card>
        <CardHeader>
          <CardTitle>Beyond Three Points</CardTitle>
          <CardDescription>
            While a three-point resection provides a unique geometric solution, using more than three known points introduces redundancy. This is highly desirable in surveying, as it allows for a more statistically robust solution through a Least Squares Adjustment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              A least squares adjustment finds the "best fit" solution for an over-determined system by minimizing the sum of the squares of the residuals (the differences between observed and computed values).
            </p>
            <h4>The Matrix Method</h4>
            <p>
              The problem is solved using matrix algebra. The core idea is to start with an approximate position for the unknown point and iteratively calculate corrections until the solution converges.
            </p>
            <ol>
                <li>
                    <strong>Initial Approximations:</strong> Calculate a rough starting coordinate for the unknown point. A simple average of the known control points is often sufficient.
                </li>
                <li>
                    <strong>Form Observation Equations:</strong> For each measured angle, an equation is formed that relates the observation to the unknown coordinates. Because these equations are non-linear, they are linearized using a Taylor series expansion.
                </li>
                <li>
                    <strong>Build the Matrices:</strong> The linearized equations are used to populate three key matrices:
                    <ul>
                        <li><strong>A (Design Matrix):</strong> Contains the partial derivatives of the observation equations with respect to the unknown coordinates.</li>
                        <li><strong>L (Misclosure Matrix):</strong> Contains the differences between the observed angles and the angles computed from the approximate coordinates.</li>
                        <li><strong>P (Weight Matrix):</strong> Represents the confidence in each observation. For simplicity, it's often an identity matrix, meaning all observations are weighted equally.</li>
                    </ul>
                </li>
                <li>
                    <strong>Solve the Normal Equations:</strong> The heart of the adjustment is solving the matrix equation <code>(AᵀPA)X = AᵀPL</code> for <code>X</code>, which is the vector of corrections to the approximate coordinates. This requires inverting the `(AᵀPA)` matrix.
                </li>
                 <li>
                    <strong>Iterate:</strong> Apply the corrections to the approximate coordinates to get a better estimate. Repeat the process until the corrections in <code>X</code> become negligibly small, indicating the solution has converged.
                </li>
            </ol>
            <p>
              The Resection (LS) calculator handles this entire complex process, providing a final, adjusted coordinate that is the most probable position based on all available observations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

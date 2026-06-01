
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CalculusPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Calculus & Algebra Concepts"
        description="Understanding derivatives, integrals, and polynomial factoring."
      />

      <Card>
        <CardHeader>
          <CardTitle>Derivatives</CardTitle>
          <CardDescription>
            A derivative represents the instantaneous rate of change of a function at a certain point.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              In simple terms, the derivative tells you the slope of the tangent line to a function's graph at any given point. It's a fundamental concept used in physics to find velocity from a position function, in economics to find marginal cost, and in many other fields.
            </p>
            <h4>Common Rules</h4>
            <ul>
              <li><strong>Power Rule:</strong> The derivative of <code>xⁿ</code> is <code>n * xⁿ⁻¹</code>. For example, the derivative of <code>x³</code> is <code>3x²</code>.</li>
              <li><strong>Constant Rule:</strong> The derivative of a constant is <code>0</code>. The derivative of <code>5</code> is <code>0</code>.</li>
              <li><strong>Sum/Difference Rule:</strong> You can take the derivative of each part of a sum or difference separately. The derivative of <code>x² + 2x</code> is <code>2x + 2</code>.</li>
              <li><strong>Trigonometric Functions:</strong> The derivative of <code>sin(x)</code> is <code>cos(x)</code>, and the derivative of <code>cos(x)</code> is <code>-sin(x)</code>.</li>
            </ul>
             <p>Our AI calculator can handle these rules and much more complex combinations, providing you with the step-by-step differentiation.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrals</CardTitle>
          <CardDescription>
            An integral can be thought of as the "antiderivative" or a way to calculate the area under a curve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h4>Indefinite vs. Definite Integrals</h4>
            <ul>
              <li>
                <strong>Indefinite Integral:</strong> This is the reverse of differentiation. The indefinite integral of <code>2x</code> is <code>x² + C</code>. The "+ C" is the "constant of integration," which is added because the derivative of any constant is zero.
              </li>
              <li>
                <strong>Definite Integral:</strong> This calculates the exact area under a function's curve between two points (the "bounds" or "limits" of integration). For example, the definite integral of <code>2x</code> from 0 to 10 calculates the area of the triangle under that line, which is 100.
              </li>
            </ul>
             <p>The AI calculator can solve both types. If you provide upper and lower bounds, it will calculate a definite integral and its numerical value. If you leave them blank, it will find the indefinite integral.</p>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Polynomial Factoring</CardTitle>
          <CardDescription>
            Factoring is the process of breaking down a polynomial into simpler "factor" expressions that can be multiplied together to get the original.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
                Factoring is a key skill in algebra used to solve polynomial equations. The "roots" of a polynomial are the values that make the polynomial equal to zero.
            </p>
             <h4>Example</h4>
            <p>
                Consider the polynomial <code>x² - 4</code>.
            </p>
            <ul>
                <li><strong>Factored Form:</strong> This is a "difference of squares" and can be factored into <code>(x - 2)(x + 2)</code>.</li>
                <li><strong>Roots:</strong> To find the roots, you set the factored form to zero. The values of x that make this true are <code>2</code> and <code>-2</code>.</li>
            </ul>
            <p>The AI tool can help you find both the factored form and the roots for more complex polynomials.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

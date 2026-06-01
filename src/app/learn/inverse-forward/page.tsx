
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Code } from 'lucide-react';

export default function InverseForwardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Inverse & Forward Calculations"
        description="The two most fundamental calculations in coordinate geometry (COGO)."
      />

      <Card>
        <CardHeader>
          <CardTitle>Coordinate Systems in Surveying</CardTitle>
          <CardDescription>
            Locations are represented as points in a grid system of Northing (N) and Easting (E).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ul>
              <li>
                <strong>Northing (N)</strong> is the equivalent of the y-coordinate,
                representing the distance north of a reference point.
              </li>
              <li>
                <strong>Easting (E)</strong> is the equivalent of the x-coordinate,
                representing the distance east of a reference point.
              </li>
            </ul>
            <p>So, a point is defined as (E, N) or (X, Y).</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Inverse Calculation</CardTitle>
          <CardDescription>
            An "Inverse" calculates the distance and direction (azimuth or bearing) between two known points.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h4>Calculating Horizontal Distance</h4>
            <ol>
              <li>
                <strong>Find the Change in Northing (ΔN):</strong>
                <code>ΔN = N₂ - N₁</code>
              </li>
              <li>
                <strong>Find the Change in Easting (ΔE):</strong>
                <code>ΔE = E₂ - E₁</code>
              </li>
              <li>
                <strong>Apply the Pythagorean Theorem:</strong>
                <code>HD = √((ΔE)² + (ΔN)²)</code>
              </li>
            </ol>
            
            <hr/>
            
            <h4>Calculating Azimuth</h4>
             <ol>
              <li>
                <strong>Use the Arctangent Function:</strong> The azimuth is calculated using the `atan2` function.
                <code>Azimuth (in radians) = atan2(ΔE, ΔN)</code>
              </li>
              <li>
                <strong>Convert to Degrees:</strong>
                <code>Degrees = Radians * (180 / π)</code>
              </li>
               <li>
                <strong>Handle Negative Angles:</strong>
                <code>If Angle &lt; 0, then Azimuth = Angle + 360°</code>
              </li>
             </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forward / Sideshot Calculation</CardTitle>
          <CardDescription>
            A "Forward" or "Sideshot" calculates a new point's coordinates from a known starting point, a direction, and a distance.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="prose prose-sm dark:prose-invert max-w-none">
               <ol>
                <li>
                    <strong>Start with Known Data:</strong> Starting Point (N₁, E₁), Azimuth, and Horizontal Distance (HD).
                </li>
                <li>
                    <strong>Convert Azimuth to Radians:</strong>
                    <code>Radians = Degrees * (π / 180)</code>
                </li>
                <li>
                    <strong>Calculate Change in Northing (ΔN) and Easting (ΔE):</strong>
                    <code>ΔN = HD * cos(Radians)</code>
                    <br />
                    <code>ΔE = HD * sin(Radians)</code>
                </li>
                <li>
                    <strong>Calculate New Coordinates:</strong>
                    <code>New Northing (N₂) = N₁ + ΔN</code>
                    <br />
                    <code>New Easting (E₂) = E₁ + ΔE</code>
                </li>
                </ol>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

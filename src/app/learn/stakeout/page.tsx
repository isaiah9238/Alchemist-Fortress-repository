
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Code } from 'lucide-react';

export default function StakeoutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Construction Stakeout Concepts"
        description="Understanding how design plans are transferred to the field for construction."
      />

      <Card>
        <CardHeader>
          <CardTitle>Slope Staking</CardTitle>
          <CardDescription>
            Slope staking is the process of locating and marking the point where a proposed cut or fill slope intersects the natural ground surface.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              In roadway construction, the design specifies the width, cross-slope, and elevation of the road. However, the existing ground is rarely at the same elevation. This requires either cutting into the ground or filling on top of it to create the roadbed. The "catch point" is where this new engineered slope meets the original ground.
            </p>
            <h4>Key Terms</h4>
            <ul>
              <li><strong>Hinge Point (or Grade Break):</strong> The edge of the roadway shoulder, where the final design slope begins.</li>
              <li><strong>Cut Slope:</strong> The slope of the new ground surface when the road is lower than the existing ground. Often a flatter slope like 2:1 (2 horizontal to 1 vertical) for stability.</li>
              <li><strong>Fill Slope:</strong> The slope of the new embankment when the road is higher than the existing ground. Also typically a flatter slope like 2:1 or 3:1.</li>
              <li><strong>Catch Point:</strong> The target of slope staking—the line where the cut or fill slope intersects the natural ground.</li>
            </ul>
            <h4>The Calculation Process</h4>
            <p>
              Finding the catch point is often an iterative field process, but the core calculation determines the target location based on a few knowns. Let's assume a simple case where the existing ground is level cross-wise.
            </p>
            <ol>
                <li>
                    Determine if it's a <strong>cut</strong> or <strong>fill</strong> situation at the hinge point. If the ground elevation is higher than the design elevation, it's a cut. If lower, it's a fill.
                </li>
                <li>
                    Calculate the vertical difference (<strong>v</strong>) between the design elevation at the hinge point and the ground elevation.
                </li>
                <li>
                    Use the appropriate slope ratio (<strong>S</strong>, e.g., 2 for a 2:1 slope). The horizontal distance (<strong>h</strong>) from the hinge point to the catch point is calculated as <code>h = v * S</code>.
                </li>
                 <li>
                    The total offset from the centerline is the distance from the centerline to the hinge point, plus this calculated horizontal distance 'h'.
                </li>
            </ol>
             <p>This provides the surveyor with a target offset and elevation to guide the construction crew in their earthwork.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Curve Staking</CardTitle>
          <CardDescription>
            Curve staking involves laying out the points of a horizontal curve in the field. The most common method uses deflection angles and chord distances.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              The goal of curve staking is to place stakes at regular intervals along the path of a horizontal curve (e.g., every 25, 50, or 100 feet). This is typically done by setting up a total station instrument over the PC (Point of Curvature), orienting to the PI (Point of Intersection), and then turning angles and measuring distances to each point on the curve.
            </p>
            <h4>Key Terms & Concepts</h4>
            <ul>
              <li><strong>Deflection Angle:</strong> The angle at the PC between the main tangent and the line to a specific point on the curve. A key property of a circular curve is that the deflection angle to any point is exactly half of the central angle to that same point.</li>
              <li><strong>Chord Distance:</strong> The straight-line distance from the PC to the specific point being staked on the curve. This is not the same as the arc length.</li>
            </ul>
            <h4>The Calculation Process</h4>
            <p>
              The Curve Staking calculator automates this entire process. For each station you want to stake, it performs the following calculations:
            </p>
            <ol>
                <li>
                    <strong>Calculate Arc Length (l):</strong> Determine the distance along the curve from the PC to the desired station. For example, to stake station 10+50 from a PC at 10+00, the arc length is 50 feet.
                </li>
                <li>
                    <strong>Calculate Deflection Angle (δ):</strong> The deflection angle for a given arc length is found using the formula:
                    <br />
                    <code>Deflection Angle (δ) in degrees = (l / (2 * R)) * (180 / π)</code>
                    <br/>
                    Where `l` is the arc length and `R` is the curve radius.
                </li>
                <li>
                    <strong>Calculate Chord Distance (c):</strong> The chord distance is calculated using the deflection angle:
                    <br />
                    <code>Chord Distance (c) = 2 * R * sin(δ)</code>
                </li>
            </ol>
             <p>The result is a report that tells the field surveyor: "To stake station X, turn angle Y from the tangent and measure distance Z."</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Building Corner Stakeout</CardTitle>
          <CardDescription>
            Laying out building corners requires translating design coordinates into angles and distances from a field setup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              Before any foundation can be poured, the precise locations of the building corners must be staked on the ground. This process relies on having at least two known control points on the job site that the surveyor can use for orientation.
            </p>
            <h4>The Field Process</h4>
            <ol>
              <li>
                <strong>Instrument Setup:</strong> The surveyor sets up their total station over a known point (the "Instrument Point").
              </li>
              <li>
                <strong>Backsight Orientation:</strong> The surveyor then aims the instrument at another known point (the "Backsight Point"). They "zero out" the horizontal angle on the instrument while aimed at the backsight. This establishes a known baseline or reference direction.
              </li>
              <li>
                <strong>Calculate Angles & Distances:</strong> For each building corner, the surveyor calculates the horizontal angle to turn (from the backsight) and the horizontal distance to measure (from the instrument).
              </li>
              <li>
                <strong>Stakeout:</strong> The instrument operator turns the calculated angle, and the rod-person moves with a prism until they are on the correct line. The instrument measures the distance, and the rod-person moves forward or backward until they are at the exact calculated distance. A stake is then driven at that precise location.
              </li>
            </ol>
            <h4>Core Calculations</h4>
            <p>The stakeout calculator performs the "office" part of this work automatically:</p>
            <ul>
                <li>It calculates the inverse bearing from the Instrument Point to the Backsight Point (this is the reference direction).</li>
                <li>For each building corner, it calculates the inverse bearing from the Instrument Point to that corner.</li>
                <li>The difference between these two bearings gives the **Angle Right** to turn from the backsight.</li>
                <li>The Pythagorean theorem gives the **Horizontal Distance** to measure from the instrument to the corner.</li>
            </ul>
             <p>This provides the field crew with a simple, actionable report of "Angle Right" and "Distance" for every point that needs to be staked.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

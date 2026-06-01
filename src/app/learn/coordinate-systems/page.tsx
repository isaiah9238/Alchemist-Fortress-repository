
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CoordinateSystemsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Coordinate Systems & Transformations"
        description="Understanding how to translate survey data from a local setup to a real-world grid system."
      />

      <Card>
        <CardHeader>
          <CardTitle>From Local to Grid: The Transformation Process</CardTitle>
          <CardDescription>
            Most surveys start in an arbitrary "local" coordinate system. The
            process of transformation anchors this local data onto a recognized
            grid system, like a State Plane system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h4>The Three Core Parameters</h4>
            <p>
              To align a local system with a grid system, we calculate and apply three primary transformations, often derived from two or more common "control points" that have known coordinates in both systems.
            </p>
            <ol>
              <li>
                <strong>Translation (Shift):</strong> This is the simplest step, involving shifting the entire set of local points. It is calculated as the difference between the grid and local coordinates of a control point after rotation and scaling have been accounted for.
                <br />
                <code>Translation X = Grid_X - (Local_X * Scale * cos(θ) - Local_Y * Scale * sin(θ))</code>
                 <br />
                <code>Translation Y = Grid_Y - (Local_X * Scale * sin(θ) + Local_Y * Scale * cos(θ))</code>
              </li>
              <li>
                <strong>Rotation (Bearing):</strong> This aligns the orientation of the local system with the grid system. It's the angular difference between the bearing of a line connecting two control points in the local system versus the grid system.
                <br />
                <code>Rotation Angle (θ) = Bearing_Grid - Bearing_Local</code>
              </li>
              <li>
                <strong>Scale:</strong> This corrects for any systematic difference between the measured distances in the local system and the distances in the grid system. It is calculated as the ratio of the grid distance to the local distance between two control points.
                <br />
                <code>Scale Factor = Grid_Distance / Local_Distance</code>
              </li>
            </ol>
            
            <hr />

            <h4>State Plane Coordinate Systems (SPCS)</h4>
            <p>
              While transformations handle local alignments, the <strong>State Plane Coordinate System (SPCS)</strong> solves a much bigger problem: representing the curved surface of the Earth on a flat map. It's a set of over 120 different zones or projections covering the United States.
            </p>
            <ul>
              <li>
                <strong>Why It Exists:</strong> Standard latitude and longitude are angles on a sphere, which makes calculating distances and areas complex. SPCS creates a flat grid (using Northing and Easting) for a specific region, allowing surveyors to use simple plane geometry while maintaining a high degree of accuracy.
              </li>
              <li>
                <strong>Minimizing Distortion:</strong> Each SPCS zone is designed to be small enough that the distortion from "flattening" the Earth is negligible for most surveying work. This is why a large state like California has six different zones.
              </li>
              <li>
                <strong>Common Projections:</strong> SPCS primarily uses two types of map projections:
                <ul>
                    <li><strong>Lambert Conformal Conic:</strong> Used for states that are wider in the east-west direction (e.g., Pennsylvania, Tennessee). It projects the globe onto a cone.</li>
                    <li><strong>Transverse Mercator:</strong> Used for states that are taller in the north-south direction (e.g., Illinois, Arizona). It projects the globe onto a cylinder.</li>
                </ul>
              </li>
            </ul>
             <p>
              The SPCS Converter tool uses these complex projection formulas (via the `proj4` library) to accurately convert between geodetic coordinates (Latitude/Longitude, NAD83) and the grid coordinates of any selected state plane zone.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

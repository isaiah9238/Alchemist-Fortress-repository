
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function HorizontalCurvesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Curve Formulas"
        description="The fundamental equations used to calculate the geometry of simple, vertical, compound, and spiral curves."
      />

      <Card>
        <CardHeader>
          <CardTitle>Simple Horizontal Curve Components</CardTitle>
          <CardDescription>
            These are the primary geometric elements of a circular curve connecting two tangents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
                 <p>
                    A simple circular curve has a constant radius. The following formulas are used to calculate its properties based on two known values, typically the Radius (R) and the Deflection Angle (Δ or I).
                 </p>
                <ul>
                    <li><strong>R:</strong> Radius</li>
                    <li><strong>Δ (Delta) or I:</strong> Deflection Angle / Intersection Angle</li>
                    <li><strong>T:</strong> Tangent Length (PC to PI)</li>
                    <li><strong>L:</strong> Length of Curve (arc length from PC to PT)</li>
                    <li><strong>PC:</strong> Point of Curvature (start)</li>
                    <li><strong>PT:</strong> Point of Tangency (end)</li>
                    <li><strong>PI:</strong> Point of Intersection</li>
                </ul>
            </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Element</TableHead>
                <TableHead>Formula</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Tangent (T)</TableCell>
                <TableCell className="font-mono">R * tan(Δ / 2)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Length of Curve (L)</TableCell>
                <TableCell className="font-mono">R * Δ * (π / 180)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Symmetrical Vertical Curve Formulas</CardTitle>
          <CardDescription>
            The formulas for a symmetrical parabolic vertical curve, used to transition between grades.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>Vertical curves use a parabolic shape to create a smooth transition. The core formula allows you to find the elevation of any point on the curve.</p>
                <ul>
                    <li><strong>g₁:</strong> Initial Grade (%)</li>
                    <li><strong>g₂:</strong> Final Grade (%)</li>
                    <li><strong>L:</strong> Total Horizontal Length of the Curve</li>
                    <li><strong>PVC:</strong> Point of Vertical Curvature (start of curve)</li>
                    <li><strong>PVI:</strong> Point of Vertical Intersection (where grades intersect)</li>
                    <li><strong>PVT:</strong> Point of Vertical Tangency (end of curve)</li>
                </ul>
            </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Element</TableHead>
                <TableHead>Formula</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Rate of Change (r)</TableCell>
                <TableCell className="font-mono">(g₂ - g₁) / L</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Elevation at distance x</TableCell>
                <TableCell className="font-mono">Elev_pvc + (g₁ * x) + (r / 2) * x²</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">High/Low Point distance (x)</TableCell>
                <TableCell className="font-mono">-g₁ / r</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compound Curve Formulas</CardTitle>
          <CardDescription>
            A compound curve consists of two or more simple curves turning in the same direction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>Calculations involve solving for the elements of each curve individually and then combining them to find the total tangent lengths relative to the main PI.</p>
                <ul>
                    <li><strong>R₁, Δ₁:</strong> Radius and Delta of the first (larger) curve.</li>
                    <li><strong>R₂, Δ₂:</strong> Radius and Delta of the second (smaller) curve.</li>
                    <li><strong>PCC:</strong> Point of Compound Curvature (where the two curves meet).</li>
                    <li><strong>Tₐ, Tₑ:</strong> The two unequal tangent lengths of the compound curve system.</li>
                </ul>
            </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Element</TableHead>
                <TableHead>Formula</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Total Deflection (Δ)</TableCell>
                <TableCell className="font-mono">Δ₁ + Δ₂</TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-bold">Tangent of Curve 1 (T₁)</TableCell>
                <TableCell className="font-mono">R₁ * tan(Δ₁ / 2)</TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-bold">Tangent of Curve 2 (T₂)</TableCell>
                <TableCell className="font-mono">R₂ * tan(Δ₂ / 2)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spiral Curve Formulas</CardTitle>
          <CardDescription>
            Formulas for a symmetrical spiral-curve-spiral combination, providing a smooth transition for high-speed alignments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>A spiral curve has a continuously changing radius. It's used to ease the transition from a straight tangent to a circular curve. The math is more complex and often relies on series expansions for accuracy.</p>
                <ul>
                    <li><strong>Lₛ:</strong> Length of one spiral.</li>
                    <li><strong>Rₒ:</strong> Radius of the central circular curve.</li>
                    <li><strong>Δ:</strong> Total deflection angle of the entire system.</li>
                    <li><strong>θₛ:</strong> The total angle "used" by one spiral.</li>
                    <li><strong>p:</strong> The "throw," or the offset of the shifted tangent.</li>
                    <li><strong>k:</strong> The distance along the tangent to the shifted PC.</li>
                    <li><strong>Tₛ:</strong> The total tangent length from the TS to the PI.</li>
                </ul>
            </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Element</TableHead>
                <TableHead>Formula</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Spiral Angle (θₛ)</TableCell>
                <TableCell className="font-mono">Lₛ / (2 * Rₒ)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Throw (p)</TableCell>
                <TableCell className="font-mono">Yc - Rₒ * (1 - cos(θₛ))</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Tangent Distance (k)</TableCell>
                <TableCell className="font-mono">Xc - Rₒ * sin(θₛ)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Total Tangent (Tₛ)</TableCell>
                <TableCell className="font-mono">k + (Rₒ + p) * tan(Δ / 2)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Circular Arc (Lₒ)</TableCell>
                <TableCell className="font-mono">Rₒ * (Δ - 2 * θₛ)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Spiral Xc/Yc</TableCell>
                <TableCell className="font-mono">Calculated using a power series expansion.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

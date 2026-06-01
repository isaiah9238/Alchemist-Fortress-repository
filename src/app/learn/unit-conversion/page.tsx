
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

export default function UnitConversionPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Unit Conversions"
        description="Understanding the fundamental units of measurement in land surveying."
      />

      <Card>
        <CardHeader>
          <CardTitle>Units of Distance</CardTitle>
          <CardDescription>
            While they seem similar, the difference between the U.S. Survey Foot and the International Foot is critical in high-precision work.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h4>The Meter: The Standard Base</h4>
            <p>
              The base unit for modern geodetic and state plane coordinate systems is the <strong>meter</strong>. Both the U.S. Survey Foot and the International Foot are officially defined by their relationship to the meter.
            </p>
            
            <hr />

            <h4>The International Foot</h4>
            <p>
              In 1959, the United States and other English-speaking nations agreed on a standard definition for the foot. This is known as the <strong>International Foot</strong>.
            </p>
            <ul>
              <li>
                <strong>Definition:</strong> 1 International Foot = <strong>0.3048 meters exactly</strong>.
              </li>
              <li>
                <strong>Usage:</strong> It is the standard for most non-surveying applications, including engineering, architecture, and everyday measurements.
              </li>
            </ul>

            <hr />

            <h4>The U.S. Survey Foot</h4>
            <p>
              Prior to 1959, the United States used a slightly different definition based on an older standard. To avoid the monumental task of converting all historical survey data, this definition was retained specifically for surveying applications and named the <strong>U.S. Survey Foot</strong>.
            </p>
            <ul>
              <li>
                <strong>Definition:</strong> 1 meter = <strong>39.37 inches exactly</strong>. This leads to the conversion factor: 1 U.S. Survey Foot = <strong>1200 / 3937 meters</strong>.
              </li>
              <li>
                <strong>Usage:</strong> It is the legal standard for all State Plane Coordinate Systems in the United States. When working with SPCS data, you must use the U.S. Survey Foot.
              </li>
            </ul>
            
            <hr />

            <h4>Why Does It Matter?</h4>
            <p>
              The difference between the two definitions is minuscule—about 2 parts per million. An International Foot is exactly 0.999998 U.S. Survey Feet. While this seems tiny, it becomes significant over large distances.
            </p>
            <blockquote>
              Over a distance of one mile, the difference between the two units is approximately 0.01 feet (or about 1/8th of an inch). This is a small but critical discrepancy in large-scale boundary or construction projects.
            </blockquote>
            <p>
              Using the wrong foot definition can lead to significant errors in precision and can have legal and financial consequences. As of 2023, the U.S. Survey Foot has been officially deprecated to encourage a single, uniform standard, but all historical data and existing SPCS NAD83 systems still rely on it.
            </p>
            
            <h4>Distance Conversion Factors</h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>From Unit</TableHead>
                        <TableHead>To Unit</TableHead>
                        <TableHead>Multiply By</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>U.S. Survey Feet</TableCell>
                        <TableCell>Meters</TableCell>
                        <TableCell className="font-mono">1200 / 3937</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>Meters</TableCell>
                        <TableCell>U.S. Survey Feet</TableCell>
                        <TableCell className="font-mono">3937 / 1200</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>International Feet</TableCell>
                        <TableCell>Meters</TableCell>
                        <TableCell className="font-mono">0.3048</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>Meters</TableCell>
                        <TableCell>International Feet</TableCell>
                        <TableCell className="font-mono">1 / 0.3048</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>U.S. Survey Feet</TableCell>
                        <TableCell>International Feet</TableCell>
                        <TableCell className="font-mono">0.999998</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>International Feet</TableCell>
                        <TableCell>U.S. Survey Feet</TableCell>
                        <TableCell className="font-mono">1 / 0.999998</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            
            <hr />

            <h4 className="pt-4">📐 Units of Area</h4>
            <p>
                Just as with distance, the units used for area are critical for precision and legal documentation. The two most common large-scale units are Acres (Imperial/U.S. Customary) and Hectares (Metric).
            </p>
            <h5>1. The Acre (ac)</h5>
            <p>
                The Acre is the standard unit of land area in the United States.
            </p>
             <ul>
              <li>
                <strong>Definition:</strong> Exactly 43,560 square feet.
              </li>
              <li>
                <strong>Visualizing it:</strong> Historically, an acre was the amount of land a yoke of oxen could plow in one day. Today, it is roughly the size of an American football field (excluding the end zones).
              </li>
            </ul>

            <h5>2. The Hectare (ha)</h5>
            <p>
                The Hectare is the metric standard for large-scale land measurement used globally.
            </p>
             <ul>
              <li>
                <strong>Definition:</strong> Exactly 10,000 square meters. The "100-Meter Square": It is easiest to remember as a square with 100-meter sides (100m x 100m).
              </li>
              <li>
                <strong>Visualizing it:</strong> A hectare is roughly 2.47 times larger than an acre—about the size of two and a half American football fields or one large international soccer pitch.
              </li>
            </ul>

            <h4>Area Conversion Factors</h4>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Unit</TableHead>
                        <TableHead>to Square Feet (ft²)</TableHead>
                        <TableHead>to Square Meters (m²)</TableHead>
                        <TableHead>to Acres (ac)</TableHead>
                        <TableHead>to Hectares (ha)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>1 Acre</TableCell>
                        <TableCell className="font-mono">43,560</TableCell>
                        <TableCell className="font-mono">4,046.86</TableCell>
                        <TableCell className="font-mono">1</TableCell>
                        <TableCell className="font-mono">0.4047</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>1 Hectare</TableCell>
                        <TableCell className="font-mono">107,639.1</TableCell>
                        <TableCell className="font-mono">10,000</TableCell>
                        <TableCell className="font-mono">2.471</TableCell>
                        <TableCell className="font-mono">1</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}

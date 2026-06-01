
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

export default function LoopClosurePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Loop Traverse & Misclosure"
        description="Understanding how to quantify the error in a closed traverse."
      />

      <Card>
        <CardHeader>
          <CardTitle>Traverse Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              A <strong>Traverse</strong> is a series of connected lines whose lengths and directions have been measured. A <strong>Loop Traverse</strong> is one that starts and ends at the same point. In a perfect world, if you traverse a loop, you should end up exactly where you started. However, due to small, unavoidable errors in measurement, this rarely happens. The gap between the starting point and the calculated ending point is called the <strong>Error of Closure</strong> or <strong>Misclosure</strong>.
            </p>
            <ol>
              <li>
                <strong>Calculate Latitudes and Departures:</strong> For each leg of the traverse, you calculate its latitude (change in Northing) and departure (change in Easting).
                <br />
                <code>Latitude (ΔN) = Distance * cos(Bearing)</code>
                <br />
                <code>Departure (ΔE) = Distance * sin(Bearing)</code>
              </li>
              <li>
                <strong>Sum the Latitudes and Departures:</strong> Add up all the individual latitudes (ΣΔN) and departures (ΣΔE). For a perfect loop, both sums should be zero. The actual sums represent the total error in the north-south and east-west directions, respectively.
              </li>
              <li>
                <strong>Calculate Misclosure Distance:</strong> The linear misclosure is the hypotenuse of the right triangle formed by the sum of latitudes and sum of departures.
                <br />
                <code>Misclosure Distance = √((ΣΔE)² + (ΣΔN)²)</code>
              </li>
               <li>
                <strong>Determine Precision:</strong> Precision is a ratio of the misclosure distance to the total length of the traverse. It's a measure of the survey's quality.
                <br />
                <code>Precision = Total Traverse Length / Misclosure Distance</code>
                <br />
                This is typically expressed in the format "1 in X", where X = Precision. A higher value for X indicates a more precise survey. For example, a precision of 1 in 10,000 is better than 1 in 5,000.
              </li>
            </ol>
             <Accordion type="single" collapsible className="not-prose">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span>Misclosure Example</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none font-mono p-4 bg-muted rounded-md">
                    <p>
                      Imagine a simple square traverse with 4 sides of 100.00 ft.
                      <br/>
                      Leg 1: N90°E, 100.00' (Azimuth 90°)
                      <br/>
                      Leg 2: S0°E, 100.00' (Azimuth 180°)
                      <br/>
                      Leg 3: S90°W, 100.00' (Azimuth 270°)
                      <br/>
                      Leg 4: N0°W, 100.01' (Azimuth 0°/360°) - Note the small error in the last distance.
                    </p>
                    <p>
                      Latitudes: 0.00 - 100.00 + 0.00 + 100.01 = +0.01 (ΣΔN)
                      <br/>
                      Departures: +100.00 + 0.00 - 100.00 + 0.00 = 0.00 (ΣΔE)
                    </p>
                    <p>
                      Misclosure = √((0.00)² + (0.01)²) = 0.01 ft
                    </p>
                     <p>
                      Total Distance = 100.00 + 100.00 + 100.00 + 100.01 = 400.01 ft
                      <br/>
                      Precision = 400.01 / 0.01 = 40,001
                      <br/>
                      <strong>Precision = 1 in 40,000</strong>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

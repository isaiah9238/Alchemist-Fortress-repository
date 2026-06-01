
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

export default function VerticalCalculationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Vertical Calculations"
        description="Learn the fundamental concepts of vertical land surveying calculations."
      />

      <Card>
        <CardHeader>
          <CardTitle>Differential Leveling</CardTitle>
          <CardDescription>
            The most common method for determining the difference in elevation between points.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
             <p>
              Differential leveling involves using a level instrument to read a graduated rod. Key terms include:
            </p>
            <ul>
              <li>
                <strong>Benchmark (BM):</strong> A point of known, fixed elevation.
              </li>
              <li>
                <strong>Backsight (BS):</strong> A reading on a level rod held on a point of known elevation. This is used to establish the Height of Instrument.
              </li>
               <li>
                <strong>Height of Instrument (HI):</strong> The elevation of the line of sight of the level instrument. It's calculated by adding the backsight reading to the known elevation of the point. <code>HI = Elevation + BS</code>.
              </li>
              <li>
                <strong>Foresight (FS):</strong> A reading on a level rod held on a point whose elevation is to be determined.
              </li>
              <li>
                <strong>Turning Point (TP):</strong> A temporary point used to move the level instrument. A foresight is taken on it, then the instrument is moved, and a backsight is taken on the same point to establish a new HI.
              </li>
              <li>
                <strong>Elevation:</strong> The vertical distance of a point above or below a reference datum (like sea level). It's calculated by subtracting the foresight reading from the Height of Instrument. <code>Elevation = HI - FS</code>.
              </li>
            </ul>

            <Accordion type="single" collapsible className="not-prose">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span>Leveling Example</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none font-mono p-4 bg-muted rounded-md">
                    <p>
                      1. Start on BM-1 with known elevation 100.00 ft.
                      <br/>
                      2. Read a Backsight (BS) of 4.58 ft on BM-1.
                      <br/>
                      <strong>HI = 100.00 + 4.58 = 104.58 ft</strong>
                    </p>
                    <p>
                      3. Move the rod to a Turning Point (TP-1).
                      <br/>
                      4. Read a Foresight (FS) of 3.45 ft on TP-1.
                      <br/>
                      <strong>Elevation of TP-1 = 104.58 - 3.45 = 101.13 ft</strong>
                    </p>
                     <p>
                      5. Move the instrument to a new location.
                      <br/>
                      6. Read a new Backsight (BS) of 6.12 ft on TP-1.
                      <br/>
                      <strong>New HI = 101.13 + 6.12 = 107.25 ft</strong>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle>Slope Distance vs. Horizontal Distance</CardTitle>
              <CardDescription>Converting between measured slope distances and the horizontal distances needed for mapping.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                When measuring on sloped ground, the distance measured along the surface is the <strong>Slope Distance (SD)</strong>. However, for mapping and calculations, we almost always need the <strong>Horizontal Distance (HD)</strong>. This is because maps are flat representations of the world. Converting SD to HD requires knowing either the vertical angle or the difference in elevation.
                </p>
                <p>
                A <strong>Zenith Angle</strong> is a vertical angle measured from the "zenith," which is the point directly above the instrument (straight up). A zenith angle of 0° is pointing straight up, 90° is perfectly horizontal, and 180° is pointing straight down.
                </p>
                <ol>
                    <li>
                        <strong>Using a Zenith Angle:</strong> This is common when using a total station. The instrument measures both the slope distance and the zenith angle. The formula is derived from simple trigonometry where the slope distance is the hypotenuse.
                        <br />
                        <code>HD = SD * sin(Zenith Angle)</code>
                    </li>
                    <li>
                        <strong>Using Elevation Difference:</strong> If you know the elevation of the two points (A and B), you can find the vertical difference in elevation (ΔElev) and use the Pythagorean theorem. The slope distance is the hypotenuse, the elevation difference is the vertical leg, and the horizontal distance is the horizontal leg of a right triangle.
                        <br />
                        <code>ΔElev = Elev_B - Elev_A</code>
                        <br />
                        <code>HD = √(SD² - ΔElev²)</code>
                    </li>
                </ol>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}

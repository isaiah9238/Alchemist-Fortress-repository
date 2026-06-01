
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

export default function AreaByCoordinatesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Area by Coordinates (Shoelace Formula)"
        description="Calculating the area of a polygon from a list of its vertices."
      />

      <Card>
        <CardHeader>
          <CardTitle>The Shoelace Formula</CardTitle>
          <CardDescription>
            One of the most efficient ways to calculate the area of a polygon directly from its coordinates is the Shoelace Formula (also known as the Surveyor's Formula).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>It works by taking the cross-product of each successive pair of coordinates.</p>
            <ol>
              <li>
                <strong>List the Coordinates:</strong> List the Northing (Y) and Easting (X) coordinates of the polygon's vertices in order, moving around the perimeter. It is crucial to repeat the first point at the end of the list to "close" the polygon.
              </li>
              <li>
                <strong>Multiply Diagonally:</strong> Sum the products of each X-coordinate multiplied by the Y-coordinate of the *next* vertex (X₁Y₂, X₂Y₃, ..., XₙY₁). Then, sum the products of each Y-coordinate multiplied by the X-coordinate of the *next* vertex (Y₁X₂, Y₂X₃, ..., YₙX₁).
              </li>
              <li>
                <strong>Calculate the Difference:</strong> Subtract the second sum from the first sum.
              </li>
              <li>
                <strong>Find the Area:</strong> The area is half of the absolute value of this difference.
                <br />
                <code>Area = 0.5 * |(X₁Y₂ + X₂Y₃ + ... + XₙY₁) - (Y₁X₂ + Y₂X₃ + ... + YₙX₁)|</code>
              </li>
            </ol>
             <Accordion type="single" collapsible className="not-prose">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span>Shoelace Formula Example</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none font-mono p-4 bg-muted rounded-md">
                    <p>
                      Consider a square with these points (Y, X):
                      <br />
                      P1: (5000, 5000)
                      <br />
                      P2: (5000, 5100)
                      <br />
                      P3: (5100, 5100)
                      <br />
                      P4: (5100, 5000)
                      <br />
                      P1: (5000, 5000) &lt;-- Repeat first point
                    </p>
                    <p>
                      Sum 1 (X₁Y₂ + ...):<br />
                      (5000 * 5000) + (5100 * 5100) + (5100 * 5000) + (5000 * 5000) = 102,010,000
                    </p>
                    <p>
                      Sum 2 (Y₁X₂ + ...):<br />
                      (5000 * 5100) + (5000 * 5100) + (5100 * 5000) + (5100 * 5000) = 102,000,000
                    </p>
                    <p>
                      Difference = 102,010,000 - 102,000,000 = 10,000
                    </p>
                     <p>
                      Area = 0.5 * |10,000| = 5,000 sq. ft.
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

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function CreatingReportsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Creating PDF Reports"
        description="A guide on how to generate and interpret the automated analysis reports from the Interactive Labs."
      />

      <Card>
        <CardHeader>
          <CardTitle>The Report Generation Process</CardTitle>
          <CardDescription>
            The "Generate PDF Report" button combines a snapshot of the graph with a dynamic analysis of the function's parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              When you click the <Button variant="outline" size="sm" className="inline-flex items-center h-auto py-1"><FileText className="mr-2 h-4 w-4" />Generate PDF Report</Button> button in a supported lab, the application performs several steps automatically:
            </p>
            <ol>
              <li><strong>Graph Snapshot:</strong> It takes a high-resolution snapshot of the current state of the main graph, including all visible functions and points.</li>
              <li><strong>Parameter Analysis:</strong> It reads the current values from the lab's sliders and inputs (e.g., the `a`, `h`, and `k` values for a parabola).</li>
              <li><strong>Mathematical Derivation:</strong> It uses these parameters to calculate and derive key properties of the function. For example, it might find a parabola's roots or a vector's magnitude.</li>
              <li><strong>PDF Assembly:</strong> It combines the graph image, the function's formula, and the derived analysis into a clean, formatted PDF document that is then downloaded to your device.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Example 1: A Simple Report (Parabola Lab)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              The <Link href="/calculators/interactive-demo" className="underline">Parabola Lab (01)</Link> is a great example of a straightforward report.
            </p>
            <ul className="list-disc pl-5">
              <li><strong>Input Parameters:</strong> The report uses the `a` (stretch), `h` (horizontal shift), and `k` (vertical shift) values you've set.</li>
              <li><strong>Analysis Includes:</strong>
                <ul className="list-['-_'] pl-5">
                  <li>The parabola's equation in both Vertex Form and Standard Form.</li>
                  <li>The coordinates of the Vertex.</li>
                  <li>The calculated roots of the equation (where the curve crosses the x-axis).</li>
                </ul>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example 2: A Complex Report (Traverse Lab)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              The <Link href="/calculators/interactive-demo" className="underline">Traverse Lab (18)</Link> is more complex, as it deals with a series of vectors rather than a single function.
            </p>
            <ul className="list-disc pl-5">
              <li><strong>Input Parameters:</strong> The report uses the starting X/Y coordinate and the list of all leg bearings and distances.</li>
              <li><strong>Analysis Includes:</strong>
                <ul className="list-['-_'] pl-5">
                    <li>A simple list of the inputs for documentation.</li>
                    <li>Because the analysis is primarily visual, the graph snapshot is the main component. A North Arrow is automatically added to the graph in the PDF to provide orientation for the traverse plot.</li>
                </ul>
              </li>
            </ul>
            <p>This demonstrates how the reporting tool can adapt to different kinds of mathematical and survey-based data.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

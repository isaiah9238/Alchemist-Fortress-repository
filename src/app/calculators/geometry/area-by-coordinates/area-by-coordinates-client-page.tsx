
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { LineChart } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Unit = 'ft-us' | 'ft' | 'm';

type AreaResult = {
  area: number;
  largeArea: number; // Will be Acres or Hectares
  largeAreaUnit: 'Acres' | 'Hectares';
  pointCount: number;
};

type Point = {
  y: number; // Northing
  x: number; // Easting
};

export default function AreaByCoordinatesClientPage() {
  const { toast } = useToast();
  const [pointData, setPointData] = useState('5000,5000\n5100,5000\n5100,5100\n5000,5100');
  const [result, setResult] = useState<AreaResult | null>(null);
  const [units, setUnits] = useState<Unit>('ft-us');

  const getSelectedUnitLabel = () => {
    switch (units) {
      case 'ft-us':
        return 'U.S. Survey Feet';
      case 'ft':
        return 'Intl. Feet';
      case 'm':
        return 'Meters';
    }
  };
  
   const getSelectedAreaUnitLabel = () => {
    switch (units) {
      case 'ft-us':
      case 'ft':
        return 'Square Feet';
      case 'm':
        return 'Square Meters';
    }
  };

  const calculateArea = () => {
    const lines = pointData.trim().split(/\r?\n/);
    if (lines.length < 3) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter at least 3 points to form a polygon.',
      });
      return;
    }

    try {
      const points: Point[] = lines.map((line, index) => {
        const parts = line.split(/[,\s]+/).filter(Boolean);
        if (parts.length < 2) throw new Error(`Invalid format on line ${index + 1}`);
        const y = parseFloat(parts[0]);
        const x = parseFloat(parts[1]);
        if (isNaN(x) || isNaN(y)) throw new Error(`Invalid number on line ${index + 1}`);
        return { y, x };
      });
      
      const originalPointsCount = points.length;
      
      // Close the polygon if it's not already
      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];
      if (firstPoint.x !== lastPoint.x || firstPoint.y !== lastPoint.y) {
          points.push(firstPoint);
      }

      // Shoelace Formula
      let area = 0;
      for (let i = 0; i < points.length - 1; i++) {
        area += points[i].x * points[i + 1].y - points[i + 1].x * points[i].y;
      }
      
      const finalArea = Math.abs(area / 2.0);
      
      let largeArea: number;
      let largeAreaUnit: 'Acres' | 'Hectares';

      if (units === 'm') {
          // 1 Hectare = 10,000 square meters
          largeArea = finalArea / 10000;
          largeAreaUnit = 'Hectares';
      } else {
          // All foot-based units will be converted to acres
          let areaInSqFt = finalArea;
          if (units === 'ft') { // Intl. Feet to US Survey Feet for Acre calculation
              const intlToUsSurvey = 0.999998;
              areaInSqFt = finalArea * (intlToUsSurvey * intlToUsSurvey);
          }
          // 1 Acre = 43560 sq ft
          largeArea = areaInSqFt / 43560;
          largeAreaUnit = 'Acres';
      }

      setResult({
        area: finalArea,
        largeArea,
        largeAreaUnit,
        pointCount: originalPointsCount,
      });

      // Save points to local storage for plotting
      try {
        localStorage.setItem('lastLoopPlotData', JSON.stringify(points));
      } catch (error) {
        console.error("Could not save to localStorage", error);
        toast({
            variant: "destructive",
            title: "Browser Error",
            description: "Could not save plot data to browser storage.",
        });
      }


    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: e.message || 'Please check the format of your coordinate data.',
      });
      setResult(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Coordinate Input</CardTitle>
          <CardDescription>
            Enter the coordinates (Northing, Easting or Y, X) for each point of the polygon, one point per line.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="units">Coordinate & Distance Units</Label>
              <Select value={units} onValueChange={(value: Unit) => {setUnits(value); setResult(null);}}>
                <SelectTrigger id="units">
                  <SelectValue placeholder="Select units..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ft-us">U.S. Survey Feet</SelectItem>
                  <SelectItem value="ft">International Feet</SelectItem>
                  <SelectItem value="m">Meters</SelectItem>
                </SelectContent>
              </Select>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Points (N,E or Y X) in {getSelectedUnitLabel()}</Label>
            <Textarea
              placeholder="e.g.&#10;5000,5000&#10;5100,5000&#10;5100,5100&#10;5000,5100"
              id="message"
              value={pointData}
              onChange={(e) => setPointData(e.target.value)}
              rows={10}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculateArea}>Calculate Area</Button>
        </CardFooter>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Calculated Area</CardTitle>
          <CardDescription>
            The resulting area of the defined polygon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Number of Points:</span>
                <span className="font-mono">{result.pointCount}</span>
              </div>
              <Separator />
               <div className="flex justify-between text-lg font-bold text-primary">
                <span className="text-foreground">Area ({getSelectedAreaUnitLabel()}):</span>
                <span className="font-mono">{result.area.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
               <Separator />
               <div className="flex justify-between text-lg font-bold text-primary">
                <span className="text-foreground">Area ({result.largeAreaUnit}):</span>
                <span className="font-mono">{result.largeArea.toFixed(5)}</span>
              </div>
              <Separator />
              <Button asChild variant="outline" className="w-full">
                <Link href="/calculators/geometry/plot">
                  <LineChart className="mr-2 h-4 w-4" />
                  View Plot
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Click "Calculate" to see the results.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { useState } from 'react';
import type { Point } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Unit = 'ft-us' | 'ft' | 'm';

type OffsetResult = {
  offsetDistance: number;
  stationDistance: number;
  offsetDirection: 'Left' | 'Right' | 'On Line';
  projectionPoint: Point;
};

export default function PointOffsetClientPage() {
  const { toast } = useToast();
  const [units, setUnits] = useState<Unit>('ft-us');
  
  // Line definition
  const [pointA, setPointA] = useState<Point>({ y: 5000, x: 5000 });
  const [pointB, setPointB] = useState<Point>({ y: 6000, x: 5000 });

  // Point to offset
  const [pointP, setPointP] = useState<Point>({ y: 5500, x: 5100 });
  
  const [result, setResult] = useState<OffsetResult | null>(null);

  const handlePointChange = (setter: React.Dispatch<React.SetStateAction<Point>>, axis: 'x' | 'y', value: string) => {
    setter(prev => ({ ...prev, [axis]: parseFloat(value) || 0 }));
    setResult(null);
  };
  
  const getSelectedUnitLabel = () => {
    switch (units) {
      case 'ft-us': return 'U.S. Survey Feet';
      case 'ft': return 'Intl. Feet';
      case 'm': return 'Meters';
    }
  };

  const calculate = () => {
    try {
      const { x: ax, y: ay } = pointA;
      const { x: bx, y: by } = pointB;
      const { x: px, y: py } = pointP;

      const dx = bx - ax;
      const dy = by - ay;

      if (dx === 0 && dy === 0) {
        throw new Error("Line start and end points cannot be identical.");
      }

      const lenSq = dx * dx + dy * dy;
      const t = ((px - ax) * dx + (py - ay) * dy) / lenSq;

      const qx = ax + t * dx;
      const qy = ay + t * dy;
      
      const projectionPoint: Point = { x: qx, y: qy };

      const offsetDistance = Math.sqrt(Math.pow(px - qx, 2) + Math.pow(py - qy, 2));
      const stationDistance = Math.sqrt(Math.pow(qx - ax, 2) + Math.pow(qy - ay, 2));

      const crossProduct = dx * (py - ay) - dy * (px - ax);
      let offsetDirection: 'Left' | 'Right' | 'On Line';
      if (Math.abs(crossProduct) < 1e-9) {
          offsetDirection = 'On Line';
      } else if (crossProduct > 0) {
          offsetDirection = 'Right';
      } else {
          offsetDirection = 'Left';
      }
      
      setResult({
        offsetDistance,
        stationDistance,
        offsetDirection,
        projectionPoint
      });

    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Calculation Error',
        description: e.message,
      });
      setResult(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Offset Inputs</CardTitle>
          <CardDescription>Define the line and the point to calculate the offset from.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Units</Label>
            <Select value={units} onValueChange={(v: Unit) => setUnits(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ft-us">U.S. Survey Feet</SelectItem>
                <SelectItem value="ft">International Feet</SelectItem>
                <SelectItem value="m">Meters</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-semibold">Baseline</h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label>Point A (Start)</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input type="number" value={pointA.y} onChange={e => handlePointChange(setPointA, 'y', e.target.value)} placeholder="Northing"/>
                        <Input type="number" value={pointA.x} onChange={e => handlePointChange(setPointA, 'x', e.target.value)} placeholder="Easting"/>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Point B (End)</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input type="number" value={pointB.y} onChange={e => handlePointChange(setPointB, 'y', e.target.value)} placeholder="Northing"/>
                        <Input type="number" value={pointB.x} onChange={e => handlePointChange(setPointB, 'x', e.target.value)} placeholder="Easting"/>
                    </div>
                </div>
            </div>
          </div>
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-semibold">Point to Offset</h3>
            <div className="space-y-2">
                <Label>Point P</Label>
                <div className="grid grid-cols-2 gap-2">
                    <Input type="number" value={pointP.y} onChange={e => handlePointChange(setPointP, 'y', e.target.value)} placeholder="Northing"/>
                    <Input type="number" value={pointP.x} onChange={e => handlePointChange(setPointP, 'x', e.target.value)} placeholder="Easting"/>
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculate}>Calculate Offset</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Offset Results</CardTitle>
          <CardDescription>
            The calculated station and offset from the baseline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-3">
              <div className="flex justify-between text-lg font-bold text-primary">
                <span className="text-foreground">Perpendicular Offset:</span>
                <span className="font-mono">{result.offsetDistance.toFixed(4)} ({result.offsetDirection})</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distance Along Line (Station):</span>
                <span className="font-mono">{result.stationDistance.toFixed(4)}</span>
              </div>
              <Separator />
               <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Projected Point on Line</h4>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Northing (Y):</span>
                        <span className="font-mono">{result.projectionPoint.y.toFixed(4)}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Easting (X):</span>
                        <span className="font-mono">{result.projectionPoint.x.toFixed(4)}</span>
                    </div>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              <p>Results will be displayed here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

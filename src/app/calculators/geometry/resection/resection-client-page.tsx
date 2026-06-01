
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { AzimuthInput, type AzimuthPayload, dmsToDD } from '@/components/azimuth-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Point } from '@/lib/types';

type Unit = 'ft-us' | 'ft' | 'm';

export default function ResectionClientPage() {
  const { toast } = useToast();

  // Inputs
  const [p1, setP1] = useState<Point>({ name: 'P1', y: 6427.23, x: 7425.33 });
  const [p2, setP2] = useState<Point>({ name: 'P2', y: 6978.45, x: 9345.81 });
  const [p3, setP3] = useState<Point>({ name: 'P3', y: 5333.91, x: 9600.12 });
  const [angle12, setAngle12] = useState<AzimuthPayload>({ mode: 'DMS', dd: '85', dms: { d: '85', m: '10', s: '25' }, quad: {ns: 'N', ew: 'E', d: '', m: '', s: ''} });
  const [angle23, setAngle23] = useState<AzimuthPayload>({ mode: 'DMS', dd: '62', dms: { d: '62', m: '30', s: '40' }, quad: {ns: 'N', ew: 'E', d: '', m: '', s: ''} });
  
  const [units, setUnits] = useState<Unit>('ft-us');
  const [result, setResult] = useState<Point | null>(null);
  
  const handlePointChange = (setter: React.Dispatch<React.SetStateAction<Point>>, axis: 'y' | 'x', value: string) => {
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
  
  const inverse = (pA: Point, pB: Point) => {
      const deltaY = pB.y - pA.y;
      const deltaX = pB.x - pA.x;
      const distance = Math.sqrt(deltaX**2 + deltaY**2);
      return { distance };
  }

  const calculateResection = () => {
    try {
      const points = [p1, p2, p3];
      for (const p of points) {
        if (isNaN(p.x) || isNaN(p.y)) throw new Error('All coordinate values must be valid numbers.');
      }
      
      const alpha12_deg = dmsToDD(parseInt(angle12.dms.d), parseInt(angle12.dms.m), parseFloat(angle12.dms.s));
      const alpha23_deg = dmsToDD(parseInt(angle23.dms.d), parseInt(angle23.dms.m), parseFloat(angle23.dms.s));
      
      if (isNaN(alpha12_deg) || isNaN(alpha23_deg) || alpha12_deg <= 0 || alpha23_deg <= 0 || alpha12_deg >= 180 || alpha23_deg >= 180) {
        throw new Error('Measured angles must be positive and less than 180 degrees.');
      }

      // Convert angles measured at unknown point to radians
      const alpha12 = alpha12_deg * Math.PI / 180;
      const alpha23 = alpha23_deg * Math.PI / 180;
      const alpha31 = 2 * Math.PI - alpha12 - alpha23;
      if(alpha31 <= 0) throw new Error('Sum of measured angles cannot exceed 360 degrees.');

      // Inverse to get side lengths of known triangle
      const d12 = inverse(p1, p2).distance;
      const d23 = inverse(p2, p3).distance;
      const d31 = inverse(p3, p1).distance;
      if (d12 === 0 || d23 === 0 || d31 === 0) throw new Error("Known points cannot be identical.");

      // Use Law of Cosines to find interior angles of known triangle
      const A1_rad = Math.acos((d12**2 + d31**2 - d23**2) / (2 * d12 * d31));
      const A2_rad = Math.acos((d12**2 + d23**2 - d31**2) / (2 * d12 * d23));
      const A3_rad = Math.acos((d23**2 + d31**2 - d12**2) / (2 * d23 * d31));

      // Tienstra's Method
      // Cotangents of measured angles (α) and known angles (A)
      const cot_alpha1 = 1 / Math.tan(alpha23); // Corresponds to A1
      const cot_alpha2 = 1 / Math.tan(alpha31); // Corresponds to A2
      const cot_alpha3 = 1 / Math.tan(alpha12); // Corresponds to A3
      
      const cot_A1 = 1 / Math.tan(A1_rad);
      const cot_A2 = 1 / Math.tan(A2_rad);
      const cot_A3 = 1 / Math.tan(A3_rad);
      
      // Check for danger circle condition
      if (Math.abs(cot_A1 - cot_alpha1) < 1e-9 || Math.abs(cot_A2 - cot_alpha2) < 1e-9 || Math.abs(cot_A3 - cot_alpha3) < 1e-9) {
          throw new Error('Danger Circle: The unknown point lies on or very near the circle passing through the three known points. A unique solution is not possible.');
      }
      
      // Weights
      const w1 = 1 / (cot_A1 - cot_alpha1);
      const w2 = 1 / (cot_A2 - cot_alpha2);
      const w3 = 1 / (cot_A3 - cot_alpha3);
      
      const w_sum = w1 + w2 + w3;
      if (Math.abs(w_sum) < 1e-9) throw new Error("Indeterminate solution. Check geometry.");
      
      // Weighted average for unknown coordinates
      const Px = (w1 * p1.x + w2 * p2.x + w3 * p3.x) / w_sum;
      const Py = (w1 * p1.y + w2 * p2.y + w3 * p3.y) / w_sum;

      setResult({ name: 'Instrument', x: Px, y: Py });

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
          <CardTitle>Known Points & Angles</CardTitle>
          <CardDescription>Enter the coordinates of three known points and the angles measured between them from your unknown location.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Units</Label>
                <Select value={units} onValueChange={(v: Unit) => setUnits(v)}>
                    <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ft-us">U.S. Survey Feet</SelectItem>
                        <SelectItem value="ft">International Feet</SelectItem>
                        <SelectItem value="m">Meters</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-semibold">Point 1 (Left Point)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Northing (Y)</Label><Input type="number" value={p1.y} onChange={e => handlePointChange(setP1, 'y', e.target.value)} /></div>
                    <div><Label>Easting (X)</Label><Input type="number" value={p1.x} onChange={e => handlePointChange(setP1, 'x', e.target.value)} /></div>
                </div>
            </div>
            <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-semibold">Point 2 (Middle Point)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Northing (Y)</Label><Input type="number" value={p2.y} onChange={e => handlePointChange(setP2, 'y', e.target.value)} /></div>
                    <div><Label>Easting (X)</Label><Input type="number" value={p2.x} onChange={e => handlePointChange(setP2, 'x', e.target.value)} /></div>
                </div>
            </div>
            <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-semibold">Point 3 (Right Point)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Northing (Y)</Label><Input type="number" value={p3.y} onChange={e => handlePointChange(setP3, 'y', e.target.value)} /></div>
                    <div><Label>Easting (X)</Label><Input type="number" value={p3.x} onChange={e => handlePointChange(setP3, 'x', e.target.value)} /></div>
                </div>
            </div>
             <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-semibold">Measured Angles</h3>
                <div className="space-y-2">
                    <Label>Angle: Point 1 to Point 2</Label>
                    <AzimuthInput value={angle12} onChange={setAngle12}/>
                </div>
                <div className="space-y-2">
                    <Label>Angle: Point 2 to Point 3</Label>
                    <AzimuthInput value={angle23} onChange={setAngle23}/>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={calculateResection}>Calculate Position</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Calculated Position</CardTitle>
          <CardDescription>The coordinates of your unknown instrument location.</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Northing (Y):</span>
                <span className="font-mono text-lg font-bold text-primary">{result.y.toFixed(4)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Easting (X):</span>
                <span className="font-mono text-lg font-bold text-primary">{result.x.toFixed(4)}</span>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              <p>Enter points and angles to calculate your position.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

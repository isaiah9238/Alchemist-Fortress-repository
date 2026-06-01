
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

type Unit = 'ft-us' | 'ft' | 'm';

type CurveResult = {
  pviStation: string;
  pviElevation: number;
  pvtStation: string;
  pvtElevation: number;
  rateOfChange: number;
  highLowType: 'High' | 'Low' | 'N/A';
  highLowStation?: string;
  highLowElevation?: number;
};

export default function VerticalCurveClientPage() {
  const { toast } = useToast();

  // Input states
  const [initialGrade, setInitialGrade] = useState('-3.0');
  const [finalGrade, setFinalGrade] = useState('2.0');
  const [curveLength, setCurveLength] = useState('600');
  const [pvcStation, setPvcStation] = useState('10+00');
  const [pvcElevation, setPvcElevation] = useState('500');

  const [units, setUnits] = useState<Unit>('ft-us');
  const [result, setResult] = useState<CurveResult | null>(null);

  const getSelectedUnitLabel = () => {
    switch (units) {
      case 'ft-us': return 'U.S. Survey Feet';
      case 'ft': return 'Intl. Feet';
      case 'm': return 'Meters';
    }
  };
  
  const stationToNumber = (station: string): number => {
      const parts = station.split('+');
      if (parts.length > 2) throw new Error(`Invalid station format: ${station}`);
      const major = parseFloat(parts[0]) * 100;
      const minor = parts.length === 2 ? parseFloat(parts[1]) : 0;
      if (isNaN(major) || isNaN(minor)) throw new Error(`Invalid number in station: ${station}`);
      return major + minor;
  }
  
  const numberToStation = (num: number): string => {
      const major = Math.floor(num / 100);
      const minor = (num % 100).toFixed(2);
      return `${major}+${minor.padStart(5, '0')}`;
  }


  const calculateCurve = () => {
    try {
      const g1 = parseFloat(initialGrade) / 100;
      const g2 = parseFloat(finalGrade) / 100;
      const L = parseFloat(curveLength);
      const pvcStaNum = stationToNumber(pvcStation);
      const pvcElevNum = parseFloat(pvcElevation);

      if (isNaN(g1) || isNaN(g2) || isNaN(L) || L <= 0 || isNaN(pvcStaNum) || isNaN(pvcElevNum)) {
        throw new Error('Please check all inputs for valid, positive numbers. Length must be greater than zero.');
      }

      // Rate of change of grade
      const r = (g2 - g1) / L;

      // PVI (Point of Vertical Intersection)
      const pviStaNum = pvcStaNum + L / 2;
      const pviElevNum = pvcElevNum + g1 * (L / 2);
      
      // PVT (Point of Vertical Tangency)
      const pvtStaNum = pvcStaNum + L;
      const pvtElevNum = pvcElevNum + g1 * L + (r / 2) * L * L;

      let highLowType: 'High' | 'Low' | 'N/A' = 'N/A';
      let highLowStation: string | undefined = undefined;
      let highLowElevation: number | undefined = undefined;
      
      // Check if high/low point is within the curve
      if (g1 * g2 < 0) { // Grades have opposite signs, so a high/low point exists
        const x = -g1 / r; // Distance from PVC to high/low point
        if (x > 0 && x < L) {
            highLowType = g1 > 0 ? 'High' : 'Low';
            const highLowStaNum = pvcStaNum + x;
            highLowStation = numberToStation(highLowStaNum);
            highLowElevation = pvcElevNum + g1 * x + (r/2) * x*x;
        }
      }

      setResult({
        pviStation: numberToStation(pviStaNum),
        pviElevation: pviElevNum,
        pvtStation: numberToStation(pvtStaNum),
        pvtElevation: pvtElevNum,
        rateOfChange: r * 100, // as a percentage per station/foot
        highLowType,
        highLowStation,
        highLowElevation
      });

    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Calculation Error',
        description: e.message || 'Please check your inputs.',
      });
      setResult(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Symmetrical Vertical Curve</CardTitle>
          <CardDescription>
            Input the initial parameters for a symmetrical parabolic curve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
              <Label htmlFor="units">Units</Label>
              <Select value={units} onValueChange={(v: Unit) => { setUnits(v); setResult(null); }}>
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
          <Separator/>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
             <div className="space-y-2">
              <Label htmlFor="initial-grade">Initial Grade (G1) in %</Label>
              <Input id="initial-grade" type="number" value={initialGrade} onChange={(e) => setInitialGrade(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="final-grade">Final Grade (G2) in %</Label>
              <Input id="final-grade" type="number" value={finalGrade} onChange={(e) => setFinalGrade(e.target.value)} />
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="length">Length of Curve (L) in {getSelectedUnitLabel()}</Label>
              <Input id="length" type="number" value={curveLength} onChange={(e) => setCurveLength(e.target.value)} />
            </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
             <div className="space-y-2">
              <Label htmlFor="pvc-station">PVC Station</Label>
              <Input id="pvc-station" type="text" value={pvcStation} onChange={(e) => setPvcStation(e.target.value)} placeholder="e.g. 10+00" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="pvc-elevation">PVC Elevation</Label>
              <Input id="pvc-elevation" type="number" value={pvcElevation} onChange={(e) => setPvcElevation(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculateCurve}>Calculate Curve</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Calculated Curve Elements</CardTitle>
          <CardDescription>
            The resulting geometric properties of the vertical curve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate of Change (r):</span>
                <span className="font-mono text-primary font-bold">{result.rateOfChange.toFixed(4)}% per {units === 'm' ? 'meter' : 'foot'}</span>
              </div>
              <Separator />
               <div className="flex justify-between">
                <span className="text-muted-foreground">PVI Station:</span>
                <span className="font-mono text-primary font-bold">{result.pviStation}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">PVI Elevation:</span>
                <span className="font-mono text-primary font-bold">{result.pviElevation.toFixed(4)}</span>
              </div>
              <Separator />
               <div className="flex justify-between">
                <span className="text-muted-foreground">PVT Station:</span>
                <span className="font-mono text-primary font-bold">{result.pvtStation}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">PVT Elevation:</span>
                <span className="font-mono text-primary font-bold">{result.pvtElevation.toFixed(4)}</span>
              </div>
              <Separator />
               <div className="flex justify-between">
                <span className="text-muted-foreground">{result.highLowType} Point Station:</span>
                <span className="font-mono text-primary font-bold">{result.highLowStation ?? 'N/A'}</span>
              </div>
               <Separator />
               <div className="flex justify-between">
                <span className="text-muted-foreground">{result.highLowType} Point Elevation:</span>
                <span className="font-mono text-primary font-bold">{result.highLowElevation?.toFixed(4) ?? 'N/A'}</span>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Enter values and click "Calculate" to see the results.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

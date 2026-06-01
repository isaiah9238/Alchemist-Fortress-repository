
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


type UnitSystem = 'imperial' | 'metric'; // Imperial (acres, in/hr, cfs), Metric (hectares, mm/hr, cms)

const runoffCoefficients = [
    { name: 'Lawns, sandy soil, flat, 2%', value: 0.05 },
    { name: 'Lawns, sandy soil, average, 2-7%', value: 0.10 },
    { name: 'Lawns, sandy soil, steep, 7%+', value: 0.15 },
    { name: 'Lawns, heavy soil, flat, 2%', value: 0.13 },
    { name: 'Lawns, heavy soil, average, 2-7%', value: 0.18 },
    { name: 'Lawns, heavy soil, steep, 7%+', value: 0.25 },
    { name: 'Asphalt or Concrete Pavement', value: 0.95 },
    { name: 'Roofs', value: 0.95 },
    { name: 'Gravel Roads/Shoulders', value: 0.85 },
];


export default function RationalMethodClientPage() {
  const { toast } = useToast();
  
  // Inputs
  const [runoffC, setRunoffC] = useState('0.95');
  const [rainfallIntensity, setRainfallIntensity] = useState('5.0');
  const [area, setArea] = useState('2.0');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  
  const [result, setResult] = useState<number | null>(null);

  const getLabels = () => {
    if (unitSystem === 'imperial') {
      return {
        areaLabel: 'Acres',
        intensityLabel: 'in/hr',
        resultLabel: 'cfs (ft³/s)',
      };
    } else {
      return {
        areaLabel: 'Hectares',
        intensityLabel: 'mm/hr',
        resultLabel: 'cms (m³/s)',
      };
    }
  };


  const calculate = () => {
    try {
      const C = parseFloat(runoffC);
      const i = parseFloat(rainfallIntensity);
      const A = parseFloat(area);

      if (isNaN(C) || isNaN(i) || isNaN(A) || C < 0 || i < 0 || A < 0) {
        throw new Error('Please enter valid, positive numbers for all inputs.');
      }

      let Q = 0;
      if (unitSystem === 'imperial') {
        // Q = C * i * A
        // C is dimensionless, i is in/hr, A is acres
        // 1 acre-in/hr is approx 1.008 cfs, so we use a factor of 1.
        Q = C * i * A;
      } else {
        // Q (m³/s) = C * i (mm/hr) * A (ha) / 360
        Q = (C * i * A) / 360;
      }

      setResult(Q);

    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Calculation Error',
        description: e.message || 'An error occurred.',
      });
      setResult(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Rational Method Inputs</CardTitle>
          <CardDescription>Q = C * i * A</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Unit System</Label>
            <Select value={unitSystem} onValueChange={(v: UnitSystem) => { setUnitSystem(v); setResult(null); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">Imperial (acres, in/hr)</SelectItem>
                <SelectItem value="metric">Metric (hectares, mm/hr)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Runoff Coefficient (C)</Label>
            <Select value={runoffC} onValueChange={setRunoffC}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {runoffCoefficients.map(c => (
                        <SelectItem key={c.name} value={String(c.value)}>
                            {c.name} ({c.value})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Dimensionless coefficient based on surface type.</p>
          </div>
          <div className="space-y-2">
            <Label>Rainfall Intensity (i) in {getLabels().intensityLabel}</Label>
            <Input type="number" value={rainfallIntensity} onChange={e => setRainfallIntensity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Drainage Area (A) in {getLabels().areaLabel}</Label>
            <Input type="number" value={area} onChange={e => setArea(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculate}>Calculate Runoff</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Peak Discharge (Q)</CardTitle>
          <CardDescription>
            The calculated peak storm water runoff rate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result !== null ? (
             <div className="space-y-3">
              <div className="flex justify-between text-lg font-bold text-primary">
                <span className="text-foreground">Peak Discharge:</span>
                <span className="font-mono">{result.toFixed(3)} {getLabels().resultLabel}</span>
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

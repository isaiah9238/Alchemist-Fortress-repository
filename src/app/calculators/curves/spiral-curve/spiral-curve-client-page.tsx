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
import { AzimuthInput, type AzimuthPayload, dmsToDD } from '@/components/azimuth-input';
import { calculateSpiral, type SpiralElements } from '@/lib/spiralMath';
import { SpiralResultsTable } from '@/components/spiral-results-table';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


type Unit = 'ft-us' | 'ft' | 'm';


export default function SpiralCurveClientPage() {
  const { toast } = useToast();
  
  // Inputs
  const [piStation, setPiStation] = useState('50+00');
  const [delta, setDelta] = useState<AzimuthPayload>({ mode: 'DMS', dd: '60', dms: { d: '60', m: '00', s: '00' }, quad: {ns: 'N', ew: 'E', d: '', m:'', s:''} });
  const [radius, setRadius] = useState('1000');
  const [spiralLength, setSpiralLength] = useState('200');
  const [units, setUnits] = useState<Unit>('ft-us');
  
  const [result, setResult] = useState<SpiralElements | null>(null);

  const getSelectedUnitLabel = () => {
    switch (units) {
      case 'ft-us': return 'U.S. Survey Feet';
      case 'ft': return 'Intl. Feet';
      case 'm': return 'Meters';
    }
  };
  
  const parseAngle = (payload: AzimuthPayload): number => {
    let dd: number;
    switch (payload.mode) {
        case 'DD': dd = parseFloat(payload.dd); break;
        case 'DMS': dd = dmsToDD(parseInt(payload.dms.d), parseInt(payload.dms.m), parseFloat(payload.dms.s)); break;
        default: throw new Error('Invalid angle mode.');
    }
    if (isNaN(dd)) throw new Error('Invalid angle input.');
    return dd;
  };


  const calculate = () => {
    try {
      const R = parseFloat(radius);
      const Ls = parseFloat(spiralLength);
      const totalDelta = parseAngle(delta);

      if (isNaN(R) || R <= 0) throw new Error("Radius must be a positive number.");
      if (isNaN(Ls) || Ls <= 0) throw new Error("Spiral Length must be a positive number.");
      if (isNaN(totalDelta) || totalDelta <= 0) throw new Error("Total Delta must be a positive angle.");

      const spiralElements = calculateSpiral(R, Ls, totalDelta);

      // Validation after calculation
      if ( (2 * spiralElements.thetaS_deg) > totalDelta) {
          throw new Error(`The spirals are too long for the given total delta. The total spiral angle (2 * ${spiralElements.thetaS_deg.toFixed(2)}°) cannot exceed the total delta (${totalDelta.toFixed(2)}°).`);
      }

      setResult(spiralElements);

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
          <CardTitle>Spiral Curve Inputs</CardTitle>
          <CardDescription>
            Enter the five essential inputs to calculate a symmetrical spiral curve.
          </CardDescription>
           <Button asChild variant="link" className="w-fit p-0 h-auto">
            <Link href="/calculators/curves/spiral-curve/diagram">
              <HelpCircle className="mr-2 h-4 w-4" />
              See Reference Diagram
            </Link>
          </Button>
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
          <div className="space-y-2">
              <Label>PI Station</Label>
              <Input value={piStation} onChange={e => setPiStation(e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label>Total Delta (&Delta;)</Label>
              <AzimuthInput value={delta} onChange={setDelta} />
          </div>
          <div className="space-y-2">
              <Label>Circular Curve Radius (R<sub>c</sub>)</Label>
              <Input type="number" value={radius} onChange={e => setRadius(e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label>Length of Spiral (L<sub>s</sub>)</Label>
              <Input type="number" value={spiralLength} onChange={e => setSpiralLength(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculate}>Calculate Spiral</Button>
        </CardFooter>
      </Card>
      
      {result ? (
        <SpiralResultsTable data={result} unit={units.startsWith('ft') ? 'ft' : 'm'} />
      ) : (
        <Card>
            <CardHeader>
                <CardTitle>Calculated Elements</CardTitle>
                <CardDescription>Results will be displayed here.</CardDescription>
            </CardHeader>
            <CardContent className="flex h-full items-center justify-center text-muted-foreground">
                <p>Enter values and click "Calculate" to see the results.</p>
            </CardContent>
        </Card>
      )}

    </div>
  );
}

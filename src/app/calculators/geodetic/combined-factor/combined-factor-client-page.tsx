
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

type Unit = 'ft' | 'm';

export default function CombinedFactorClientPage() {
  const { toast } = useToast();
  
  // Inputs
  const [elevation, setElevation] = useState('1000');
  const [scaleFactor, setScaleFactor] = useState('0.9999');
  const [units, setUnits] = useState<Unit>('ft');
  
  const [result, setResult] = useState<{
    elevationFactor: number;
    combinedFactor: number;
  } | null>(null);

  const EARTH_RADIUS_FT = 20906000;
  const EARTH_RADIUS_M = 6371000;

  const calculate = () => {
    try {
      const elev = parseFloat(elevation);
      const k = parseFloat(scaleFactor);
      const R = units === 'ft' ? EARTH_RADIUS_FT : EARTH_RADIUS_M;

      if (isNaN(elev) || isNaN(k) || k <= 0) {
        throw new Error('Please enter valid numerical values. Scale factor must be positive.');
      }

      // Elevation Factor (Sea Level Factor) = R / (R + H)
      const ef = R / (R + elev);
      
      // Combined Factor = Scale Factor * Elevation Factor
      const cf = k * ef;

      setResult({
        elevationFactor: ef,
        combinedFactor: cf
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
          <CardTitle>Geodetic Parameters</CardTitle>
          <CardDescription>Enter the scale factor and elevation to derive the combined factor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Project Units</Label>
            <Select value={units} onValueChange={(v: Unit) => setUnits(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ft">Feet</SelectItem>
                <SelectItem value="m">Meters</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scale-factor">Grid Scale Factor (k)</Label>
            <Input id="scale-factor" type="number" step="any" value={scaleFactor} onChange={e => setScaleFactor(e.target.value)} />
            <p className="text-xs text-muted-foreground">Derived from your SPCS zone at the project location.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="elevation">Ellipsoidal Elevation ({units})</Label>
            <Input id="elevation" type="number" step="any" value={elevation} onChange={e => setElevation(e.target.value)} />
            <p className="text-xs text-muted-foreground">Mean elevation of the project area above the ellipsoid.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculate} className="w-full">Calculate Combined Factor</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Factor Results</CardTitle>
          <CardDescription>Apply the combined factor to ground distances to get grid distances.</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Elevation Factor:</span>
                <span className="font-mono font-bold">{result.elevationFactor.toFixed(8)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-black text-primary">
                <span className="text-foreground uppercase tracking-tighter">Combined Factor (CF):</span>
                <span className="font-mono">{result.combinedFactor.toFixed(8)}</span>
              </div>
              <Separator />
              <div className="bg-muted p-4 rounded-md text-xs space-y-2">
                <p className="font-bold uppercase tracking-widest text-primary">Usage Guide:</p>
                <p>Grid Dist = Ground Dist × CF</p>
                <p>Ground Dist = Grid Dist / CF</p>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              <p>Execute calculation to view geodetic factors.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

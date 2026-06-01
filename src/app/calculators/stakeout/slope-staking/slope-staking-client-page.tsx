
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

type Result = {
  catchPointOffset: number;
  catchPointElevation: number;
  cutOrFill: 'Cut' | 'Fill';
  verticalDifference: number;
};

export default function SlopeStakingClientPage() {
  const { toast } = useToast();

  // Inputs
  const [designElevation, setDesignElevation] = useState('100.0');
  const [groundElevation, setGroundElevation] = useState('102.5');
  const [offset, setOffset] = useState('25.0'); // Hinge point offset
  const [cutSlope, setCutSlope] = useState('2'); // e.g., 2:1
  const [fillSlope, setFillSlope] = useState('2'); // e.g., 2:1

  const [units, setUnits] = useState<Unit>('ft-us');
  const [result, setResult] = useState<Result | null>(null);

  const getSelectedUnitLabel = () => {
    switch (units) {
      case 'ft-us': return 'U.S. Survey Feet';
      case 'ft': return 'Intl. Feet';
      case 'm': return 'Meters';
    }
  };
  
  const calculate = () => {
    try {
        const h = parseFloat(designElevation); // Hinge Point Elevation
        const G = parseFloat(groundElevation);
        const D = parseFloat(offset); // Hinge Point Distance from Centerline
        const S_cut = parseFloat(cutSlope);
        const S_fill = parseFloat(fillSlope);

        if (isNaN(h) || isNaN(G) || isNaN(D) || isNaN(S_cut) || isNaN(S_fill) || S_cut <= 0 || S_fill <= 0 || D < 0) {
            throw new Error('Please check all inputs. Slopes and distances must be positive.');
        }

        const verticalDifference = G - h;
        let catchPointOffset, catchPointElevation, cutOrFill: 'Cut' | 'Fill';
        
        if (verticalDifference > 0) { // Cut situation
            cutOrFill = 'Cut';
            // Formula: x = (D*S_cut + G - h) / S_cut
            catchPointOffset = (D * S_cut + verticalDifference) / S_cut; // Simplified version, assumes constant ground slope of 0
            catchPointElevation = G; // For this simple model, catch point is at ground elevation
        } else { // Fill situation
            cutOrFill = 'Fill';
            // Formula: x = (D*S_fill - (G - h)) / S_fill
            catchPointOffset = (D * S_fill - verticalDifference) / S_fill;
            catchPointElevation = G;
        }

        if (catchPointOffset < D) {
            throw new Error('Calculation resulted in a catch point inside the hinge point. Check ground elevation and slope ratios.')
        }

        setResult({
            catchPointOffset,
            catchPointElevation,
            cutOrFill,
            verticalDifference: Math.abs(verticalDifference)
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Slope Staking</CardTitle>
          <CardDescription>
            Calculate the catch point for one side of a roadway. This simplified model assumes a level ground profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="units">Units</Label>
            <Select value={units} onValueChange={(v: Unit) => { setUnits(v); setResult(null); }}>
              <SelectTrigger id="units"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ft-us">U.S. Survey Feet</SelectItem>
                <SelectItem value="ft">International Feet</SelectItem>
                <SelectItem value="m">Meters</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="design-elev">Hinge Point Elevation</Label>
              <Input id="design-elev" type="number" value={designElevation} onChange={e => setDesignElevation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hinge-offset">Hinge Point Offset</Label>
              <Input id="hinge-offset" type="number" value={offset} onChange={e => setOffset(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ground-elev">Ground Elevation at Hinge</Label>
            <Input id="ground-elev" type="number" value={groundElevation} onChange={e => setGroundElevation(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cut-slope">Cut Slope (X:1)</Label>
              <Input id="cut-slope" type="number" value={cutSlope} onChange={e => setCutSlope(e.target.value)} placeholder="e.g., 2 for 2:1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fill-slope">Fill Slope (X:1)</Label>
              <Input id="fill-slope" type="number" value={fillSlope} onChange={e => setFillSlope(e.target.value)} placeholder="e.g., 2 for 2:1" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculate}>Calculate Catch Point</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Stakeout Results</CardTitle>
          <CardDescription>
            The calculated location of the slope stake from the centerline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <div className="space-y-3">
              <div className="flex justify-between text-lg font-bold text-primary">
                <span className="text-foreground">{result.cutOrFill === 'Cut' ? 'Cut' : 'Fill'} Amount:</span>
                <span className="font-mono">{result.verticalDifference.toFixed(2)} {getSelectedUnitLabel()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Catch Point Offset:</span>
                <span className="font-mono font-bold text-primary">{result.catchPointOffset.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Catch Point Elevation:</span>
                <span className="font-mono font-bold text-primary">{result.catchPointElevation.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>From Centerline: Stake at offset <span className="font-bold">{result.catchPointOffset.toFixed(2)}</span>' with a <span className="font-bold">{result.cutOrFill} of {result.verticalDifference.toFixed(2)}</span>'.</p>
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

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
import { AzimuthInput, type AzimuthPayload, dmsToDD } from '@/components/azimuth-input';

type Unit = 'ft-us' | 'ft' | 'm';
type SolveMode = 'radius-delta' | 'radius-tangent' | 'radius-length' | 'tangent-delta' | 'length-delta' | 'radius-chord';

type CurveResult = {
  radius: number;
  delta: number; // Stored in DD
  tangent: number;
  length: number;
  longChord: number;
  external: number;
  middleOrdinate: number;
  degreeOfCurve: string; // Formatted as DMS
};

export default function CurveClientPage() {
  const { toast } = useToast();
  const [solveMode, setSolveMode] = useState<SolveMode>('radius-delta');

  // Input states
  const [radius, setRadius] = useState('1000.00');
  const [delta, setDelta] = useState<AzimuthPayload>({
    mode: 'DMS',
    dd: '45',
    dms: { d: '45', m: '00', s: '00' },
    quad: { ns: 'N', ew: 'E', d: '0', m: '0', s: '0' },
  });
  const [tangent, setTangent] = useState('414.21');
  const [length, setLength] = useState('785.40');
  const [longChord, setLongChord] = useState('765.37');

  const [units, setUnits] = useState<Unit>('ft-us');
  const [result, setResult] = useState<CurveResult | null>(null);

  const getSelectedUnitLabel = () => {
    switch (units) {
      case 'ft-us': return 'U.S. Survey Feet';
      case 'ft': return 'Intl. Feet';
      case 'm': return 'Meters';
    }
  };

  const toDMS = (dd: number): string => {
      dd = Math.abs(dd);
      const deg = Math.floor(dd);
      const minFloat = (dd - deg) * 60;
      const min = Math.floor(minFloat);
      const secFloat = (minFloat - min) * 60;
      const sec = Math.round(secFloat * 100) / 100;
      return `${deg}° ${min.toString().padStart(2, '0')}' ${sec.toFixed(2).padStart(5, '0')}"`;
  };

  const resetInputs = () => {
    setResult(null);
  };

  const handleModeChange = (mode: SolveMode) => {
    setSolveMode(mode);
    resetInputs();
  }

  const calculateCurve = () => {
    try {
      let R: number, deltaDD: number;

      // Step 1: Determine Radius and Delta from inputs
      switch (solveMode) {
        case 'radius-delta': {
          R = parseFloat(radius);
          deltaDD = dmsToDD(parseInt(delta.dms.d), parseInt(delta.dms.m), parseFloat(delta.dms.s));
          if (isNaN(R) || R <= 0) throw new Error('Radius must be a positive number.');
          if (isNaN(deltaDD) || deltaDD <= 0 || deltaDD >= 360) throw new Error('Deflection angle must be between 0 and 360 degrees.');
          break;
        }
        case 'radius-tangent': {
          R = parseFloat(radius);
          const T = parseFloat(tangent);
          if (isNaN(R) || R <= 0) throw new Error('Radius must be a positive number.');
          if (isNaN(T) || T <= 0) throw new Error('Tangent must be a positive number.');
          const halfDeltaRad = Math.atan(T / R);
          deltaDD = (halfDeltaRad * 2) * (180 / Math.PI);
          break;
        }
        case 'radius-length': {
          R = parseFloat(radius);
          const L = parseFloat(length);
          if (isNaN(R) || R <= 0) throw new Error('Radius must be a positive number.');
          if (isNaN(L) || L <= 0) throw new Error('Length of curve must be a positive number.');
          if (L >= 2 * Math.PI * R) throw new Error('Length cannot be a full circle or more.');
          const deltaRad = L / R;
          deltaDD = deltaRad * (180 / Math.PI);
          break;
        }
        case 'tangent-delta': {
          const T = parseFloat(tangent);
          deltaDD = dmsToDD(parseInt(delta.dms.d), parseInt(delta.dms.m), parseFloat(delta.dms.s));
          if (isNaN(T) || T <= 0) throw new Error('Tangent must be a positive number.');
          if (isNaN(deltaDD) || deltaDD <= 0 || deltaDD >= 360) throw new Error('Deflection angle must be between 0 and 360 degrees.');
          const halfDeltaRad = (deltaDD / 2) * (Math.PI / 180);
          R = T / Math.tan(halfDeltaRad);
          break;
        }
        case 'length-delta': {
          const L = parseFloat(length);
          deltaDD = dmsToDD(parseInt(delta.dms.d), parseInt(delta.dms.m), parseFloat(delta.dms.s));
          if (isNaN(L) || L <= 0) throw new Error('Length of Curve must be a positive number.');
          if (isNaN(deltaDD) || deltaDD <= 0 || deltaDD >= 360) throw new Error('Deflection angle must be between 0 and 360 degrees.');
          const deltaRad = deltaDD * (Math.PI / 180);
          R = L / deltaRad;
          break;
        }
        case 'radius-chord': {
          R = parseFloat(radius);
          const LC = parseFloat(longChord);
          if (isNaN(R) || R <= 0) throw new Error('Radius must be a positive number.');
          if (isNaN(LC) || LC <= 0) throw new Error('Long Chord must be a positive number.');
          if (LC > 2 * R) throw new Error('Long Chord cannot be greater than twice the radius.');
          const halfDeltaRad = Math.asin(LC / (2 * R));
          deltaDD = (halfDeltaRad * 2) * (180 / Math.PI);
          break;
        }
        default:
          throw new Error('Invalid calculation mode selected.');
      }
      
      if (deltaDD <= 0 || deltaDD >= 360) throw new Error('Calculated deflection angle is invalid. Check inputs.');

      // Step 2: Calculate all other properties from R and deltaDD
      const deltaRad = deltaDD * (Math.PI / 180);
      const halfDeltaRad = deltaRad / 2;

      const T_calc = R * Math.tan(halfDeltaRad);
      const L_calc = R * deltaRad;
      const LC_calc = 2 * R * Math.sin(halfDeltaRad);
      const E_calc = R * (1 / Math.cos(halfDeltaRad) - 1);
      const M_calc = R * (1 - Math.cos(halfDeltaRad));
      
      // Degree of Curve (Arc Definition for a 100-unit arc)
      const D_dd = 100 * (180 / Math.PI) / R;
      
      setResult({
        radius: R,
        delta: deltaDD,
        tangent: T_calc,
        length: L_calc,
        longChord: LC_calc,
        external: E_calc,
        middleOrdinate: M_calc,
        degreeOfCurve: toDMS(D_dd),
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

  const renderInputs = () => {
    switch (solveMode) {
      case 'radius-delta':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="radius">Radius (R) in {getSelectedUnitLabel()}</Label>
              <Input id="radius" type="number" value={radius} onChange={(e) => { setRadius(e.target.value); resetInputs(); }} />
            </div>
            <div className="space-y-2">
              <Label>Deflection Angle (Δ or I)</Label>
              <AzimuthInput value={delta} onChange={(payload) => { setDelta(payload); resetInputs(); }} />
            </div>
          </>
        );
      case 'radius-tangent':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="radius-t">Radius (R) in {getSelectedUnitLabel()}</Label>
              <Input id="radius-t" type="number" value={radius} onChange={(e) => { setRadius(e.target.value); resetInputs(); }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tangent">Tangent (T) in {getSelectedUnitLabel()}</Label>
              <Input id="tangent" type="number" value={tangent} onChange={(e) => { setTangent(e.target.value); resetInputs(); }} />
            </div>
          </>
        );
       case 'radius-length':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="radius-l">Radius (R) in {getSelectedUnitLabel()}</Label>
              <Input id="radius-l" type="number" value={radius} onChange={(e) => { setRadius(e.target.value); resetInputs(); }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length of Curve (L) in {getSelectedUnitLabel()}</Label>
              <Input id="length" type="number" value={length} onChange={(e) => { setLength(e.target.value); resetInputs(); }} />
            </div>
          </>
        );
       case 'tangent-delta':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="tangent-d">Tangent (T) in {getSelectedUnitLabel()}</Label>
              <Input id="tangent-d" type="number" value={tangent} onChange={(e) => { setTangent(e.target.value); resetInputs(); }} />
            </div>
            <div className="space-y-2">
                <Label>Deflection Angle (Δ or I)</Label>
                <AzimuthInput value={delta} onChange={(payload) => { setDelta(payload); resetInputs(); }} />
            </div>
          </>
        );
        case 'length-delta':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="length-d">Length of Curve (L) in {getSelectedUnitLabel()}</Label>
              <Input id="length-d" type="number" value={length} onChange={(e) => { setLength(e.target.value); resetInputs(); }} />
            </div>
            <div className="space-y-2">
                <Label>Deflection Angle (Δ or I)</Label>
                <AzimuthInput value={delta} onChange={(payload) => { setDelta(payload); resetInputs(); }} />
            </div>
          </>
        );
        case 'radius-chord':
        return (
            <>
                <div className="space-y-2">
                    <Label htmlFor="radius-c">Radius (R) in {getSelectedUnitLabel()}</Label>
                    <Input id="radius-c" type="number" value={radius} onChange={(e) => { setRadius(e.target.value); resetInputs(); }} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="long-chord">Long Chord (LC) in {getSelectedUnitLabel()}</Label>
                    <Input id="long-chord" type="number" value={longChord} onChange={(e) => { setLongChord(e.target.value); resetInputs(); }} />
                </div>
            </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Horizontal Curve</CardTitle>
          <CardDescription>
            Solve for curve elements from two known properties.
          </CardDescription>
          <Button asChild variant="link" className="w-fit p-0 h-auto">
            <Link href="/calculators/geometry/curve-diagram">
              <HelpCircle className="mr-2 h-4 w-4" />
              See Reference Diagram
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
              <Label htmlFor="units">Units</Label>
              <Select value={units} onValueChange={(v: Unit) => { setUnits(v); resetInputs(); }}>
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
            <Label htmlFor="solve-mode">Solve By</Label>
            <Select value={solveMode} onValueChange={(v: SolveMode) => handleModeChange(v)}>
              <SelectTrigger id="solve-mode">
                <SelectValue placeholder="Select calculation method..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="radius-delta">Radius & Deflection Angle</SelectItem>
                <SelectItem value="radius-tangent">Radius & Tangent</SelectItem>
                <SelectItem value="radius-length">Radius & Length of Curve</SelectItem>
                <SelectItem value="tangent-delta">Tangent & Deflection Angle</SelectItem>
                <SelectItem value="length-delta">Length & Deflection Angle</SelectItem>
                <SelectItem value="radius-chord">Radius & Long Chord</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator/>
          {renderInputs()}
        </CardContent>
        <CardFooter>
          <Button onClick={calculateCurve}>Calculate Curve</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Calculated Curve Elements</CardTitle>
          <CardDescription>
            The resulting geometric properties of the curve in {getSelectedUnitLabel()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Radius (R):</span>
                <span className="font-mono text-primary font-bold">{result.radius.toFixed(4)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deflection Angle (Δ):</span>
                <span className="font-mono text-primary font-bold">{toDMS(result.delta)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tangent (T):</span>
                <span className="font-mono text-primary font-bold">{result.tangent.toFixed(4)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Length of Curve (L):</span>
                <span className="font-mono text-primary font-bold">{result.length.toFixed(4)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Long Chord (LC):</span>
                <span className="font-mono text-primary font-bold">{result.longChord.toFixed(4)}</span>
              </div>
              <Separator />
               <div className="flex justify-between">
                <span className="text-muted-foreground">External (E):</span>
                <span className="font-mono text-primary font-bold">{result.external.toFixed(4)}</span>
              </div>
              <Separator />
               <div className="flex justify-between">
                <span className="text-muted-foreground">Middle Ordinate (M):</span>
                <span className="font-mono text-primary font-bold">{result.middleOrdinate.toFixed(4)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Degree of Curve (D):</span>
                <span className="font-mono text-primary font-bold">{result.degreeOfCurve}</span>
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

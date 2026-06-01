
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
import { AzimuthInput, type AzimuthPayload, dmsToDD, quadrantToDD } from '@/components/azimuth-input';
import { Point } from '@/lib/types';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';


type Unit = 'ft-us' | 'ft' | 'm';

type SimpleCurve = {
  radius: number;
  delta: number; // DD
  tangent: number;
  length: number;
  longChord: number;
}

type CurveResult = {
  curve1: SimpleCurve;
  curve2: SimpleCurve;
  pcStation?: number;
  pccStation?: number;
  ptStation?: number;
  totalTangent: number;
};

export default function CompoundCurveClientPage() {
  const { toast } = useToast();
  
  // Inputs
  const [piStation, setPiStation] = useState('20+00');
  const [backTangentBearing, setBackTangentBearing] = useState<AzimuthPayload>({ mode: 'DD', dd: '90', dms: {d:'90',m:'00',s:'00'}, quad: {ns:'N',ew:'E',d:'90',m:'00',s:'00'} });
  const [fwdTangentBearing, setFwdTangentBearing] = useState<AzimuthPayload>({ mode: 'DD', dd: '45', dms: {d:'45',m:'00',s:'00'}, quad: {ns:'N',ew:'E',d:'45',m:'00',s:'00'} });
  const [radius1, setRadius1] = useState('500');
  const [delta1, setDelta1] = useState<AzimuthPayload>({ mode: 'DMS', dd: '20', dms: { d: '20', m: '00', s: '00' }, quad: { ns: 'N', ew: 'E', d: '20', m: '00', s: '00' } });
  const [radius2, setRadius2] = useState('800');
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
  
  const parseBearing = (payload: AzimuthPayload): number => {
    let bearingDD: number;
    switch (payload.mode) {
        case 'DD': bearingDD = parseFloat(payload.dd); break;
        case 'DMS': bearingDD = dmsToDD(parseInt(payload.dms.d), parseInt(payload.dms.m), parseFloat(payload.dms.s)); break;
        case 'Quadrant': bearingDD = quadrantToDD(payload.quad.ns, payload.quad.ew, parseInt(payload.quad.d), parseInt(payload.quad.m), parseFloat(payload.quad.s)); break;
        default: throw new Error('Invalid bearing mode.');
    }
    if (isNaN(bearingDD)) throw new Error('Invalid bearing input.');
    return bearingDD;
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


  const calculateCurve = () => {
    try {
      const backBearing = parseBearing(backTangentBearing);
      const fwdBearing = parseBearing(fwdTangentBearing);
      
      const R1 = parseFloat(radius1);
      const I1_dd = parseBearing(delta1);
      const R2 = parseFloat(radius2);

      if(isNaN(R1) || R1 <= 0 || isNaN(R2) || R2 <= 0 || isNaN(I1_dd) || I1_dd <= 0) {
        throw new Error("Radii and Delta 1 must be positive numbers.");
      }

      let total_I = backBearing - fwdBearing;
      if (total_I < 0) total_I += 360;
      
      if (I1_dd >= total_I) {
        throw new Error("Delta 1 cannot be greater than or equal to the total deflection angle.");
      }
      
      const I2_dd = total_I - I1_dd;

      const I1_rad = I1_dd * (Math.PI / 180);
      const I2_rad = I2_dd * (Math.PI / 180);
      const total_I_rad = total_I * (Math.PI / 180);

      const T1 = R1 * Math.tan(I1_rad / 2);
      const L1 = R1 * I1_rad;
      const LC1 = 2 * R1 * Math.sin(I1_rad / 2);

      const T2 = R2 * Math.tan(I2_rad / 2);
      const L2 = R2 * I2_rad;
      const LC2 = 2 * R2 * Math.sin(I2_rad / 2);
      
      // Calculate missing tangent lengths Ta and Tb
      const Tb = (T1 + T2 * Math.cos(I1_rad) + R2 * Math.sin(I1_rad) - R1 * Math.sin(I1_rad)) / Math.sin(total_I_rad);
      const Ta = T1 + ( (T1+T2) * Math.cos(I2_rad) + (R1-R2)*(1-Math.cos(I2_rad)) )/Math.sin(total_I_rad)
      const totalTangent = T1 + T2;

      const piSta = stationToNumber(piStation);
      const pcSta = piSta - Ta;
      const pccSta = pcSta + L1;
      const ptSta = pccSta + L2;

      setResult({
        curve1: { radius: R1, delta: I1_dd, tangent: T1, length: L1, longChord: LC1 },
        curve2: { radius: R2, delta: I2_dd, tangent: T2, length: L2, longChord: LC2 },
        pcStation: pcSta,
        pccStation: pccSta,
        ptStation: ptSta,
        totalTangent
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
          <CardTitle>Compound Curve Inputs</CardTitle>
          <CardDescription>
            Enter the geometry for the compound curve.
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

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-semibold">Overall Geometry</h3>
            <div className="space-y-2">
              <Label>PI Station</Label>
              <Input value={piStation} onChange={e => setPiStation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Back Tangent Bearing</Label>
              <AzimuthInput value={backTangentBearing} onChange={setBackTangentBearing} />
            </div>
             <div className="space-y-2">
              <Label>Forward Tangent Bearing</Label>
              <AzimuthInput value={fwdTangentBearing} onChange={setFwdTangentBearing} />
            </div>
          </div>
          
           <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-semibold">Curve 1 (Incoming)</h3>
             <div className="space-y-2">
              <Label>Radius (R1)</Label>
              <Input type="number" value={radius1} onChange={e => setRadius1(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label>Delta (Δ1)</Label>
              <AzimuthInput value={delta1} onChange={setDelta1} />
            </div>
          </div>

           <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-semibold">Curve 2 (Outgoing)</h3>
             <div className="space-y-2">
              <Label>Radius (R2)</Label>
              <Input type="number" value={radius2} onChange={e => setRadius2(e.target.value)} />
            </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button onClick={calculateCurve}>Calculate Curve</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Calculated Elements</CardTitle>
          <CardDescription>
            The resulting geometric properties for both curves.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {result ? (
            <>
            <div className="space-y-3">
              <h4 className="font-bold text-primary">Curve 1</h4>
              <div className="flex justify-between"><span className="text-muted-foreground">Radius:</span><span className="font-mono">{result.curve1.radius.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delta:</span><span className="font-mono">{toDMS(result.curve1.delta)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tangent:</span><span className="font-mono">{result.curve1.tangent.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Length:</span><span className="font-mono">{result.curve1.length.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Long Chord:</span><span className="font-mono">{result.curve1.longChord.toFixed(2)}</span></div>
            </div>
            <Separator />
            <div className="space-y-3">
               <h4 className="font-bold text-primary">Curve 2</h4>
              <div className="flex justify-between"><span className="text-muted-foreground">Radius:</span><span className="font-mono">{result.curve2.radius.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delta:</span><span className="font-mono">{toDMS(result.curve2.delta)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tangent:</span><span className="font-mono">{result.curve2.tangent.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Length:</span><span className="font-mono">{result.curve2.length.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Long Chord:</span><span className="font-mono">{result.curve2.longChord.toFixed(2)}</span></div>
            </div>
            <Separator />
             <div className="space-y-3">
               <h4 className="font-bold text-primary">Stationing</h4>
                <div className="flex justify-between"><span className="text-muted-foreground">PC Station:</span><span className="font-mono">{result.pcStation && numberToStation(result.pcStation)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">PCC Station:</span><span className="font-mono">{result.pccStation && numberToStation(result.pccStation)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">PT Station:</span><span className="font-mono">{result.ptStation && numberToStation(result.ptStation)}</span></div>
            </div>

            </>
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

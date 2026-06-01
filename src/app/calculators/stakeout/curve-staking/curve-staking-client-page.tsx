
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Unit = 'ft-us' | 'ft' | 'm';

type StakeoutPoint = {
  station: number;
  deflectionAngle: number; // Stored in DD
  chord: number;
};

export default function CurveStakingClientPage() {
  const { toast } = useToast();

  // Inputs
  const [pcStation, setPcStation] = useState('10+00');
  const [radius, setRadius] = useState('500');
  const [length, setLength] = useState('300');
  const [interval, setInterval] = useState('50');
  const [units, setUnits] = useState<Unit>('ft-us');
  
  const [result, setResult] = useState<StakeoutPoint[] | null>(null);

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

  const toDMS = (dd: number): string => {
    dd = Math.abs(dd);
    const deg = Math.floor(dd);
    const minFloat = (dd - deg) * 60;
    const min = Math.floor(minFloat);
    const secFloat = (minFloat - min) * 60;
    const sec = Math.round(secFloat * 100) / 100;
    return `${deg}° ${min.toString().padStart(2, '0')}' ${sec.toFixed(2).padStart(5, '0')}"`;
  };

  const calculate = () => {
    try {
      const R = parseFloat(radius);
      const L = parseFloat(length);
      const startStation = stationToNumber(pcStation);
      const stationInterval = parseFloat(interval);

      if (isNaN(R) || isNaN(L) || isNaN(startStation) || isNaN(stationInterval) || R <= 0 || L <= 0 || stationInterval <= 0) {
        throw new Error('Please enter valid positive numbers for all inputs.');
      }
      
      const stakeoutPoints: StakeoutPoint[] = [];
      
      // Determine stations to calculate
      const endStation = startStation + L;
      const stationsToCalc: number[] = [];
      
      let currentStation = Math.ceil(startStation / stationInterval) * stationInterval;
      if (currentStation < startStation) currentStation += stationInterval;

      while (currentStation < endStation) {
        stationsToCalc.push(currentStation);
        currentStation += stationInterval;
      }
      
      // Always include the PT
      stationsToCalc.push(endStation);

      // Deflection angle per unit of arc
      const deflectionPerUnit = (90 / Math.PI) / R;

      for (const station of stationsToCalc) {
        const arcLength = station - startStation;
        if (arcLength > L) continue;

        const deflectionAngleDD = arcLength * deflectionPerUnit;
        const chord = 2 * R * Math.sin(deflectionAngleDD * (Math.PI / 180));
        
        stakeoutPoints.push({
          station,
          deflectionAngle: deflectionAngleDD,
          chord,
        });
      }

      setResult(stakeoutPoints);

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
          <CardTitle>Curve Staking Inputs</CardTitle>
          <CardDescription>Enter the curve parameters to generate a stakeout report.</CardDescription>
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
          <div className="space-y-2">
            <Label htmlFor="pc-station">PC Station</Label>
            <Input id="pc-station" value={pcStation} onChange={e => setPcStation(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="radius">Radius (R)</Label>
              <Input id="radius" type="number" value={radius} onChange={e => setRadius(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length of Curve (L)</Label>
              <Input id="length" type="number" value={length} onChange={e => setLength(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval">Station Interval</Label>
            <Input id="interval" type="number" value={interval} onChange={e => setInterval(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculate}>Generate Report</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Stakeout Report</CardTitle>
          <CardDescription>
            Deflection angles and chords are from the instrument set up on the PC, oriented to the PI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Station</TableHead>
                  <TableHead>Deflection Angle</TableHead>
                  <TableHead className="text-right">Chord ({getSelectedUnitLabel()})</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono">{numberToStation(p.station)}</TableCell>
                    <TableCell className="font-mono">{toDMS(p.deflectionAngle)}</TableCell>
                    <TableCell className="font-mono text-right">{p.chord.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              <p>Report data will be generated here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

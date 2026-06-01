
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
import { Textarea } from '@/components/ui/textarea';
import type { Point } from '@/lib/types';

type Unit = 'ft-us' | 'ft' | 'm';

type StakeoutPoint = {
  name: string;
  angle: number; // Stored in DD
  distance: number;
};

export default function BuildingCornersClientPage() {
  const { toast } = useToast();

  // Inputs
  const [instrumentPoint, setInstrumentPoint] = useState<Point>({ y: 5000, x: 5000 });
  const [backsightPoint, setBacksightPoint] = useState<Point>({ y: 6000, x: 5000 });
  const [pointsToStakeData, setPointsToStakeData] = useState('P1,5100,5100\nP2,5200,5100');
  const [units, setUnits] = useState<Unit>('ft-us');
  
  const [result, setResult] = useState<StakeoutPoint[] | null>(null);

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
  
  const handlePointChange = (
    setter: React.Dispatch<React.SetStateAction<Point>>,
    axis: 'x' | 'y',
    value: string
  ) => {
    setter(prev => ({...prev, [axis]: parseFloat(value) || 0}));
    setResult(null);
  };


  const calculate = () => {
    try {
        const pointsToStake: Point[] = pointsToStakeData.trim().split(/\r?\n/).map((line, index) => {
            const parts = line.split(/[,\s]+/).filter(Boolean);
            if (parts.length < 3) throw new Error(`Invalid format on line ${index + 1}. Expected "Name,Northing,Easting".`);
            const y = parseFloat(parts[1]);
            const x = parseFloat(parts[2]);
            if (isNaN(x) || isNaN(y)) throw new Error(`Invalid number on line ${index + 1}.`);
            return { name: parts[0], y, x };
        });

        if(pointsToStake.length === 0) {
            throw new Error("Please enter at least one point to stake.");
        }

        // Bearing from Instrument to Backsight (this is our zero-degree reference)
        const bsDeltaN = backsightPoint.y - instrumentPoint.y;
        const bsDeltaE = backsightPoint.x - instrumentPoint.x;
        const bearingToBsRad = Math.atan2(bsDeltaE, bsDeltaN);

        const stakeoutReport: StakeoutPoint[] = [];

        for(const point of pointsToStake) {
            // Bearing from Instrument to Point to Stake
            const pDeltaN = point.y - instrumentPoint.y;
            const pDeltaE = point.x - instrumentPoint.x;
            const bearingToPointRad = Math.atan2(pDeltaE, pDeltaN);

            // Horizontal Distance
            const distance = Math.sqrt(pDeltaN**2 + pDeltaE**2);

            // Angle to turn (clockwise is positive)
            let angleRad = bearingToPointRad - bearingToBsRad;
            if(angleRad < 0) {
                angleRad += 2 * Math.PI;
            }
            const angleDD = angleRad * (180 / Math.PI);
            
            stakeoutReport.push({ name: point.name || `P${stakeoutReport.length+1}`, angle: angleDD, distance });
        }
        
        setResult(stakeoutReport);

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
          <CardTitle>Stakeout Setup & Points</CardTitle>
          <CardDescription>Define your setup and the points you need to stake.</CardDescription>
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
           <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-semibold">Instrument Point</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Northing (Y)</Label>
                        <Input type="number" value={instrumentPoint.y} onChange={e => handlePointChange(setInstrumentPoint, 'y', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Easting (X)</Label>
                        <Input type="number" value={instrumentPoint.x} onChange={e => handlePointChange(setInstrumentPoint, 'x', e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-semibold">Backsight Point</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Northing (Y)</Label>
                        <Input type="number" value={backsightPoint.y} onChange={e => handlePointChange(setBacksightPoint, 'y', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Easting (X)</Label>
                        <Input type="number" value={backsightPoint.x} onChange={e => handlePointChange(setBacksightPoint, 'x', e.target.value)} />
                    </div>
                </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="points-data">Points to Stake (Name, Northing, Easting)</Label>
            <Textarea
                id="points-data"
                value={pointsToStakeData}
                onChange={e => setPointsToStakeData(e.target.value)}
                rows={5}
                placeholder="P1,5100.00,5100.00&#10;P2,5200.00,5100.00"
            />
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
            Angles and distances from the instrument.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Point</TableHead>
                  <TableHead>Angle Right</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold">{p.name}</TableCell>
                    <TableCell className="font-mono">{toDMS(p.angle)}</TableCell>
                    <TableCell className="font-mono text-right">{p.distance.toFixed(2)}</TableCell>
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

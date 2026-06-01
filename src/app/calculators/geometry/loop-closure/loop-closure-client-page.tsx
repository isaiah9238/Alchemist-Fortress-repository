'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import type { Point } from '@/lib/types';
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
import { Trash2, Calculator, LineChart, WandSparkles, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AzimuthInput, type AzimuthPayload, dmsToDD, quadrantToDD } from '@/components/azimuth-input';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adjustTraverseLeastSquares } from '@/app/actions';
import type { LeastSquaresAdjustmentInput, LeastSquaresAdjustmentOutput } from '@/types/ai';

type TraverseLeg = {
  id: number;
  bearing: AzimuthPayload;
  distance: string;
};

type Unit = 'ft-us' | 'ft' | 'm';

type MisclosureResult = {
  totalDistance: number;
  deltaN: number;
  deltaE: number;
  misclosureDistance: number;
  precision: string;
  area: number;
  largeArea: number; // Will be Acres or Hectares
  largeAreaUnit: 'Acres' | 'Hectares';
};

export default function LoopClosureClientPage() {
  const { toast } = useToast();
  const [legs, setLegs] = useState<TraverseLeg[]>([
    { id: 1, bearing: { mode: 'DMS', dd: '45', dms: { d: '45', m: '00', s: '00' }, quad: { ns: 'N', ew: 'E', d: '45', m: '00', s: '00' } }, distance: '141.42' },
    { id: 2, bearing: { mode: 'DMS', dd: '135', dms: { d: '135', m: '00', s: '00' }, quad: { ns: 'S', ew: 'E', d: '45', m: '00', s: '00' } }, distance: '141.42' },
    { id: 3, bearing: { mode: 'DMS', dd: '225', dms: { d: '225', m: '00', s: '00' }, quad: { ns: 'S', ew: 'W', d: '45', m: '00', s: '00' } }, distance: '141.42' },
    { id: 4, bearing: { mode: 'DMS', dd: '315', dms: { d: '315', m: '00', s: '00' }, quad: { ns: 'N', ew: 'W', d: '45', m: '00', s: '00' } }, distance: '141.42' },
  ]);
  const [result, setResult] = useState<MisclosureResult | null>(null);
  const [units, setUnits] = useState<Unit>('ft-us');
  const [startPoint, setStartPoint] = useState({ y: 5000, x: 5000 });
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustmentResult, setAdjustmentResult] = useState<LeastSquaresAdjustmentOutput | null>(null);


  const handleLegChange = (id: number, field: 'bearing' | 'distance', value: AzimuthPayload | string) => {
    setLegs(legs.map(leg => (leg.id === id ? { ...leg, [field]: value } : leg)));
    setResult(null);
    setAdjustmentResult(null);
  };

  const addLeg = () => {
    setLegs([...legs, { 
        id: Date.now(), 
        bearing: { mode: 'DMS', dd: '', dms: {d: '', m: '', s: ''}, quad: { ns: 'N', ew: 'E', d: '', m: '', s: ''}},
        distance: '' 
    }]);
  };

  const removeLeg = (id: number) => {
    setLegs(legs.filter(leg => leg.id !== id));
    setResult(null);
    setAdjustmentResult(null);
  };

  const getUnitLabel = (unitType: 'distance' | 'area') => {
    if (unitType === 'distance') {
      switch (units) {
        case 'ft-us': return 'U.S. Survey Ft';
        case 'ft': return 'Intl. Ft';
        case 'm': return 'Meters';
      }
    } else { // area
       switch (units) {
        case 'ft-us':
        case 'ft':
          return 'Sq. Ft.';
        case 'm':
          return 'Sq. Meters';
      }
    }
  };


  const calculatePrecision = (totalDistance: number, misclosure: number): string => {
    if (misclosure < 0.00001) {
        return "1 : Perfect Closure";
    }
    
    const ratio = totalDistance / misclosure;
    
    return "1 : " + Math.round(ratio).toLocaleString();
  }
  
  const calculateAndStorePlotData = (parsedLegs: { bearingDD: number; distance: number }[]) => {
      const points: Point[] = [{ x: 5000, y: 5000 }];
      let currentPoint: Point = { ...points[0] };

      for (const leg of parsedLegs) {
          const bearingRad = leg.bearingDD * (Math.PI / 180);
          const deltaN = leg.distance * Math.cos(bearingRad);
          const deltaE = leg.distance * Math.sin(bearingRad);

          const newPoint = {
              x: currentPoint.x + deltaE,
              y: currentPoint.y + deltaN,
          };
          points.push(newPoint);
          currentPoint = newPoint;
      }
      
      try {
        localStorage.setItem('lastLoopPlotData', JSON.stringify(points));
      } catch (error) {
        console.error("Could not save to localStorage", error);
        toast({
            variant: "destructive",
            title: "Browser Error",
            description: "Could not save plot data to browser storage.",
        });
      }
  };

  const parseLegs = () => {
      const parsed = legs.map((leg, index) => {
          const distance = parseFloat(leg.distance);
          let bearingDD: number;

          switch (leg.bearing.mode) {
              case 'DD':
                  bearingDD = parseFloat(leg.bearing.dd);
                  break;
              case 'DMS':
                  const d = parseInt(leg.bearing.dms.d || '0');
                  const m = parseInt(leg.bearing.dms.m || '0');
                  const s = parseFloat(leg.bearing.dms.s || '0');
                  if (isNaN(d) || isNaN(m) || isNaN(s)) throw new Error(`Invalid DMS for leg ${index + 1}`);
                  bearingDD = dmsToDD(d, m, s);
                  break;
              case 'Quadrant':
                  const qd = parseInt(leg.bearing.quad.d || '0');
                  const qm = parseInt(leg.bearing.quad.m || '0');
                  const qs = parseFloat(leg.bearing.quad.s || '0');
                  if (isNaN(qd) || isNaN(qm) || isNaN(qs)) throw new Error(`Invalid Quadrant for leg ${index + 1}`);
                  bearingDD = quadrantToDD(leg.bearing.quad.ns, leg.bearing.quad.ew, qd, qm, qs);
                  break;
              default:
                  throw new Error(`Invalid bearing mode for leg ${index + 1}`);
          }
          
          if (isNaN(bearingDD) || isNaN(distance) || distance <= 0) {
              throw new Error(`Invalid input for leg ${index + 1}.`);
          }

          return { bearingDD, distance };
      });
      return parsed;
  }

  const calculateClosure = () => {
    try {
        const parsedLegs = parseLegs();
        let totalDistance = 0;
        let totalDeltaN = 0;
        let totalDeltaE = 0;
        const latitudes: number[] = [];
        const departures: number[] = [];

        for (const leg of parsedLegs) {
            const bearingRad = leg.bearingDD * (Math.PI / 180);
            const deltaN = leg.distance * Math.cos(bearingRad);
            const deltaE = leg.distance * Math.sin(bearingRad);
            
            latitudes.push(deltaN);
            departures.push(deltaE);

            totalDeltaN += deltaN;
            totalDeltaE += deltaE;
            totalDistance += leg.distance;
        }

        if (totalDistance === 0) {
          toast({ variant: 'destructive', title: 'No Data', description: 'Please enter at least one traverse leg.' });
          return;
        }

        // Area Calculation using Double Meridian Distance (DMD) method
        let dmds = [];
        dmds[0] = departures[0];
        let doubleArea = dmds[0] * latitudes[0];

        for (let i = 1; i < parsedLegs.length; i++) {
          if(i > 0) {
            dmds[i] = dmds[i-1] + departures[i-1] + departures[i];
          }
          doubleArea += dmds[i] * latitudes[i];
        }

        const area = Math.abs(doubleArea / 2);
        
        let largeArea: number;
        let largeAreaUnit: 'Acres' | 'Hectares';

        if (units === 'm') {
          // 1 Hectare = 10,000 square meters
          largeArea = area / 10000;
          largeAreaUnit = 'Hectares';
        } else {
          // All foot-based units will be converted to acres
          let areaInSqFt = area;
          if (units === 'ft') { // Intl. Feet
              // 1 intl foot = 0.999998 US survey feet
              const intlToUsSurvey = 0.999998;
              areaInSqFt = area * (intlToUsSurvey * intlToUsSurvey);
          }
          // 1 Acre = 43560 sq ft
          largeArea = areaInSqFt / 43560;
          largeAreaUnit = 'Acres';
        }


        const misclosureDistance = Math.sqrt(totalDeltaN ** 2 + totalDeltaE ** 2);
        const precision = calculatePrecision(totalDistance, misclosureDistance);

        setResult({
          totalDistance,
          deltaN: totalDeltaN,
          deltaE: totalDeltaE,
          misclosureDistance,
          precision,
          area,
          largeArea,
          largeAreaUnit,
        });
        
        calculateAndStorePlotData(parsedLegs);
    } catch (e: any) {
         toast({
          variant: 'destructive',
          title: 'Invalid Input',
          description: e.message,
        });
        setResult(null);
    }
  };
  
  const handleAdjust = async () => {
    setIsAdjusting(true);
    setAdjustmentResult(null);
    try {
        const parsedLegs = parseLegs();

        const input: LeastSquaresAdjustmentInput = {
            legs: parsedLegs.map(leg => ({ bearing: leg.bearingDD, distance: leg.distance })),
            startPoint: {
                y: Number(startPoint.y),
                x: Number(startPoint.x)
            }
        };

        const aiResult = await adjustTraverseLeastSquares(input);
        setAdjustmentResult(aiResult);
        toast({ title: "Adjustment Complete", description: "Least squares adjustment finished successfully." });

    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Adjustment Failed', description: e.message });
    } finally {
        setIsAdjusting(false);
    }
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Traverse Data</CardTitle>
          <CardDescription>
            Input the bearings and distances for each leg of the traverse.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="units">Distance Units</Label>
                <Select value={units} onValueChange={(value: Unit) => {setUnits(value); setResult(null);}}>
                    <SelectTrigger id="units" className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select units..." />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="ft-us">U.S. Survey Feet</SelectItem>
                    <SelectItem value="ft">International Feet</SelectItem>
                    <SelectItem value="m">Meters</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Start Northing (Y)</Label>
                    <Input type="number" value={startPoint.y} onChange={e => setStartPoint({...startPoint, y: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                    <Label>Start Easting (X)</Label>
                    <Input type="number" value={startPoint.x} onChange={e => setStartPoint({...startPoint, x: Number(e.target.value)})} />
                </div>
            </div>
          </div>
          <Separator />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Leg</TableHead>
                  <TableHead>Bearing</TableHead>
                  <TableHead>Distance ({getUnitLabel('distance')})</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {legs.map((leg, index) => (
                  <TableRow key={leg.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="min-w-[350px]">
                      <AzimuthInput
                        value={leg.bearing}
                        onChange={(payload) => handleLegChange(leg.id, 'bearing', payload)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={leg.distance}
                        onChange={e => handleLegChange(leg.id, 'distance', e.target.value)}
                        placeholder="e.g., 100.00"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeLeg(leg.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" onClick={addLeg} className="w-full">
            Add Leg
          </Button>
          <Button onClick={calculateClosure} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Closure
          </Button>
           <Button onClick={handleAdjust} disabled={isAdjusting} className="w-full">
            {isAdjusting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
            Adjust with AI
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-8">
        {result && (
            <Card>
            <CardHeader>
                <CardTitle>Misclosure Results</CardTitle>
                <CardDescription>
                The calculated error of closure and area for the traverse.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Distance ({getUnitLabel('distance')}):</span>
                    <span className="font-mono">{result.totalDistance.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-primary">
                    <span className="text-foreground">Area:</span>
                    <div className="text-right">
                        <span className="font-mono">{result.area.toLocaleString(undefined, { maximumFractionDigits: 2 })} {getUnitLabel('area')}</span>
                        <br />
                        <span className="font-mono text-sm">({result.largeArea.toFixed(4)} {result.largeAreaUnit})</span>
                    </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Closure Error (ΔN):</span>
                    <span className="font-mono">{result.deltaN.toFixed(4)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Closure Error (ΔE):</span>
                    <span className="font-mono">{result.deltaE.toFixed(4)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-primary">
                    <span className="text-foreground">Misclosure Distance ({getUnitLabel('distance')}):</span>
                    <span className="font-mono">{result.misclosureDistance.toFixed(4)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-primary">
                    <span className="text-foreground">Precision:</span>
                    <span className="font-mono">{result.precision}</span>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-4 sm:flex-row">
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href="/calculators/geometry/plot">
                        <LineChart className="mr-2 h-4 w-4" />
                        View Plot
                        </Link>
                    </Button>
                    </div>
                </div>
            </CardContent>
            </Card>
        )}
        {adjustmentResult && (
            <Card>
                <CardHeader>
                    <CardTitle>AI Adjustment Results</CardTitle>
                    <CardDescription>{adjustmentResult.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Point</TableHead>
                                <TableHead>Adjusted Northing (Y)</TableHead>
                                <TableHead>Adjusted Easting (X)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {adjustmentResult.adjustedPoints.map((pt) => (
                                <TableRow key={pt.pointNumber}>
                                    <TableCell>{pt.pointNumber === 0 ? "Start" : `P${pt.pointNumber}`}</TableCell>
                                    <TableCell className="font-mono">{pt.y.toFixed(4)}</TableCell>
                                    <TableCell className="font-mono">{pt.x.toFixed(4)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}
       </div>
    </div>
  );
}

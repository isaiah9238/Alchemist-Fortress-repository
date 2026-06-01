
'use client';

import {useState} from 'react';
import type {Point} from '@/lib/types';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {Separator} from '@/components/ui/separator';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {AzimuthInput, type AzimuthPayload, dmsToDD, quadrantToDD } from '@/components/azimuth-input';
import { LineChart, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';


type CalculationMode = 'bearing-bearing' | 'bearing-distance' | 'distance-distance';
type IntersectionResult = {
    p1: Point;
    p2?: Point;
    solutionCount: 0 | 1 | 2;
}
type Unit = 'ft-us' | 'ft' | 'm';


export default function IntersectionsClientPage() {
  const {toast} = useToast();
  const [mode, setMode] = useState<CalculationMode>('bearing-bearing');
  const [units, setUnits] = useState<Unit>('ft-us');

  // Common result state
  const [result, setResult] = useState<IntersectionResult | null>(null);

  // Bearing-Bearing State
  const [bbP1, setBbP1] = useState<Point>({ y: 5000, x: 5000 });
  const [bbP2, setBbP2] = useState<Point>({ y: 5000, x: 5200 });
  const [bbB1, setBbB1] = useState<AzimuthPayload>({ mode: 'DD', dd: '45', dms: {d:'45',m:'00',s:'00'}, quad: {ns:'N',ew:'E',d:'45',m:'00',s:'00'} });
  const [bbB2, setBbB2] = useState<AzimuthPayload>({ mode: 'DD', dd: '135', dms: {d:'135',m:'00',s:'00'}, quad: {ns:'S',ew:'E',d:'45',m:'00',s:'00'} });

  // Bearing-Distance State
  const [bdP1, setBdP1] = useState<Point>({ y: 5000, x: 5000 });
  const [bdB1, setBdB1] = useState<AzimuthPayload>({ mode: 'DD', dd: '45', dms: {d:'45',m:'00',s:'00'}, quad: {ns:'N',ew:'E',d:'45',m:'00',s:'00'} });
  const [bdP2, setBdP2] = useState<Point>({ y: 5100, x: 5100 });
  const [bdD2, setBdD2] = useState<string>('100.0');

  // Distance-Distance State
  const [ddP1, setDdP1] = useState<Point>({ y: 5000, x: 5000 });
  const [ddD1, setDdD1] = useState<string>('100.0');
  const [ddP2, setDdP2] = useState<Point>({ y: 5000, x: 5200 });
  const [ddD2, setDdD2] = useState<string>('100.0');

  const getSelectedUnitLabel = (unit: Unit) => {
    switch (unit) {
      case 'ft-us':
        return 'U.S. Survey Feet';
      case 'ft':
        return 'Intl. Feet';
      case 'm':
        return 'Meters';
      default:
        return '';
    }
  };


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

  const handleCalc = () => {
    try {
        setResult(null); // Clear previous results
        switch (mode) {
            case 'bearing-bearing': return handleBearingBearingCalc();
            case 'bearing-distance': return handleBearingDistanceCalc();
            case 'distance-distance': return handleDistanceDistanceCalc();
        }
    } catch (e: any) {
         toast({
            variant: 'destructive',
            title: 'Calculation Failed',
            description: e.message || "An unexpected error occurred."
        })
        setResult(null);
    }
  }


  const handleBearingBearingCalc = () => {
    const b1Rad = parseBearing(bbB1) * (Math.PI / 180);
    const b2Rad = parseBearing(bbB2) * (Math.PI / 180);
    
    const { y: n1, x: e1 } = bbP1;
    const { y: n2, x: e2 } = bbP2;
    
    const sinB1 = Math.sin(b1Rad);
    const cosB1 = Math.cos(b1Rad);
    const sinB2 = Math.sin(b2Rad);
    const cosB2 = Math.cos(b2Rad);

    const denominator = cosB1 * sinB2 - cosB2 * sinB1;

    if (Math.abs(denominator) < 1e-9) {
        throw new Error("Bearings are parallel; no unique intersection exists.");
    }
    
    const intersectionN = (n1 * sinB1 * cosB2 - n2 * sinB2 * cosB1 + (e2 - e1) * cosB1 * cosB2) / -denominator;
    const intersectionE = (e1 * cosB1 * sinB2 - e2 * cosB2 * sinB1 + (n2 - n1) * sinB1 * sinB2) / denominator;
    
    if (isNaN(intersectionN) || isNaN(intersectionE)) {
        throw new Error("Could not compute a valid intersection. Check inputs.")
    }

    const intersectionPoint = {y: intersectionN, x: intersectionE};
    setResult({ p1: intersectionPoint, solutionCount: 1 });
    
    localStorage.setItem('lastLoopPlotData', JSON.stringify([bbP1, bbP2, intersectionPoint]));
  }

  const handleBearingDistanceCalc = () => {
    const b1Rad = parseBearing(bdB1) * (Math.PI / 180);
    const d2 = parseFloat(bdD2);
    if(isNaN(d2) || d2 <= 0) throw new Error('Distance from Point 2 must be a positive number.');

    // Inverse from P1 to P2
    const deltaN = bdP2.y - bdP1.y;
    const deltaE = bdP2.x - bdP1.x;
    const distP1P2 = Math.sqrt(deltaN**2 + deltaE**2);
    const bearP1P2 = Math.atan2(deltaE, deltaN);
    
    const angleA = bearP1P2 - b1Rad; // Angle at P1

    if (Math.abs(Math.sin(angleA)) < 1e-9) {
        throw new Error("Input geometry is parallel and cannot be solved.");
    }
    
    // Law of Sines
    const sinAngleC = distP1P2 * Math.sin(angleA) / d2;
    if (Math.abs(sinAngleC) > 1) {
        setResult({solutionCount: 0, p1: {x:0, y:0}});
        toast({title: "No Solution", description: "The line from P1 and circle around P2 do not intersect."})
        return;
    }
    const angleC = Math.asin(sinAngleC);
    
    const angleB = Math.PI - angleA - angleC;
    const distP1Int1 = d2 * Math.sin(angleB) / Math.sin(angleA);

    const int1 = {
      y: bdP1.y + distP1Int1 * Math.cos(b1Rad),
      x: bdP1.x + distP1Int1 * Math.sin(b1Rad),
    };
    
    // Check for second solution
    const angleC2 = Math.PI - angleC;
    const angleB2 = Math.PI - angleA - angleC2;
    const distP1Int2 = d2 * Math.sin(angleB2) / Math.sin(angleA);
    const int2 = {
      y: bdP1.y + distP1Int2 * Math.cos(b1Rad),
      x: bdP1.x + distP1Int2 * Math.sin(b1Rad),
    };

    if (Math.abs(distP1Int1 - distP1Int2) < 1e-4) { // One solution (tangent)
        setResult({ p1: int1, solutionCount: 1 });
        localStorage.setItem('lastLoopPlotData', JSON.stringify([bdP1, bdP2, int1]));
    } else { // Two solutions
        setResult({ p1: int1, p2: int2, solutionCount: 2 });
        localStorage.setItem('lastLoopPlotData', JSON.stringify([bdP1, bdP2, int1, int2]));
    }
  }

  const handleDistanceDistanceCalc = () => {
    const d1 = parseFloat(ddD1);
    const d2 = parseFloat(ddD2);
     if(isNaN(d1) || d1 <= 0 || isNaN(d2) || d2 <=0) throw new Error('Distances must be positive numbers.');

    const deltaN = ddP2.y - ddP1.y;
    const deltaE = ddP2.x - ddP1.x;
    const distP1P2 = Math.sqrt(deltaN**2 + deltaE**2);

    if (distP1P2 > d1 + d2 || distP1P2 < Math.abs(d1 - d2)) {
        setResult({solutionCount: 0, p1: {x:0, y:0}});
        toast({title: "No Solution", description: "The circles do not intersect or are coincident."});
        return;
    }

    const bearP1P2 = Math.atan2(deltaE, deltaN);

    // Law of Cosines to find angle at P1
    const angleA = Math.acos((d1**2 + distP1P2**2 - d2**2) / (2 * d1 * distP1P2));
    
    // First solution
    const bearP1Int1 = bearP1P2 + angleA;
    const int1 = {
        y: ddP1.y + d1 * Math.cos(bearP1Int1),
        x: ddP1.x + d1 * Math.sin(bearP1Int1),
    };

    // Second solution
    const bearP1Int2 = bearP1P2 - angleA;
    const int2 = {
        y: ddP1.y + d1 * Math.cos(bearP1Int2),
        x: ddP1.x + d1 * Math.sin(bearP1Int2),
    };
    
    if (Math.abs(angleA) < 1e-6 || Math.abs(angleA - Math.PI) < 1e-6) { // One solution
        setResult({ p1: int1, solutionCount: 1 });
        localStorage.setItem('lastLoopPlotData', JSON.stringify([ddP1, ddP2, int1]));
    } else { // Two solutions
        setResult({ p1: int1, p2: int2, solutionCount: 2 });
        localStorage.setItem('lastLoopPlotData', JSON.stringify([ddP1, ddP2, int1, int2]));
    }
  }


  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Intersection Inputs</CardTitle>
          <CardDescription>
            Select a method and input the known geometric properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="units">Coordinate & Distance Units</Label>
              <Select value={units} onValueChange={(value: Unit) => {setUnits(value); setResult(null);}}>
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
            <Tabs
              value={mode}
              onValueChange={value => {
                setMode(value as CalculationMode);
                setResult(null);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bearing-bearing">Brg-Brg</TabsTrigger>
                <TabsTrigger value="bearing-distance">Brg-Dist</TabsTrigger>
                <TabsTrigger value="distance-distance">Dist-Dist</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bearing-bearing" className="mt-4 space-y-4">
                  <div className="space-y-4 rounded-md border p-4">
                      <h3 className="font-semibold">Point 1</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                              <Label>Northing (Y)</Label>
                              <Input type="number" value={bbP1.y} onChange={e => setBbP1({...bbP1, y: parseFloat(e.target.value)})} />
                          </div>
                          <div className="space-y-2">
                              <Label>Easting (X)</Label>
                              <Input type="number" value={bbP1.x} onChange={e => setBbP1({...bbP1, x: parseFloat(e.target.value)})} />
                          </div>
                      </div>
                       <div className="space-y-2">
                          <Label>Bearing from Point 1</Label>
                          <AzimuthInput value={bbB1} onChange={setBbB1} />
                      </div>
                  </div>
                   <div className="space-y-4 rounded-md border p-4">
                      <h3 className="font-semibold">Point 2</h3>
                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                              <Label>Northing (Y)</Label>
                              <Input type="number" value={bbP2.y} onChange={e => setBbP2({...bbP2, y: parseFloat(e.target.value)})} />
                          </div>
                          <div className="space-y-2">
                              <Label>Easting (X)</Label>
                              <Input type="number" value={bbP2.x} onChange={e => setBbP2({...bbP2, x: parseFloat(e.target.value)})} />
                          </div>
                      </div>
                       <div className="space-y-2">
                          <Label>Bearing from Point 2</Label>
                          <AzimuthInput value={bbB2} onChange={setBbB2} />
                      </div>
                  </div>
              </TabsContent>
              
              <TabsContent value="bearing-distance" className="mt-4 space-y-4">
                  <div className="space-y-4 rounded-md border p-4">
                      <h3 className="font-semibold">Point 1 (Line Origin)</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                              <Label>Northing (Y)</Label>
                              <Input type="number" value={bdP1.y} onChange={e => setBdP1({...bdP1, y: parseFloat(e.target.value)})} />
                          </div>
                          <div className="space-y-2">
                              <Label>Easting (X)</Label>
                              <Input type="number" value={bdP1.x} onChange={e => setBdP1({...bdP1, x: parseFloat(e.target.value)})} />
                          </div>
                      </div>
                       <div className="space-y-2">
                          <Label>Bearing from Point 1</Label>
                          <AzimuthInput value={bdB1} onChange={setBdB1} />
                      </div>
                  </div>
                   <div className="space-y-4 rounded-md border p-4">
                      <h3 className="font-semibold">Point 2 (Distance Center)</h3>
                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                              <Label>Northing (Y)</Label>
                              <Input type="number" value={bdP2.y} onChange={e => setBdP2({...bdP2, y: parseFloat(e.target.value)})} />
                          </div>
                          <div className="space-y-2">
                              <Label>Easting (X)</Label>
                              <Input type="number" value={bdP2.x} onChange={e => setBdP2({...bdP2, x: parseFloat(e.target.value)})} />
                          </div>
                      </div>
                       <div className="space-y-2">
                          <Label>Distance from Point 2 ({getSelectedUnitLabel(units)})</Label>
                          <Input type="number" value={bdD2} onChange={e => setBdD2(e.target.value)} />
                      </div>
                  </div>
              </TabsContent>
              
              <TabsContent value="distance-distance" className="mt-4 space-y-4">
                  <div className="space-y-4 rounded-md border p-4">
                      <h3 className="font-semibold">Point 1 (Center)</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                              <Label>Northing (Y)</Label>
                              <Input type="number" value={ddP1.y} onChange={e => setDdP1({...ddP1, y: parseFloat(e.target.value)})} />
                          </div>
                          <div className="space-y-2">
                              <Label>Easting (X)</Label>
                              <Input type="number" value={ddP1.x} onChange={e => setDdP1({...ddP1, x: parseFloat(e.target.value)})} />
                          </div>
                      </div>
                       <div className="space-y-2">
                          <Label>Distance (Radius) from Point 1 ({getSelectedUnitLabel(units)})</Label>
                          <Input type="number" value={ddD1} onChange={e => setDdD1(e.target.value)} />
                      </div>
                  </div>
                   <div className="space-y-4 rounded-md border p-4">
                      <h3 className="font-semibold">Point 2 (Center)</h3>
                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                              <Label>Northing (Y)</Label>
                              <Input type="number" value={ddP2.y} onChange={e => setDdP2({...ddP2, y: parseFloat(e.target.value)})} />
                          </div>
                          <div className="space-y-2">
                              <Label>Easting (X)</Label>
                              <Input type="number" value={ddP2.x} onChange={e => setDdP2({...ddP2, x: parseFloat(e.target.value)})} />
                          </div>
                      </div>
                       <div className="space-y-2">
                          <Label>Distance (Radius) from Point 2 ({getSelectedUnitLabel(units)})</Label>
                          <Input type="number" value={ddD2} onChange={e => setDdD2(e.target.value)} />
                      </div>
                  </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleCalc}>Calculate Intersection</Button>
        </CardFooter>
      </Card>
       <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
             <CardTitle>Intersection Point(s)</CardTitle>
            {result && result.solutionCount > 1 && <span className="text-sm font-bold text-primary">{result.solutionCount} Solutions Found</span>}
             {result && result.solutionCount === 1 && <span className="text-sm font-bold text-primary">1 Solution Found</span>}
             {result && result.solutionCount === 0 && <span className="text-sm font-bold text-destructive">No Solution Found</span>}
          </div>
          <CardDescription>
            The calculated coordinates of the intersection in {getSelectedUnitLabel(units)}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result && result.solutionCount > 0 ? (
            <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Solution 1</h4>
                  <div className="space-y-2">
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Northing (Y):</span>
                        <span className="font-mono text-lg font-bold text-primary">
                          {result.p1.y.toFixed(4)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Easting (X):</span>
                        <span className="font-mono text-lg font-bold text-primary">
                          {result.p1.x.toFixed(4)}
                        </span>
                      </div>
                  </div>
                </div>
              
               {result.solutionCount > 1 && result.p2 && (
                 <div>
                    <h4 className="font-semibold mb-2">Solution 2</h4>
                    <div className="space-y-2">
                       <div className="flex justify-between">
                          <span className="text-muted-foreground">Northing (Y):</span>
                          <span className="font-mono text-lg font-bold text-primary">
                            {result.p2.y.toFixed(4)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Easting (X):</span>
                          <span className="font-mono text-lg font-bold text-primary">
                            {result.p2.x.toFixed(4)}
                          </span>
                        </div>
                    </div>
                </div>
              )}
                <Separator />
                <Button asChild variant="outline" className="w-full">
                    <Link href="/calculators/geometry/plot">
                        <LineChart className="mr-2 h-4 w-4" />
                        View Plot
                    </Link>
                </Button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                {result && result.solutionCount === 0 ? (
                    <p>The provided geometry does not intersect.</p>
                ) : (
                    <p>Enter data and click "Calculate" to see the results.</p>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

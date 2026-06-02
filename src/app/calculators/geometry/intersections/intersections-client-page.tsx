'use client';

import { useState } from 'react';
import type { Point } from '@/types/geometry'; // Fixed tracking alias
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AzimuthInput, type AzimuthPayload, dmsToDD, quadrantToDD } from '@/components/azimuth-input';
import { LineChart } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import the computational suite from your features workspace
import { 
  computeBearingBearing, 
  computeBearingDistance, 
  computeDistanceDistance,
  type IntersectionResult 
} from '@/features/intersection/math';

type CalculationMode = 'bearing-bearing' | 'bearing-distance' | 'distance-distance';
type Unit = 'ft-us' | 'ft' | 'm';

export default function IntersectionsClientPage() {
  const { toast } = useToast();
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
      case 'ft-us': return 'U.S. Survey Feet';
      case 'ft': return 'Intl. Feet';
      case 'm': return 'Meters';
      default: return '';
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
      setResult(null);
      
      switch (mode) {
        case 'bearing-bearing': {
          const brg1 = parseBearing(bbB1);
          const brg2 = parseBearing(bbB2);
          const pt = computeBearingBearing(bbP1, brg1, bbP2, brg2);
          
          const res: IntersectionResult = { p1: pt, solutionCount: 1 };
          setResult(res);
          localStorage.setItem('lastLoopPlotData', JSON.stringify([bbP1, bbP2, pt]));
          break;
        }
        case 'bearing-distance': {
          const brg = parseBearing(bdB1);
          const dist = parseFloat(bdD2);
          if (isNaN(dist) || dist <= 0) throw new Error('Distance from Point 2 must be positive.');
          
          const res = computeBearingDistance(bdP1, brg, bdP2, dist);
          setResult(res);
          
          const plotData = [bdP1, bdP2];
          if (res.p1) plotData.push(res.p1);
          if (res.p2) plotData.push(res.p2);
          localStorage.setItem('lastLoopPlotData', JSON.stringify(plotData));
          break;
        }
        case 'distance-distance': {
          const d1 = parseFloat(ddD1);
          const d2 = parseFloat(ddD2);
          if (isNaN(d1) || d1 <= 0 || isNaN(d2) || d2 <= 0) throw new Error('Distances must be positive.');
          
          const res = computeDistanceDistance(ddP1, d1, ddP2, d2);
          setResult(res);
          
          const plotData = [ddP1, ddP2];
          if (res.p1) plotData.push(res.p1);
          if (res.p2) plotData.push(res.p2);
          localStorage.setItem('lastLoopPlotData', JSON.stringify(plotData));
          break;
        }
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: e.message || "An unexpected error occurred."
      });
      setResult(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Intersection Inputs</CardTitle>
          <CardDescription>Select a method and input known properties.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="units">Units</Label>
              <Select value={units} onValueChange={(value: Unit) => { setUnits(value); setResult(null); }}>
                <SelectTrigger id="units"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ft-us">U.S. Survey Feet</SelectItem>
                  <SelectItem value="ft">International Feet</SelectItem>
                  <SelectItem value="m">Meters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Tabs value={mode} onValueChange={val => { setMode(val as CalculationMode); setResult(null); }}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bearing-bearing">Brg-Brg</TabsTrigger>
                <TabsTrigger value="bearing-distance">Brg-Dist</TabsTrigger>
                <TabsTrigger value="distance-distance">Dist-Dist</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bearing-bearing" className="mt-4 space-y-4">
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="font-semibold">Point 1</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" value={bbP1.y} onChange={e => setBbP1({ ...bbP1, y: parseFloat(e.target.value) })} placeholder="N" />
                    <Input type="number" value={bbP1.x} onChange={e => setBbP1({ ...bbP1, x: parseFloat(e.target.value) })} placeholder="E" />
                  </div>
                  <AzimuthInput value={bbB1} onChange={setBbB1} />
                </div>
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="font-semibold">Point 2</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" value={bbP2.y} onChange={e => setBbP2({ ...bbP2, y: parseFloat(e.target.value) })} placeholder="N" />
                    <Input type="number" value={bbP2.x} onChange={e => setBbP2({ ...bbP2, x: parseFloat(e.target.value) })} placeholder="E" />
                  </div>
                  <AzimuthInput value={bbB2} onChange={setBbB2} />
                </div>
              </TabsContent>

              <TabsContent value="bearing-distance" className="mt-4 space-y-4">
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="font-semibold">Point 1 (Origin)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" value={bdP1.y} onChange={e => setBdP1({ ...bdP1, y: parseFloat(e.target.value) })} />
                    <Input type="number" value={bdP1.x} onChange={e => setBdP1({ ...bdP1, x: parseFloat(e.target.value) })} />
                  </div>
                  <AzimuthInput value={bdB1} onChange={setBdB1} />
                </div>
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="font-semibold">Point 2 (Center)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" value={bdP2.y} onChange={e => setBdP2({ ...bdP2, y: parseFloat(e.target.value) })} />
                    <Input type="number" value={bdP2.x} onChange={e => setBdP2({ ...bdP2, x: parseFloat(e.target.value) })} />
                  </div>
                  <Input type="number" value={bdD2} onChange={e => setBdD2(e.target.value)} placeholder="Distance" />
                </div>
              </TabsContent>

              <TabsContent value="distance-distance" className="mt-4 space-y-4">
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="font-semibold">Point 1</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" value={ddP1.y} onChange={e => setDdP1({ ...ddP1, y: parseFloat(e.target.value) })} />
                    <Input type="number" value={ddP1.x} onChange={e => setDdP1({ ...ddP1, x: parseFloat(e.target.value) })} />
                  </div>
                  <Input type="number" value={ddD1} onChange={e => setDdD1(e.target.value)} placeholder="Radius 1" />
                </div>
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="font-semibold">Point 2</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" value={ddP2.y} onChange={e => setDdP2({ ...ddP2, y: parseFloat(e.target.value) })} />
                    <Input type="number" value={ddP2.x} onChange={e => setDdP2({ ...ddP2, x: parseFloat(e.target.value) })} />
                  </div>
                  <Input type="number" value={ddD2} onChange={e => setDdD2(e.target.value)} placeholder="Radius 2" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-black bg-cyan-400 hover:bg-cyan-300" onClick={handleCalc}>Calculate Intersection</Button>
        </CardFooter>
      </Card>

      <Card className="bg-zinc-950/40 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Intersection Output Matrix</CardTitle>
            {result && <span className="text-xs font-bold font-mono text-cyan-400">{result.solutionCount} SOL FOUND</span>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {result && result.solutionCount > 0 && result.p1 ? (
            <div className="space-y-6">
              <div>
                <h4 className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">// SOLUTION_ALPHA</h4>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <span className="text-zinc-400">NORTHING (Y):</span>
                    <span className="text-cyan-400 font-bold">{result.p1.y.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">EASTING (X):</span>
                    <span className="text-cyan-400 font-bold">{result.p1.x.toFixed(4)}</span>
                  </div>
                </div>
              </div>
              
              {result.solutionCount > 1 && result.p2 && (
                <div>
                  <h4 className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">// SOLUTION_BETA</h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-zinc-400">NORTHING (Y):</span>
                      <span className="text-cyan-400 font-bold">{result.p2.y.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">EASTING (X):</span>
                      <span className="text-cyan-400 font-bold">{result.p2.x.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              )}
              <Separator className="bg-zinc-800" />
              <Button asChild variant="outline" className="w-full border-zinc-800 hover:bg-zinc-900">
                <Link href="/calculators/geometry/plot">
                  <LineChart className="mr-2 h-4 w-4" /> View Plot Canvas
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-zinc-500 font-mono text-xs">
              {result && result.solutionCount === 0 ? (
                <p className="text-destructive">// GEOMETRY_ERROR: NO_INTERSECTION_FOUND</p>
              ) : (
                <p>// AWAITING_DATA_INPUT_STREAM...</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
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
import {LineChart} from 'lucide-react';
import {Separator} from '@/components/ui/separator';
import {AzimuthInput, type AzimuthPayload, dmsToDD, quadrantToDD} from '@/components/azimuth-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

type Unit = 'ft-us' | 'ft' | 'm';

export default function SideshotClientPage() {
  const {toast} = useToast();
  const [startPoint, setStartPoint] = useState<Point>({x: 5000, y: 5000});
  const [distance, setDistance] = useState<string>('141.42');
  const [result, setResult] = useState<Point | null>(null);
  const [units, setUnits] = useState<Unit>('ft-us');

  const [azimuth, setAzimuth] = useState<AzimuthPayload>({ mode: 'DD', dd: '45', dms: {d:'45',m:'00',s:'00'}, quad: {ns:'N',ew:'E',d:'45',m:'00',s:'00'} });

  const handlePointChange = (axis: 'x' | 'y', value: string) => {
    setStartPoint(prev => ({...prev, [axis]: parseFloat(value) || 0}));
    setResult(null);
  };

  const handleAzimuthChange = (payload: AzimuthPayload) => {
      setAzimuth(payload);
      setResult(null);
  }
  
  const handleDistanceChange = (value: string) => {
    setDistance(value);
    setResult(null);
  }

  const handleUnitChange = (value: Unit) => {
      setUnits(value);
      setResult(null);
  }

  const calculateSideshot = () => {
    let azimuthDD: number;

    try {
      switch(azimuth.mode) {
        case 'DD':
            azimuthDD = parseFloat(azimuth.dd);
            break;
        case 'DMS':
            azimuthDD = dmsToDD(parseInt(azimuth.dms.d), parseInt(azimuth.dms.m), parseFloat(azimuth.dms.s));
            break;
        case 'Quadrant':
             azimuthDD = quadrantToDD(azimuth.quad.ns, azimuth.quad.ew, parseInt(azimuth.quad.d), parseInt(azimuth.quad.m), parseFloat(azimuth.quad.s));
            break;
        default:
            throw new Error("Invalid azimuth mode specified.");
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Invalid Azimuth',
        description: e.message || 'Please check your azimuth inputs.',
      });
      return;
    }
    
    const dist = parseFloat(distance);

    if (isNaN(azimuthDD)) {
      toast({ variant: 'destructive', title: 'Invalid Azimuth', description: 'Please enter a valid azimuth.' });
      return;
    }
    if (isNaN(dist) || dist <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Distance', description: 'Please enter a valid positive number for the distance.'});
      return;
    }

    const azimuthRadians = azimuthDD * (Math.PI / 180);
    const deltaN = dist * Math.cos(azimuthRadians);
    const deltaE = dist * Math.sin(azimuthRadians);

    const finalPoint: Point = {
      y: startPoint.y + deltaN,
      x: startPoint.x + deltaE,
    };

    setResult(finalPoint);

    try {
      const dataToStore = {
        point1: startPoint,
        point2: finalPoint,
        result: {
          distance: dist,
          azimuth: `${azimuthDD.toFixed(6)}°`,
        },
      };
      localStorage.setItem('lastPlotData', JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Could not save to localStorage', error);
    }
  };

  const getSelectedUnitLabel = (unit: Unit) => {
    const labels = {
        'ft-us': 'U.S. Survey Feet',
        'ft': 'Intl. Feet',
        'm': 'Meters',
    };
    return labels[unit] || '';
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Vector Inputs</CardTitle>
          <CardDescription>
            Define your starting point and the direction/distance to the new point.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="units">Coordinate & Distance Units</Label>
            <Select value={units} onValueChange={handleUnitChange}>
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
            <h3 className="font-semibold">Starting Point</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="p1-y">Northing (Y) <span className="text-xs text-muted-foreground">({getSelectedUnitLabel(units)})</span></Label>
                <Input
                  id="p1-y"
                  type="number"
                  value={startPoint.y}
                  onChange={e => handlePointChange('y', e.target.value)}
                  placeholder="e.g., 5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p1-x">Easting (X) <span className="text-xs text-muted-foreground">({getSelectedUnitLabel(units)})</span></Label>
                <Input
                  id="p1-x"
                  type="number"
                  value={startPoint.x}
                  onChange={e => handlePointChange('x', e.target.value)}
                  placeholder="e.g., 5000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-semibold">Vector</h3>
            <div className="space-y-2">
               <Label htmlFor="distance">Distance ({getSelectedUnitLabel(units)})</Label>
                <Input
                  id="distance"
                  type="number"
                  step="any"
                  value={distance}
                  onChange={e => handleDistanceChange(e.target.value)}
                  placeholder="e.g., 141.42"
                />
            </div>
             <div className="space-y-2">
              <Label>Azimuth</Label>
              <AzimuthInput value={azimuth} onChange={handleAzimuthChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculateSideshot} className="w-full sm:w-auto">
            Calculate Forward
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resulting Point</CardTitle>
          <CardDescription>
            The calculated coordinates of the new point in {getSelectedUnitLabel(units)}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Northing (Y):</span>
                <span className="font-mono text-lg font-bold text-primary">
                  {result.y.toFixed(4)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Easting (X):</span>
                <span className="font-mono text-lg font-bold text-primary">
                  {result.x.toFixed(4)}
                </span>
              </div>
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
              <p>Click "Calculate" to see the results.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

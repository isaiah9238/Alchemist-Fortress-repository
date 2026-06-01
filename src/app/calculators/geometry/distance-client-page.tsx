'use client';

import {useState, useMemo} from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

type Unit = 'm' | 'ft' | 'ft-us';

type DistanceResult = {
  distance: number;
  azimuth: string;
};

const US_FEET_TO_METERS = 1200 / 3937;
const US_FEET_TO_INTL_FEET = 0.999998;

export default function DistanceClientPage() {
  const {toast} = useToast();
  const [point1, setPoint1] = useState<Point>({x: 5000, y: 5000});
  const [point2, setPoint2] = useState<Point>({x: 5100, y: 5100});
  const [result, setResult] = useState<DistanceResult | null>(null);
  const [units, setUnits] = useState<Unit>('ft-us');

  const handlePointChange = (
    pointIndex: 1 | 2,
    axis: 'x' | 'y',
    value: string
  ) => {
    const setter = pointIndex === 1 ? setPoint1 : setPoint2;
    setter(prev => ({...prev, [axis]: parseFloat(value) || 0}));
    setResult(null);
  };
  
  const baseDistance = useMemo(() => {
    const dy = point2.y - point1.y;
    const dx = point2.x - point1.x;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }, [point1, point2]);

  const calculateDistance = () => {
    const dy = point2.y - point1.y;
    const dx = point2.x - point1.x;

    if (dx === 0 && dy === 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Points cannot be identical.',
      });
      setResult(null);
      return;
    }

    let azimuthDD = Math.atan2(dx, dy) * (180 / Math.PI);
    if (azimuthDD < 0) {
      azimuthDD += 360;
    }

    const formattedAzimuth = `${azimuthDD.toFixed(6)}°`;

    let displayDistance = baseDistance;
    if (units === 'm') {
      displayDistance = baseDistance * US_FEET_TO_METERS;
    } else if (units === 'ft') {
      displayDistance = baseDistance * US_FEET_TO_INTL_FEET;
    }

    const newResult = {
      distance: displayDistance,
      azimuth: formattedAzimuth,
    };

    setResult(newResult);
    
    try {
      const dataToStore = { point1, point2, result: newResult };
      localStorage.setItem('lastPlotData', JSON.stringify(dataToStore));
    } catch (error) {
        console.error("Could not save to localStorage", error);
    }
  };
  
  const getSelectedUnitLabel = (unit: Unit) => {
    switch (unit) {
      case 'ft-us': return 'Distance (U.S. Survey Feet)';
      case 'ft': return 'Distance (Intl. Feet)';
      case 'm': return 'Distance (Meters)';
      default: return 'Distance';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Point Data</CardTitle>
          <CardDescription>
            Enter coordinates for two points to find the vector between them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label htmlFor="units">Coordinate & Display Units</Label>
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
          
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-semibold">Point 1</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="p1-y">Northing (Y)</Label>
                <Input
                  id="p1-y"
                  type="number"
                  value={point1.y}
                  onChange={e => handlePointChange(1, 'y', e.target.value)}
                  placeholder="e.g., 5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p1-x">Easting (X)</Label>
                <Input
                  id="p1-x"
                  type="number"
                  value={point1.x}
                  onChange={e => handlePointChange(1, 'x', e.target.value)}
                  placeholder="e.g., 5000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-semibold">Point 2</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="p2-y">Northing (Y)</Label>
                <Input
                  id="p2-y"
                  type="number"
                  value={point2.y}
                  onChange={e => handlePointChange(2, 'y', e.target.value)}
                  placeholder="e.g., 5100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p2-x">Easting (X)</Label>
                <Input
                  id="p2-x"
                  type="number"
                  value={point2.x}
                  onChange={e => handlePointChange(2, 'x', e.target.value)}
                  placeholder="e.g., 5100"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculateDistance} className="w-full sm:w-auto">
            Calculate Inverse
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            The calculated distance and azimuth between the two points.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <div className="space-y-4">
               <div className="flex justify-between text-lg font-bold text-primary">
                <span>{getSelectedUnitLabel(units)}:</span>
                <span className="font-mono">{result.distance.toFixed(4)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Azimuth (DD):</span>
                <span className="font-mono text-lg font-bold text-primary">
                  {result.azimuth}
                </span>
              </div>
              <Separator />
              <Button asChild variant="outline" className="w-full">
                <Link href="/calculators/geometry/plot">
                  <LineChart className="mr-2 h-4 w-4" />
                  View Full Plot
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

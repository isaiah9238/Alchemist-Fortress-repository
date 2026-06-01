'use client';

import {useState} from 'react';
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
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Separator} from '@/components/ui/separator';
import {AzimuthInput, type AzimuthPayload, dmsToDD} from '@/components/azimuth-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type CalculationMode = 'zenith' | 'elevation';
type Unit = 'ft-us' | 'ft' | 'm';

export default function SlopeToHorizontalClientPage() {
  const {toast} = useToast();
  const [mode, setMode] = useState<CalculationMode>('zenith');

  // Common state
  const [slopeDistance, setSlopeDistance] = useState('100.0');
  const [result, setResult] = useState<number | null>(null);
  const [units, setUnits] = useState<Unit>('ft-us');

  // Zenith mode state
  const [zenithAngle, setZenithAngle] = useState<AzimuthPayload>({
    mode: 'DMS',
    dd: '90',
    dms: { d: '90', m: '00', s: '00' },
    quad: { ns: 'N', ew: 'E', d: '0', m: '0', s: '0' },
  });

  // Elevation mode state
  const [elevationA, setElevationA] = useState('100.0');
  const [elevationB, setElevationB] = useState('105.0');
  
  const getSelectedUnitLabel = () => {
    switch (units) {
      case 'ft-us':
        return 'U.S. Survey Feet';
      case 'ft':
        return 'Intl. Feet';
      case 'm':
        return 'Meters';
    }
  };

  const handleValueChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
      setter(value);
      setResult(null);
  }

  const calculate = () => {
    const sd = parseFloat(slopeDistance);
    if (isNaN(sd) || sd <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Slope distance must be a positive number.',
      });
      return;
    }

    let hd = 0;

    try {
        if (mode === 'zenith') {
            const angleDD = dmsToDD(
              parseInt(zenithAngle.dms.d),
              parseInt(zenithAngle.dms.m),
              parseFloat(zenithAngle.dms.s)
            );

            if (isNaN(angleDD)) {
                toast({variant: 'destructive', title: 'Invalid Angle', description: 'Please enter a valid zenith angle.'});
                return;
            }
            
            const angleRad = angleDD * (Math.PI / 180);
            hd = sd * Math.sin(angleRad);
        } else { // Elevation mode
            const elevA = parseFloat(elevationA);
            const elevB = parseFloat(elevationB);
            if (isNaN(elevA) || isNaN(elevB)) {
                 toast({variant: 'destructive', title: 'Invalid Elevation', description: 'Please enter valid numbers for elevations.'});
                return;
            }
            const deltaElev = Math.abs(elevB - elevA);
            if (deltaElev > sd) {
                toast({variant: 'destructive', title: 'Invalid Input', description: 'Elevation difference cannot be greater than the slope distance.'});
                return;
            }
            hd = Math.sqrt(sd ** 2 - deltaElev ** 2);
        }

        if (hd < 0) {
             toast({variant: 'destructive', title: 'Calculation Error', description: 'Calculated horizontal distance is negative. Please check inputs.'});
             setResult(null);
        } else {
            setResult(hd);
        }

    } catch (e: any) {
        toast({
          variant: 'destructive',
          title: 'Calculation Error',
          description: e.message || 'An unexpected error occurred.',
        });
        setResult(null);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
            <Label htmlFor="units">Units</Label>
              <Select value={units} onValueChange={(value: Unit) => {setUnits(value); setResult(null);}}>
                <SelectTrigger id="units" className="max-w-xs">
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="zenith">From Zenith Angle</TabsTrigger>
            <TabsTrigger value="elevation">From Elevation Difference</TabsTrigger>
          </TabsList>
          <div className="space-y-4 rounded-md border p-4 mt-4">
              <Label htmlFor="slope-distance">Slope Distance (SD) in {getSelectedUnitLabel()}</Label>
              <Input
                id="slope-distance"
                type="number"
                value={slopeDistance}
                onChange={e => handleValueChange(setSlopeDistance, e.target.value)}
                placeholder="e.g., 100.0"
              />
          </div>
          <TabsContent value="zenith" className="mt-4 space-y-4 rounded-md border p-4">
             <div className="space-y-2">
                <Label>Zenith Angle</Label>
                 <AzimuthInput
                    value={zenithAngle}
                    onChange={(payload) => {
                        setZenithAngle(payload);
                        setResult(null);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the angle measured from the vertical upward direction (zenith). A 90° angle represents a horizontal line.
                  </p>
             </div>
          </TabsContent>
          <TabsContent value="elevation" className="mt-4 space-y-4 rounded-md border p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="elev-a">Elevation A ({getSelectedUnitLabel()})</Label>
                <Input
                  id="elev-a"
                  type="number"
                  value={elevationA}
                  onChange={e => handleValueChange(setElevationA, e.target.value)}
                  placeholder="e.g., 100.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="elev-b">Elevation B ({getSelectedUnitLabel()})</Label>
                <Input
                  id="elev-b"
                  type="number"
                  value={elevationB}
                  onChange={e => handleValueChange(setElevationB, e.target.value)}
                  placeholder="e.g., 105.0"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
       <CardFooter className="flex-col items-start gap-4">
          <Button onClick={calculate}>Calculate Horizontal Distance</Button>
          {result !== null && (
            <div className="w-full space-y-4 rounded-md border bg-muted/50 p-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Calculated Horizontal Distance (HD) in {getSelectedUnitLabel()}:</span>
                    <span className="font-mono text-lg font-bold text-primary">
                    {result.toFixed(4)}
                    </span>
                </div>
            </div>
          )}
        </CardFooter>
    </Card>
  );
}

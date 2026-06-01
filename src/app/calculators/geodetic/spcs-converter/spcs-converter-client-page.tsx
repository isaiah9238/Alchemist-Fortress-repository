'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { spcs2011Data } from '@/lib/spcs-2011';
import { type ConversionResult, type Point } from '@/app/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { SpcsHandler } from './spcs-handler';

type ConversionDirection = 'spcs-to-geo' | 'geo-to-spcs';
type UnitSystem = 'ft-us' | 'm';

export default function SpcsConverterClientPage() {
  const { toast } = useToast();
  
  // State management
  const [direction, setDirection] = useState<ConversionDirection>('spcs-to-geo');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('ft-us');
  const [selectedState, setSelectedState] = useState<string>('CA');
  const [selectedZone, setSelectedZone] = useState<string>('0403');
  const [inputData, setInputData] = useState('2062331.42, 656372.93');
  const [results, setResults] = useState<ConversionResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized derived data
  const availableStates = useMemo(() => spcs2011Data, []);
  const availableZones = useMemo(() => {
    return availableStates.find(s => s.stateCode === selectedState)?.zones || [];
  }, [selectedState, availableStates]);

  const currentZone = useMemo(() => {
    return availableZones.find(z => z.fipsCode === selectedZone);
  }, [selectedZone, availableZones]);

  // Event handlers
  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    const firstZone = spcs2011Data.find(s => s.stateCode === stateCode)?.zones[0];
    if (firstZone) {
      setSelectedZone(firstZone.fipsCode);
    }
    setResults(null);
  };
  
  const handleZoneChange = (fipsCode: string) => {
    setSelectedZone(fipsCode);
    setResults(null);
  };

  const handleDirectionChange = (dir: ConversionDirection) => {
    setDirection(dir);
    if(dir === 'spcs-to-geo') {
        setInputData('2062331.42, 656372.93');
    } else {
        setInputData('-119.0, 36.5');
    }
    setResults(null);
  }

  const handleConversionComplete = (conversionResults: ConversionResult[]) => {
    setResults(conversionResults);
    setIsLoading(false);
  };
  
  const handleConversionError = (error: Error) => {
    toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: error.message || 'An unexpected error occurred.',
    });
    setIsLoading(false);
  }


  const handleConvert = () => {
    if (!currentZone) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a valid zone.' });
      return;
    }
    setIsLoading(true);
    setResults(null);
  };

  const getInputLabels = () => {
    return direction === 'spcs-to-geo'
      ? { x: `Easting (${unitSystem === 'm' ? 'm' : 'ftUS'})`, y: `Northing (${unitSystem === 'm' ? 'm' : 'ftUS'})` }
      : { x: 'Longitude', y: 'Latitude' };
  }

  const getResultLabels = () => {
     return direction === 'geo-to-spcs'
      ? { x: `Easting (${unitSystem === 'm' ? 'm' : 'ftUS'})`, y: `Northing (${unitSystem === 'm' ? 'm' : 'ftUS'})` }
      : { x: 'Longitude', y: 'Latitude' };
  }

  return (
    <>
      {isLoading && currentZone && (
        <SpcsHandler
            inputData={inputData}
            direction={direction}
            unitSystem={unitSystem}
            zone={currentZone}
            onConversionComplete={handleConversionComplete}
            onConversionError={handleConversionError}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Setup</CardTitle>
            <CardDescription>Select the coordinate system, zone, and direction for the conversion.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Conversion Direction</Label>
              <RadioGroup value={direction} onValueChange={(v: ConversionDirection) => handleDirectionChange(v)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spcs-to-geo" id="s2g" />
                  <Label htmlFor="s2g">SPCS to Lat/Lon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="geo-to-spcs" id="g2s" />
                  <Label htmlFor="g2s">Lat/Lon to SPCS</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state-select">State</Label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger id="state-select"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {availableStates.map(s => <SelectItem key={s.stateCode} value={s.stateCode}>{s.stateName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone-select">Zone</Label>
                <Select value={selectedZone} onValueChange={handleZoneChange}>
                  <SelectTrigger id="zone-select"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {availableZones.map(z => <SelectItem key={z.fipsCode} value={z.fipsCode}>{z.zoneName} ({z.fipsCode})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
                <Label>Units</Label>
                <Select value={unitSystem} onValueChange={(v: UnitSystem) => setUnitSystem(v)}>
                  <SelectTrigger id="unit-select">
                    <SelectValue placeholder="Select unit system..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ft-us">U.S. Survey Feet</SelectItem>
                    <SelectItem value="m">Meters</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Applies to the State Plane Coordinate System values.</p>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="coord-input">Input Coordinates ({getInputLabels().x}, {getInputLabels().y})</Label>
                  <Textarea 
                      id="coord-input"
                      value={inputData}
                      onChange={e => setInputData(e.target.value)}
                      rows={8}
                      placeholder={`e.g.\n${direction === 'spcs-to-geo' ? '2062331.42, 656372.93' : '-119.0, 36.5'}`}
                  />
              </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleConvert} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ArrowRightLeft className="mr-2 h-4 w-4"/>}
              Convert Coordinates
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Results</CardTitle>
            <CardDescription>The transformed coordinates will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Point ID</TableHead>
                    <TableHead>{getResultLabels().y}</TableHead>
                    <TableHead>{getResultLabels().x}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell className="font-mono">{r.y.toFixed(8)}</TableCell>
                      <TableCell className="font-mono">{r.x.toFixed(8)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-48 items-center justify-center text-muted-foreground">
                  <p>Results will be displayed here after conversion.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

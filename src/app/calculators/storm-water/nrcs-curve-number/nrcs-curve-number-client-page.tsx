
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

type UnitSystem = 'imperial' | 'metric';

// From TR-55, Chapter 2
const curveNumbers = [
    { group: 'Cultivated Land', cover: 'Without conservation treatment', soil: 'A', value: 72 },
    { group: 'Cultivated Land', cover: 'Without conservation treatment', soil: 'B', value: 81 },
    { group: 'Cultivated Land', cover: 'Without conservation treatment', soil: 'C', value: 88 },
    { group: 'Cultivated Land', cover: 'Without conservation treatment', soil: 'D', value: 91 },
    { group: 'Pasture or range land', cover: 'Good condition', soil: 'A', value: 39 },
    { group: 'Pasture or range land', cover: 'Good condition', soil: 'B', value: 61 },
    { group: 'Pasture or range land', cover: 'Good condition', soil: 'C', value: 74 },
    { group: 'Pasture or range land', cover: 'Good condition', soil: 'D', value: 80 },
    { group: 'Woods', cover: 'Good condition', soil: 'A', value: 30 },
    { group: 'Woods', cover: 'Good condition', soil: 'B', value: 55 },
    { group: 'Woods', cover: 'Good condition', soil: 'C', value: 70 },
    { group: 'Woods', cover: 'Good condition', soil: 'D', value: 77 },
    { group: 'Open space (lawns, parks)', cover: 'Good condition, >= 75% grass', soil: 'A', value: 39 },
    { group: 'Open space (lawns, parks)', cover: 'Good condition, >= 75% grass', soil: 'B', value: 61 },
    { group: 'Open space (lawns, parks)', cover: 'Good condition, >= 75% grass', soil: 'C', value: 74 },
    { group: 'Open space (lawns, parks)', cover: 'Good condition, >= 75% grass', soil: 'D', value: 80 },
    { group: 'Commercial and business areas', cover: '85% impervious', soil: '', value: 92 },
    { group: 'Industrial districts', cover: '72% impervious', soil: '', value: 88 },
    { group: 'Residential', cover: '1/8-acre lots (65% impervious)', soil: '', value: 85 },
    { group: 'Residential', cover: '1/4-acre lots (38% impervious)', soil: '', value: 75 },
    { group: 'Paved parking lots, roofs, driveways', cover: '', soil: '', value: 98 },
    { group: 'Gravel roads and drives', cover: '', soil: '', value: 89 },
];

type NrcsResult = {
    potentialRetention: number; // S
    runoffDepth: number; // Q
    runoffVolume: number; // Q * A
};

export default function NrcsCurveNumberClientPage() {
  const { toast } = useToast();
  
  // Inputs
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [curveNumber, setCurveNumber] = useState('85');
  const [rainfall, setRainfall] = useState('6.0'); // P
  const [area, setArea] = useState('10.0'); // A
  
  const [result, setResult] = useState<NrcsResult | null>(null);

  const getLabels = () => {
    if (unitSystem === 'imperial') {
      return {
        rainfallLabel: 'in',
        areaLabel: 'acres',
        depthLabel: 'in',
        volumeLabel: 'acre-ft',
      };
    } else {
      return {
        rainfallLabel: 'mm',
        areaLabel: 'hectares',
        depthLabel: 'mm',
        volumeLabel: 'cubic meters',
      };
    }
  };

  const calculate = () => {
    try {
        const P = parseFloat(rainfall);
        const CN = parseFloat(curveNumber);
        const A = parseFloat(area);
        
        if(isNaN(P) || isNaN(CN) || isNaN(A) || P < 0 || A < 0) {
            throw new Error("Rainfall, Curve Number, and Area must be valid positive numbers.");
        }
        if (CN < 30 || CN > 100) {
            throw new Error("Curve Number must be between 30 and 100.");
        }

        let S: number; // Potential maximum retention
        let Q: number; // Runoff depth

        if (unitSystem === 'imperial') { // P and S are in inches
            S = (1000 / CN) - 10;
        } else { // P and S are in mm
            S = 25.4 * ((1000 / CN) - 10);
        }
        
        const Ia = 0.2 * S; // Initial abstraction
        
        if (P <= Ia) {
            Q = 0;
        } else {
            Q = Math.pow((P - Ia), 2) / (P - Ia + S);
        }

        let runoffVolume: number;
        if (unitSystem === 'imperial') {
            // Q is in inches, A is in acres. Result in acre-ft.
            runoffVolume = (Q / 12) * A; 
        } else {
            // Q is in mm, A is in hectares. Result in cubic meters.
            // 1 mm * 1 hectare = (0.001 m) * (10000 m^2) = 10 m^3
            runoffVolume = Q * A * 10;
        }
        
        setResult({
            potentialRetention: S,
            runoffDepth: Q,
            runoffVolume,
        });

    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Calculation Error',
        description: e.message || 'An error occurred.',
      });
      setResult(null);
    }
  };

  const { rainfallLabel, areaLabel, depthLabel, volumeLabel } = getLabels();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>NRCS Method Inputs</CardTitle>
          <CardDescription>Q = (P - 0.2S)² / (P + 0.8S)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Unit System</Label>
                <Select value={unitSystem} onValueChange={(v: UnitSystem) => { setUnitSystem(v); setResult(null); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="imperial">Imperial (in, acres, acre-ft)</SelectItem>
                    <SelectItem value="metric">Metric (mm, hectares, m³)</SelectItem>
                </SelectContent>
                </Select>
            </div>
          
            <div className="space-y-2">
                <Label>Rainfall (P) in {rainfallLabel}</Label>
                <Input type="number" value={rainfall} onChange={e => setRainfall(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Curve Number (CN)</Label>
              <Select value={curveNumber} onValueChange={setCurveNumber}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-60">
                      {curveNumbers.map(c => (
                          <SelectItem key={`${c.group}-${c.cover}-${c.soil || 'none'}`} value={String(c.value)}>
                              {c.group} ({c.cover}) - Soil {c.soil || 'NA'} ({c.value})
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Based on TR-55 for Antecedent Moisture Condition II.</p>
            </div>
            
            <div className="space-y-2">
                <Label>Drainage Area (A) in {areaLabel}</Label>
                <Input type="number" value={area} onChange={e => setArea(e.target.value)} />
            </div>

        </CardContent>
        <CardFooter>
          <Button onClick={calculate}>Calculate Runoff</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Runoff Results</CardTitle>
          <CardDescription>
            The calculated runoff depth and volume.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
             <div className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Potential Retention (S):</span><span className="font-mono">{result.potentialRetention.toFixed(2)} {depthLabel}</span></div>
              <Separator />
              <div className="flex justify-between font-medium"><span className="text-muted-foreground">Runoff Depth (Q):</span><span className="font-mono">{result.runoffDepth.toFixed(2)} {depthLabel}</span></div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-primary"><span className="text-foreground">Runoff Volume:</span><span className="font-mono">{result.runoffVolume.toFixed(3)} {volumeLabel}</span></div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              <p>Results will be displayed here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


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
type OrificeShape = 'circular' | 'rectangular';

type OrificeResult = {
    area: number;
    flowRate: number;
};

export default function OrificeEquationClientPage() {
  const { toast } = useToast();
  
  // Inputs
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [orificeShape, setOrificeShape] = useState<OrificeShape>('circular');
  const [dischargeCoeff, setDischargeCoeff] = useState('0.61');
  const [head, setHead] = useState('10.0'); // Height of water above centerline

  // Shape-specific inputs
  const [diameter, setDiameter] = useState('1.0');
  const [width, setWidth] = useState('1.0');
  const [height, setHeight] = useState('1.0');
  
  const [result, setResult] = useState<OrificeResult | null>(null);

  const getLabels = () => {
    if (unitSystem === 'imperial') {
      return {
        unitLabel: 'ft',
        flowRateLabel: 'cfs (ft³/s)',
        gravity: 32.2
      };
    } else {
      return {
        unitLabel: 'm',
        flowRateLabel: 'cms (m³/s)',
        gravity: 9.81
      };
    }
  };

  const calculate = () => {
    try {
        const C = parseFloat(dischargeCoeff);
        const h = parseFloat(head);
        const g = getLabels().gravity;
        
        if(isNaN(C) || isNaN(h) || C <= 0 || h < 0) {
            throw new Error("Discharge Coefficient and Head must be valid positive numbers.");
        }

        let area = 0;
        
        if (orificeShape === 'circular') {
            const D = parseFloat(diameter);
            if (isNaN(D) || D <= 0) throw new Error("Diameter must be a positive number.");
            const radius = D / 2;
            area = Math.PI * radius * radius;
        } else { // Rectangular
            const W = parseFloat(width);
            const H = parseFloat(height);
            if (isNaN(W) || isNaN(H) || W <= 0 || H <= 0) throw new Error("Width and Height must be positive numbers.");
            area = W * H;
        }
        
        const flowRate = C * area * Math.sqrt(2 * g * h);

        setResult({ area, flowRate });

    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Calculation Error',
        description: e.message || 'An error occurred.',
      });
      setResult(null);
    }
  };
  
  const renderShapeInputs = () => {
    const { unitLabel } = getLabels();
    if (orificeShape === 'circular') {
        return (
            <div className="space-y-2">
              <Label>Orifice Diameter ({unitLabel})</Label>
              <Input type="number" value={diameter} onChange={e => setDiameter(e.target.value)} />
            </div>
        );
    } else { // Rectangular
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Orifice Width ({unitLabel})</Label>
              <Input type="number" value={width} onChange={e => setWidth(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Orifice Height ({unitLabel})</Label>
              <Input type="number" value={height} onChange={e => setHeight(e.target.value)} />
            </div>
          </div>
        );
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Orifice Flow Inputs</CardTitle>
          <CardDescription>Q = C * A * sqrt(2gh)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Unit System</Label>
                    <Select value={unitSystem} onValueChange={(v: UnitSystem) => { setUnitSystem(v); setResult(null); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="imperial">Imperial (ft, cfs)</SelectItem>
                        <SelectItem value="metric">Metric (m, cms)</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Orifice Shape</Label>
                    <Select value={orificeShape} onValueChange={(v: OrificeShape) => { setOrificeShape(v); setResult(null); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="circular">Circular</SelectItem>
                        <SelectItem value="rectangular">Rectangular</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
                {renderShapeInputs()}
            </div>

            <Separator />
            
            <div className="space-y-2">
              <Label>Discharge Coefficient (C)</Label>
               <Input type="number" value={dischargeCoeff} onChange={e => setDischargeCoeff(e.target.value)} />
               <p className="text-xs text-muted-foreground">Typically 0.61 for a sharp-edged orifice.</p>
            </div>
            <div className="space-y-2">
                <Label>Head (h) in {getLabels().unitLabel}</Label>
                <Input type="number" value={head} onChange={e => setHead(e.target.value)} />
                 <p className="text-xs text-muted-foreground">Height of water above the orifice centerline.</p>
            </div>

        </CardContent>
        <CardFooter>
          <Button onClick={calculate}>Calculate Flow</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Flow Results</CardTitle>
          <CardDescription>
            The calculated flow rate through the orifice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
             <div className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Orifice Area (A):</span><span className="font-mono">{result.area.toFixed(3)} {getLabels().unitLabel}²</span></div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-primary"><span className="text-foreground">Flow Rate (Q):</span><span className="font-mono">{result.flowRate.toFixed(3)} {getLabels().flowRateLabel}</span></div>
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

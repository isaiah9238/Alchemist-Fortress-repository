
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
type ChannelShape = 'rectangular' | 'trapezoidal' | 'circular';

const manningCoefficients = [
    { name: 'Concrete', value: 0.013 },
    { name: 'Asphalt', value: 0.016 },
    { name: 'Gravel', value: 0.023 },
    { name: 'Earth, clean', value: 0.022 },
    { name: 'Earth, with weeds', value: 0.030 },
    { name: 'Natural stream, clean', value: 0.030 },
    { name: 'Natural stream, with vegetation', value: 0.075 },
    { name: 'Corrugated Metal Pipe (CMP)', value: 0.024 },
    { name: 'HDPE Pipe (smooth interior)', value: 0.012 },
];

type ManningsResult = {
    area: number;
    wettedPerimeter: number;
    hydraulicRadius: number;
    velocity: number;
    flowRate: number;
};

export default function ManningsEquationClientPage() {
  const { toast } = useToast();
  
  // Inputs
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [channelShape, setChannelShape] = useState<ChannelShape>('rectangular');
  const [manningsN, setManningsN] = useState('0.013');
  const [channelSlope, setChannelSlope] = useState('0.01'); // ft/ft or m/m

  // Shape-specific inputs
  const [bottomWidth, setBottomWidth] = useState('4.0');
  const [flowDepth, setFlowDepth] = useState('2.0');
  const [sideSlope, setSideSlope] = useState('2'); // for trapezoidal
  const [diameter, setDiameter] = useState('4.0'); // for circular
  
  const [result, setResult] = useState<ManningsResult | null>(null);

  const getLabels = () => {
    if (unitSystem === 'imperial') {
      return {
        unitLabel: 'ft',
        velocityLabel: 'ft/s',
        flowRateLabel: 'cfs (ft³/s)',
      };
    } else {
      return {
        unitLabel: 'm',
        velocityLabel: 'm/s',
        flowRateLabel: 'cms (m³/s)',
      };
    }
  };

  const calculate = () => {
    try {
        const n = parseFloat(manningsN);
        const S = parseFloat(channelSlope);
        const d = parseFloat(flowDepth);
        
        if(isNaN(n) || isNaN(S) || n <= 0 || S < 0) {
            throw new Error("Manning's n and Channel Slope must be valid positive numbers.");
        }

        let area = 0, wettedPerimeter = 0;
        
        switch(channelShape) {
            case 'rectangular': {
                const b = parseFloat(bottomWidth);
                if (isNaN(b) || isNaN(d) || b <= 0 || d <= 0) throw new Error("Bottom Width and Flow Depth must be positive numbers.");
                area = b * d;
                wettedPerimeter = b + 2 * d;
                break;
            }
            case 'trapezoidal': {
                const b = parseFloat(bottomWidth);
                const z = parseFloat(sideSlope);
                if (isNaN(b) || isNaN(d) || isNaN(z) || b <= 0 || d <= 0 || z < 0) throw new Error("Bottom Width, Flow Depth, and Side Slope must be valid positive numbers.");
                area = (b + z * d) * d;
                wettedPerimeter = b + 2 * d * Math.sqrt(1 + z * z);
                break;
            }
            case 'circular': {
                const D = parseFloat(diameter);
                if(isNaN(D) || isNaN(d) || D <= 0 || d <= 0) throw new Error("Diameter and Flow Depth must be positive numbers.");
                if (d > D) throw new Error("Flow depth cannot be greater than the diameter.");
                const r = D / 2;
                if (d === r) { // Half-full pipe
                    area = (Math.PI * r * r) / 2;
                    wettedPerimeter = Math.PI * r;
                } else if (d === D) { // Full pipe
                    area = Math.PI * r * r;
                    wettedPerimeter = 2 * Math.PI * r;
                } else {
                    const theta = 2 * Math.acos((r - d) / r);
                    area = (r * r * (theta - Math.sin(theta))) / 2;
                    wettedPerimeter = r * theta;
                }
                break;
            }
        }
        
        if (wettedPerimeter === 0) {
            throw new Error("Cannot calculate with zero wetted perimeter. Check inputs.");
        }
        
        const hydraulicRadius = area / wettedPerimeter;
        const k = unitSystem === 'imperial' ? 1.49 : 1.0;
        const velocity = (k / n) * Math.pow(hydraulicRadius, 2/3) * Math.pow(S, 1/2);
        const flowRate = area * velocity;

        setResult({ area, wettedPerimeter, hydraulicRadius, velocity, flowRate });

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
    switch (channelShape) {
      case 'rectangular':
        return (
          <>
            <div className="space-y-2">
              <Label>Bottom Width ({unitLabel})</Label>
              <Input type="number" value={bottomWidth} onChange={e => setBottomWidth(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Flow Depth ({unitLabel})</Label>
              <Input type="number" value={flowDepth} onChange={e => setFlowDepth(e.target.value)} />
            </div>
          </>
        );
      case 'trapezoidal':
        return (
          <>
            <div className="space-y-2">
              <Label>Bottom Width ({unitLabel})</Label>
              <Input type="number" value={bottomWidth} onChange={e => setBottomWidth(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Flow Depth ({unitLabel})</Label>
              <Input type="number" value={flowDepth} onChange={e => setFlowDepth(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Side Slope (z:1)</Label>
              <Input type="number" value={sideSlope} onChange={e => setSideSlope(e.target.value)} placeholder="e.g., 2 for 2:1"/>
            </div>
          </>
        );
      case 'circular':
        return (
          <>
            <div className="space-y-2">
              <Label>Diameter ({unitLabel})</Label>
              <Input type="number" value={diameter} onChange={e => setDiameter(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Flow Depth ({unitLabel})</Label>
              <Input type="number" value={flowDepth} onChange={e => setFlowDepth(e.target.value)} />
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Open Channel Flow Inputs</CardTitle>
          <CardDescription>Enter parameters to calculate flow characteristics.</CardDescription>
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
                    <Label>Channel Shape</Label>
                    <Select value={channelShape} onValueChange={(v: ChannelShape) => { setChannelShape(v); setResult(null); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rectangular">Rectangular</SelectItem>
                        <SelectItem value="trapezoidal">Trapezoidal</SelectItem>
                        <SelectItem value="circular">Circular</SelectItem>
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
              <Label>Manning's n (Roughness)</Label>
              <Select value={manningsN} onValueChange={setManningsN}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                      {manningCoefficients.map(c => (
                          <SelectItem key={c.name} value={String(c.value)}>
                              {c.name} ({c.value})
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
                <Label>Channel Slope (ft/ft or m/m)</Label>
                <Input type="number" value={channelSlope} onChange={e => setChannelSlope(e.target.value)} />
            </div>

        </CardContent>
        <CardFooter>
          <Button onClick={calculate}>Calculate Flow</Button>
        </CardFooter>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Flow Characteristics</CardTitle>
          <CardDescription>
            The calculated properties of the open channel flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
             <div className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Flow Area (A):</span><span className="font-mono">{result.area.toFixed(3)} {getLabels().unitLabel}²</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Wetted Perimeter (P):</span><span className="font-mono">{result.wettedPerimeter.toFixed(3)} {getLabels().unitLabel}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Hydraulic Radius (R):</span><span className="font-mono">{result.hydraulicRadius.toFixed(3)} {getLabels().unitLabel}</span></div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-primary"><span className="text-foreground">Velocity (V):</span><span className="font-mono">{result.velocity.toFixed(3)} {getLabels().velocityLabel}</span></div>
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

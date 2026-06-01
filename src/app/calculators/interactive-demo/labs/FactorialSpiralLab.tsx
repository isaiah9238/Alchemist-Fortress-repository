
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import type { LabComponentProps, FactorialSpiralCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const FactorialSpiralLab: React.FC<LabComponentProps<FactorialSpiralCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-mono">r = |t!|, θ = t</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Spiral</label>
                </div>
                <Separator />
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="fs-min-t" className="text-sm">Min t</Label>
                        <Input id="fs-min-t" type="number" className="h-8 w-20" value={coeffs.minT} onChange={(e) => setCoeffs(prev => ({ ...prev, minT: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.minT]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, minT: v[0] }))} min={-4} max={0} step={0.1} />
                </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="fs-max-t" className="text-sm">Max t</Label>
                        <Input id="fs-max-t" type="number" className="h-8 w-20" value={coeffs.maxT} onChange={(e) => setCoeffs(prev => ({ ...prev, maxT: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.maxT]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, maxT: v[0] }))} min={0.1} max={8} step={0.1} />
                </div>
                <div className="flex items-center justify-between pt-2">
                    <Label htmlFor="fs-log" className="text-sm">Logarithmic Scale</Label>
                    <Switch id="fs-log" checked={coeffs.logScale} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, logScale: checked }))} />
                </div>
                 <div className="text-xs text-muted-foreground pt-2 space-y-1">
                    <p><span className="font-bold text-foreground">t</span> is the angle in radians that sweeps from Min t to Max t.</p>
                    <p><span className="font-bold text-foreground">r</span> is the radius, calculated using the Gamma function `Γ(t+1)` to extend factorials to non-integers.</p>
                </div>
                 <div className="text-xs text-muted-foreground pt-2">
                   Note: Factorials for negative integers (-1!, -2!, etc.) are undefined, so their points are not plotted. This results in separate spiral segments between each integer.
                </div>
                 <div className="text-xs text-muted-foreground pt-2">
                   <p className="font-mono">x = r * cos(t)</p>
                   <p className="font-mono">y = r * sin(t)</p>
                </div>
            </CardContent>
        </Card>
    );
};

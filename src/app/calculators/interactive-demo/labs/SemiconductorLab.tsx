
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, SemiconductorCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const SemiconductorLab: React.FC<LabComponentProps<SemiconductorCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Eq: <span className="font-mono text-xs">y = I_s * (e^(x / (n*V_t)) - 1)</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Curve</label>
                </div>
                <Separator />
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Saturation Current (I_s)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.Is} onChange={(e) => setCoeffs(prev => ({ ...prev, Is: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.Is]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, Is: v[0] }))} min={0.1} max={10} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Ideality Factor (n)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.n} onChange={(e) => setCoeffs(prev => ({ ...prev, n: parseFloat(e.target.value) || 1 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.n]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, n: v[0] }))} min={1} max={2} step={0.1} />
                </div>
                <p className="text-xs text-muted-foreground">Voltage (V) is mapped to the x-axis. Thermal voltage (V_t) is assumed to be ~25.9mV at room temperature.</p>
            </CardContent>
        </Card>
    );
};


'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export interface RadioactiveDecayCoeffs {
    N0: number;
    lambda: number;
    showCurve?: boolean;
}

export const RadioactiveDecayLab: React.FC<LabComponentProps<RadioactiveDecayCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Eq: <span className="font-mono text-xs">y = N₀ * e^(-λx)</span>
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
                        <Label className="text-sm">Initial Quantity (N₀)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.N0} onChange={(e) => setCoeffs(prev => ({ ...prev, N0: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.N0]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, N0: v[0] }))} min={1} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Decay Constant (λ)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.lambda} onChange={(e) => setCoeffs(prev => ({ ...prev, lambda: parseFloat(e.target.value) || 0 }))} step={0.05} />
                    </div>
                    <Slider value={[coeffs.lambda]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, lambda: v[0] }))} min={0.05} max={2} step={0.05} />
                </div>
            </CardContent>
        </Card>
    );
};


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

export interface GaussianCoeffs {
    A: number;
    c: number;
    x0: number;
    showCurve?: boolean;
}

export const GaussianLab: React.FC<LabComponentProps<GaussianCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-mono text-xs">y = A * e^(-c(x-x₀)²)</span>
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
                        <Label className="text-sm">Amplitude (A)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.A} onChange={(e) => setCoeffs(prev => ({ ...prev, A: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.A]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, A: v[0] }))} min={0.1} max={10} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Width (c)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.c} onChange={(e) => setCoeffs(prev => ({ ...prev, c: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.c]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, c: v[0] }))} min={0.1} max={5} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Center (x₀)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.x0} onChange={(e) => setCoeffs(prev => ({ ...prev, x0: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.x0]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, x0: v[0] }))} min={-10} max={10} step={0.5} />
                </div>
            </CardContent>
        </Card>
    );
};

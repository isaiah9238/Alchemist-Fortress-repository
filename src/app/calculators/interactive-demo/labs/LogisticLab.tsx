
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, LogisticCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const LogisticLab: React.FC<LabComponentProps<LogisticCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-bold text-xs">y = L / (1 + e⁻ᵏ⁽ˣ⁻ˣ⁰⁾)</span>
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
                        <Label htmlFor="logi-l" className="text-sm">Max Value (L)</Label>
                        <Input id="logi-l" type="number" className="h-8 w-20" value={coeffs.L} onChange={(e) => setCoeffs(prev => ({ ...prev, L: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.L]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, L: value[0] }))} min={1} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="logi-k" className="text-sm">Steepness (k)</Label>
                        <Input id="logi-k" type="number" className="h-8 w-20" value={coeffs.k} onChange={(e) => setCoeffs(prev => ({ ...prev, k: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.k]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, k: value[0] }))} min={0.1} max={5} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="logi-x0" className="text-sm">Midpoint (x₀)</Label>
                        <Input id="logi-x0" type="number" className="h-8 w-20" value={coeffs.x0} onChange={(e) => setCoeffs(prev => ({ ...prev, x0: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.x0]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, x0: value[0] }))} min={-10} max={10} step={0.5} />
                </div>
            </CardContent>
        </Card>
    );
};

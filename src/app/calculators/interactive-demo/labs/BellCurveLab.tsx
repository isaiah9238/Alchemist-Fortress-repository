
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, BellCurveCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const BellCurveLab: React.FC<LabComponentProps<BellCurveCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    The Normal Distribution curve.
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
                        <Label htmlFor="bell-mu" className="text-sm">Mean (μ)</Label>
                        <Input id="bell-mu" type="number" className="h-8 w-20" value={coeffs.mu} onChange={(e) => setCoeffs(prev => ({ ...prev, mu: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.mu]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, mu: value[0] }))} min={-10} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="bell-sigma" className="text-sm">Std Dev (σ)</Label>
                        <Input id="bell-sigma" type="number" className="h-8 w-20" value={coeffs.sigma} onChange={(e) => setCoeffs(prev => ({ ...prev, sigma: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.sigma]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, sigma: value[0] }))} min={0.1} max={5} step={0.1} />
                </div>
            </CardContent>
        </Card>
    );
};

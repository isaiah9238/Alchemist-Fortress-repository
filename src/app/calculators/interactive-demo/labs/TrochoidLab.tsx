
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, TrochoidCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const TrochoidLab: React.FC<LabComponentProps<TrochoidCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    const isCycloid = coeffs.r === coeffs.d;
    const isCurtate = coeffs.d < coeffs.r;
    const isProlate = coeffs.d > coeffs.r;

    let description = 'A point on a rolling circle.';
    if (isCycloid) description = 'Common Cycloid (d = r)';
    if (isCurtate) description = 'Curtate Trochoid (d < r)';
    if (isProlate) description = 'Prolate Trochoid (d > r)';

    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Curve</label>
                </div>
                <Separator />
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Circle Radius (r)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.r} onChange={(e) => setCoeffs(prev => ({ ...prev, r: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.r]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, r: v[0] }))} min={0.5} max={10} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Point Distance (d)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.d} onChange={(e) => setCoeffs(prev => ({ ...prev, d: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.d]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, d: v[0] }))} min={0.1} max={15} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Rotations</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.rotations} onChange={(e) => setCoeffs(prev => ({ ...prev, rotations: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.rotations]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, rotations: v[0] }))} min={1} max={10} step={0.5} />
                </div>
            </CardContent>
        </Card>
    );
};

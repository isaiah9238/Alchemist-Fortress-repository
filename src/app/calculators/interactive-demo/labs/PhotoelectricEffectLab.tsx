
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

export interface PhotoelectricEffectCoeffs {
    h: number;
    phi: number;
    showCurve?: boolean;
}

export const PhotoelectricEffectLab: React.FC<LabComponentProps<PhotoelectricEffectCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Eq: <span className="font-mono text-xs">y = hx - φ</span>
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
                        <Label className="text-sm">Planck's Constant (h)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.h} onChange={(e) => setCoeffs(prev => ({ ...prev, h: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.h]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, h: v[0] }))} min={0.1} max={5} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Work Function (φ)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.phi} onChange={(e) => setCoeffs(prev => ({ ...prev, phi: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.phi]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, phi: v[0] }))} min={0} max={10} step={0.5} />
                </div>
            </CardContent>
        </Card>
    );
};

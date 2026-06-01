'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, SpiralCurveCoeffs } from './types';

export const SpiralCurveLab: React.FC<LabComponentProps<SpiralCurveCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>A spiral-curve-spiral system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Radius (R)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.r} onChange={(e) => setCoeffs(prev => ({ ...prev, r: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.r]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, r: v[0] }))} min={1} max={10} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Spiral Length (Ls)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.ls} onChange={(e) => setCoeffs(prev => ({ ...prev, ls: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.ls]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, ls: v[0] }))} min={1} max={10} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Total Delta (°)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.delta} onChange={(e) => setCoeffs(prev => ({ ...prev, delta: parseFloat(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.delta]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, delta: v[0] }))} min={1} max={180} step={1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">TS Tangent Bearing</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.bearing} onChange={(e) => setCoeffs(prev => ({ ...prev, bearing: parseFloat(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.bearing]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, bearing: v[0] }))} min={0} max={360} step={1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">TS X</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.tsx} onChange={(e) => setCoeffs(prev => ({ ...prev, tsx: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.tsx]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, tsx: v[0] }))} min={-10} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">TS Y</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.tsy} onChange={(e) => setCoeffs(prev => ({ ...prev, tsy: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.tsy]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, tsy: v[0] }))} min={-10} max={10} step={0.5} />
                </div>
            </CardContent>
        </Card>
    );
};

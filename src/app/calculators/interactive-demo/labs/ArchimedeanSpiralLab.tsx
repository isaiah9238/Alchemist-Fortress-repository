
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, ArchimedeanSpiralCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const ArchimedeanSpiralLab: React.FC<LabComponentProps<ArchimedeanSpiralCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Archimedean Spiral: <span className="font-mono">r = aθ</span>
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
                        <Label htmlFor="spiral-growth" className="text-sm">Growth (a)</Label>
                        <Input id="spiral-growth" type="number" className="h-8 w-20" value={coeffs.growthFactor} onChange={(e) => setCoeffs(prev => ({ ...prev, growthFactor: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.growthFactor]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, growthFactor: v[0] }))} min={0.1} max={2} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="spiral-rotations" className="text-sm">Rotations</Label>
                        <Input id="spiral-rotations" type="number" className="h-8 w-20" value={coeffs.rotations} onChange={(e) => setCoeffs(prev => ({ ...prev, rotations: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.rotations]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, rotations: v[0] }))} min={1} max={10} step={0.5} />
                </div>
            </CardContent>
        </Card>
    );
};


'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, RoseStarCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const RoseStarLab: React.FC<LabComponentProps<RoseStarCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-bold">r = {coeffs.a.toFixed(1)}cos({coeffs.k.toFixed(1)}θ)</span>
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
                        <Label htmlFor="rose-a" className="text-sm">Amplitude (a)</Label>
                        <Input id="rose-a" type="number" className="h-8 w-20" value={coeffs.a} onChange={(e) => setCoeffs(prev => ({ ...prev, a: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.a]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, a: value[0] }))} min={-10} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="rose-k" className="text-sm">Petals (k)</Label>
                        <Input id="rose-k" type="number" className="h-8 w-20" value={coeffs.k} onChange={(e) => setCoeffs(prev => ({ ...prev, k: parseFloat(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.k]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, k: value[0] }))} min={1} max={12} step={1} />
                </div>
            </CardContent>
        </Card>
    );
};

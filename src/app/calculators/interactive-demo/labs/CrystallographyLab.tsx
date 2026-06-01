
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, CrystallographyCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const CrystallographyLab: React.FC<LabComponentProps<CrystallographyCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Eq: <span className="font-mono text-xs">y = -A/x + B/xⁿ</span>
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
                        <Label className="text-sm">Attraction (A)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.A} onChange={(e) => setCoeffs(prev => ({ ...prev, A: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.A]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, A: v[0] }))} min={0} max={20} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Repulsion (B)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.B} onChange={(e) => setCoeffs(prev => ({ ...prev, B: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.B]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, B: v[0] }))} min={0} max={20} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Exponent (n)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.n} onChange={(e) => setCoeffs(prev => ({ ...prev, n: parseInt(e.target.value) || 1 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.n]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, n: v[0] }))} min={2} max={12} step={1} />
                </div>
            </CardContent>
        </Card>
    );
};

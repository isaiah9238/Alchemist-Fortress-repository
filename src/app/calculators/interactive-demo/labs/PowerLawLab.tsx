
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, PowerLawCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const PowerLawLab: React.FC<LabComponentProps<PowerLawCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-mono">y = {coeffs.coefficient} * x^{coeffs.power}</span>
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
                        <Label className="text-sm">Coefficient</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.coefficient} onChange={(e) => setCoeffs(prev => ({ ...prev, coefficient: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.coefficient]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, coefficient: v[0] }))} min={-5} max={5} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Power</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.power} onChange={(e) => setCoeffs(prev => ({ ...prev, power: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.power]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, power: v[0] }))} min={-3} max={3} step={0.1} />
                </div>
            </CardContent>
        </Card>
    );
};

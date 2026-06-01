
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, DampedOscillationCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const DampedOscillationLab: React.FC<LabComponentProps<DampedOscillationCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-mono text-xs">y = {coeffs.amplitude}e^({-coeffs.decay}x)cos({coeffs.frequency}x)</span>
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
                        <Label className="text-sm">Amplitude</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.amplitude} onChange={(e) => setCoeffs(prev => ({ ...prev, amplitude: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.amplitude]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, amplitude: v[0] }))} min={0} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Decay Rate</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.decay} onChange={(e) => setCoeffs(prev => ({ ...prev, decay: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.decay]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, decay: v[0] }))} min={0} max={2} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Frequency</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.frequency} onChange={(e) => setCoeffs(prev => ({ ...prev, frequency: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.frequency]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, frequency: v[0] }))} min={0} max={10} step={0.5} />
                </div>
            </CardContent>
        </Card>
    );
};

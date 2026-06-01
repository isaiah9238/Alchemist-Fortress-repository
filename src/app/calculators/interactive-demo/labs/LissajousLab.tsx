
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, LissajousCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const LissajousLab: React.FC<LabComponentProps<LissajousCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    x = A·sin(at + δ), y = B·sin(bt)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Curve</label>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Amplitude X (A)</Label>
                            <Input type="number" className="h-8 w-20" value={coeffs.A} onChange={(e) => setCoeffs(prev => ({ ...prev, A: parseFloat(e.target.value) || 0 }))} step={0.5} />
                        </div>
                        <Slider value={[coeffs.A]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, A: v[0] }))} min={0} max={10} step={0.1} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Amplitude Y (B)</Label>
                            <Input type="number" className="h-8 w-20" value={coeffs.B} onChange={(e) => setCoeffs(prev => ({ ...prev, B: parseFloat(e.target.value) || 0 }))} step={0.5} />
                        </div>
                        <Slider value={[coeffs.B]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, B: v[0] }))} min={0} max={10} step={0.1} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Frequency X (a)</Label>
                            <Input type="number" className="h-8 w-20" value={coeffs.a} onChange={(e) => setCoeffs(prev => ({ ...prev, a: parseFloat(e.target.value) || 0 }))} step={1} />
                        </div>
                        <Slider value={[coeffs.a]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, a: v[0] }))} min={1} max={10} step={1} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Frequency Y (b)</Label>
                            <Input type="number" className="h-8 w-20" value={coeffs.b} onChange={(e) => setCoeffs(prev => ({ ...prev, b: parseFloat(e.target.value) || 0 }))} step={1} />
                        </div>
                        <Slider value={[coeffs.b]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, b: v[0] }))} min={1} max={10} step={1} />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Phase Shift (δ) in °</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.delta} onChange={(e) => setCoeffs(prev => ({ ...prev, delta: parseFloat(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.delta]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, delta: v[0] }))} min={0} max={360} step={1} />
                </div>
            </CardContent>
        </Card>
    );
};

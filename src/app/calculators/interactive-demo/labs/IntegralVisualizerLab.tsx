'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import type { LabComponentProps, IntegralCoeffs, ParabolaCoeffs } from './types';

interface IntegralVisualizerLabProps extends LabComponentProps<IntegralCoeffs> {
    parabola: ParabolaCoeffs | null;
}

export const IntegralVisualizerLab: React.FC<IntegralVisualizerLabProps> = ({ title, coeffs, setCoeffs, parabola, onClose }) => {
    const isParabolaAvailable = parabola !== null;

    const indefiniteIntegral = (x: number) => {
        if (!isParabolaAvailable || !parabola) return 0;
        const { a: pa, h: ph, k: pk } = parabola;
        // The integral of a(x-h)^2 + k is (a/3)(x-h)^3 + kx + C
        return (pa / 3) * Math.pow(x - ph, 3) + (pk * x);
    };

    const { a: ia, b: ib } = coeffs;
    const area = isParabolaAvailable ? indefiniteIntegral(ib) - indefiniteIntegral(ia) : 0;

    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Shades the area under Parabola Lab (01).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                {!isParabolaAvailable ? (
                    <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                        Summon a Parabola Lab (01) to visualize its integral.
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="integral-a" className="text-sm">Start (a)</Label>
                                <Input id="integral-a" type="number" className="h-8 w-20" value={coeffs.a} onChange={(e) => setCoeffs(prev => ({ ...prev, a: parseFloat(e.target.value) || 0 }))} step={0.5} />
                            </div>
                            <Slider value={[coeffs.a]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, a: v[0] }))} min={-10} max={10} step={0.5} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="integral-b" className="text-sm">End (b)</Label>
                                <Input id="integral-b" type="number" className="h-8 w-20" value={coeffs.b} onChange={(e) => setCoeffs(prev => ({ ...prev, b: parseFloat(e.target.value) || 0 }))} step={0.5} />
                            </div>
                            <Slider value={[coeffs.b]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, b: v[0] }))} min={-10} max={10} step={0.5} />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Calculated Area:</span>
                            <code className="font-mono text-primary text-sm bg-muted p-2 rounded-md">{area.toFixed(4)}</code>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

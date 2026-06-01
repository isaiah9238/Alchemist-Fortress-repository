
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import type { LabComponentProps, OffsetLabCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';

export const OffsetLab: React.FC<LabComponentProps<OffsetLabCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    
    // Perpendicular distance from a point (px, py) to the line y = mx + b (or mx - y + b = 0)
    const distance = Math.abs(coeffs.m * coeffs.px - coeffs.py + coeffs.b) / Math.sqrt(coeffs.m * coeffs.m + 1);

    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Distance from a point to a line.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Offset</label>
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label className="text-sm">Stationary Point (P)</Label>
                    <div className="flex gap-2">
                        <Input type="number" placeholder="Px" className="h-8 w-full" value={coeffs.px} onChange={(e) => setCoeffs(prev => ({ ...prev, px: parseFloat(e.target.value) || 0 }))} step={0.5} />
                        <Input type="number" placeholder="Py" className="h-8 w-full" value={coeffs.py} onChange={(e) => setCoeffs(prev => ({ ...prev, py: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label className="text-sm">Moving Line (y = mx + b)</Label>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="offset-m" className="text-xs">Slope (m)</Label>
                        <Input id="offset-m" type="number" className="h-8 w-20" value={coeffs.m} onChange={(e) => setCoeffs(prev => ({ ...prev, m: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.m]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, m: v[0] }))} min={-5} max={5} step={0.1} />
                </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="offset-b" className="text-xs">Y-Intercept (b)</Label>
                        <Input id="offset-b" type="number" className="h-8 w-20" value={coeffs.b} onChange={(e) => setCoeffs(prev => ({ ...prev, b: parseFloat(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.b]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, b: v[0] }))} min={-10} max={10} step={1} />
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Perpendicular Distance:</span>
                    <code className="font-mono text-primary text-sm bg-muted p-2 rounded-md">{distance.toFixed(4)}</code>
                </div>
            </CardContent>
        </Card>
    );
};

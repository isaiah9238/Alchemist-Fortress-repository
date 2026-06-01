
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, FactorialPolygonCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const FactorialPolygonLab: React.FC<LabComponentProps<FactorialPolygonCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    const factorial = (n: number): number => {
        if (n < 0) return 0;
        if (n === 0) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            if (result > 1_000_000) return 1_000_001; // Prevent overflow
            result *= i;
        }
        return result;
    };
    
    const q = factorial(coeffs.k);
    const isDegenerate = coeffs.p > 0 && (q > 1000000 || (q % coeffs.p === 0));


    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    A {'{p/q}'} star polygon where q = k!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Polygon</label>
                </div>
                <Separator />
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="fp-p" className="text-sm">Points (p)</Label>
                        <Input id="fp-p" type="number" className="h-8 w-20" value={coeffs.p} onChange={(e) => setCoeffs(prev => ({ ...prev, p: parseInt(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.p]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, p: v[0] }))} min={3} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="fp-k" className="text-sm">Factorial (k!)</Label>
                        <Input id="fp-k" type="number" className="h-8 w-20" value={coeffs.k} onChange={(e) => setCoeffs(prev => ({ ...prev, k: parseInt(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.k]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, k: v[0] }))} min={0} max={8} step={1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="fp-radius" className="text-sm">Radius</Label>
                        <Input id="fp-radius" type="number" className="h-8 w-20" value={coeffs.radius} onChange={(e) => setCoeffs(prev => ({ ...prev, radius: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.radius]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, radius: v[0] }))} min={1} max={10} step={0.5} />
                </div>
                 <div className="text-xs text-muted-foreground pt-2">
                    Connects vertex `i` to vertex `(i + k!) mod p`.
                    Current step `q` = {q > 1000000 ? '>1,000,000' : q.toLocaleString()}
                    {isDegenerate && <p className="font-bold text-destructive mt-1">This combination results in a degenerate polygon (no lines are drawn).</p>}
                </div>
            </CardContent>
        </Card>
    );
};

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, FileText } from 'lucide-react';
import type { LabComponentProps, CircleCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const CircleLab: React.FC<LabComponentProps<CircleCoeffs>> = ({ title, coeffs, setCoeffs, onClose, onGenerateReport }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-mono text-xs">(x - h)² + (y - k)² = r²</span>
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
                        <Label htmlFor="circle-h" className="text-sm">Center X (h)</Label>
                        <Input id="circle-h" type="number" className="h-8 w-20" value={coeffs.h} onChange={(e) => setCoeffs(prev => ({ ...prev, h: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.h]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, h: value[0] }))} min={-10} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="circle-k" className="text-sm">Center Y (k)</Label>
                        <Input id="circle-k" type="number" className="h-8 w-20" value={coeffs.k} onChange={(e) => setCoeffs(prev => ({ ...prev, k: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.k]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, k: value[0] }))} min={-10} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="circle-r" className="text-sm">Radius (r)</Label>
                        <Input id="circle-r" type="number" className="h-8 w-20" value={coeffs.r} onChange={(e) => setCoeffs(prev => ({ ...prev, r: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.r]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, r: value[0] }))} min={0} max={10} step={0.5} />
                </div>
            </CardContent>
            <CardFooter>
                {onGenerateReport && (
                    <Button variant="outline" onClick={onGenerateReport} className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Lab Report
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

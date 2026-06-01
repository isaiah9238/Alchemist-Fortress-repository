'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, FileText } from 'lucide-react';
import type { LabComponentProps, LineCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const LineLab: React.FC<LabComponentProps<LineCoeffs>> = ({ title, coeffs, setCoeffs, onClose, onGenerateReport }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-mono text-xs">y = mx + b</span>
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
                        <Label htmlFor="line-m" className="text-sm">Slope (m)</Label>
                        <Input id="line-m" type="number" className="h-8 w-20" value={coeffs.m} onChange={(e) => setCoeffs(prev => ({ ...prev, m: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.m]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, m: value[0] }))} min={-5} max={5} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="line-b" className="text-sm">Y-Intercept (b)</Label>
                        <Input id="line-b" type="number" className="h-8 w-20" value={coeffs.b} onChange={(e) => setCoeffs(prev => ({ ...prev, b: parseFloat(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.b]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, b: value[0] }))} min={-10} max={10} step={1} />
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
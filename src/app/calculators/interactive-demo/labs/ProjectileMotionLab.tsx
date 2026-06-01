'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, FileText } from 'lucide-react';
import type { LabComponentProps, ProjectileMotionCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const ProjectileMotionLab: React.FC<LabComponentProps<ProjectileMotionCoeffs>> = ({ title, coeffs, setCoeffs, onClose, onGenerateReport }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-mono">y = {coeffs.a.toFixed(2)}x² + {coeffs.b.toFixed(2)}x + {coeffs.c.toFixed(2)}</span>
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
                        <Label className="text-sm">a</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.a} onChange={(e) => setCoeffs(prev => ({ ...prev, a: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.a]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, a: v[0] }))} min={-10} max={10} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">b</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.b} onChange={(e) => setCoeffs(prev => ({ ...prev, b: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.b]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, b: v[0] }))} min={-10} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">c</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.c} onChange={(e) => setCoeffs(prev => ({ ...prev, c: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.c]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, c: v[0] }))} min={-10} max={10} step={0.5} />
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
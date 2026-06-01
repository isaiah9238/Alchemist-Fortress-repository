'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, FileText } from 'lucide-react';
import type { LabComponentProps, GoniometricCoeffs, GoniometricType } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const GoniometricLab: React.FC<LabComponentProps<GoniometricCoeffs>> = ({ title, coeffs, setCoeffs, onClose, onGenerateReport }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-mono text-xs">y = {coeffs.a.toFixed(1)} * {coeffs.type}({coeffs.b.toFixed(1)}(x - {coeffs.h})) + {coeffs.k}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Curve</label>
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label>Function Type</Label>
                    <Select value={coeffs.type} onValueChange={(v: GoniometricType) => setCoeffs(prev => ({ ...prev, type: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sin">Sine</SelectItem>
                            <SelectItem value="cos">Cosine</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="gon-a" className="text-sm">Amplitude (a)</Label>
                        <Input id="gon-a" type="number" className="h-8 w-20" value={coeffs.a} onChange={(e) => setCoeffs(prev => ({ ...prev, a: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.a]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, a: value[0] }))} min={-5} max={5} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="gon-b" className="text-sm">Frequency (b)</Label>
                        <Input id="gon-b" type="number" className="h-8 w-20" value={coeffs.b} onChange={(e) => setCoeffs(prev => ({ ...prev, b: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.b]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, b: value[0] }))} min={-5} max={5} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="gon-h" className="text-sm">Phase Shift (h)</Label>
                        <Input id="gon-h" type="number" className="h-8 w-20" value={coeffs.h} onChange={(e) => setCoeffs(prev => ({ ...prev, h: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.h]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, h: value[0] }))} min={-10} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="gon-k" className="text-sm">Vertical Shift (k)</Label>
                        <Input id="gon-k" type="number" className="h-8 w-20" value={coeffs.k} onChange={(e) => setCoeffs(prev => ({ ...prev, k: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.k]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, k: value[0] }))} min={-10} max={10} step={0.5} />
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

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import type { LabComponentProps, TangentialCoeffs, TangentialType } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const TangentialLab: React.FC<LabComponentProps<TangentialCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <span className="font-bold">y = {coeffs.a.toFixed(1)}tan({coeffs.b.toFixed(1)}(x - {coeffs.h})) + {coeffs.k}</span>
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
                    <Select value={coeffs.type} onValueChange={(v: TangentialType) => setCoeffs(prev => ({ ...prev, type: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tan">Tangent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="tan-a" className="text-sm">Vertical Stretch (a)</Label>
                        <Input id="tan-a" type="number" className="h-8 w-20" value={coeffs.a} onChange={(e) => setCoeffs(prev => ({ ...prev, a: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.a]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, a: value[0] }))} min={-5} max={5} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="tan-b" className="text-sm">Frequency (b)</Label>
                        <Input id="tan-b" type="number" className="h-8 w-20" value={coeffs.b} onChange={(e) => setCoeffs(prev => ({ ...prev, b: parseFloat(e.target.value) || 0 }))} step={0.1} />
                    </div>
                    <Slider value={[coeffs.b]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, b: value[0] }))} min={-2} max={2} step={0.1} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="tan-h" className="text-sm">Horizontal Shift (h)</Label>
                        <Input id="tan-h" type="number" className="h-8 w-20" value={coeffs.h} onChange={(e) => setCoeffs(prev => ({ ...prev, h: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.h]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, h: value[0] }))} min={-10} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="tan-k" className="text-sm">Vertical Shift (k)</Label>
                        <Input id="tan-k" type="number" className="h-8 w-20" value={coeffs.k} onChange={(e) => setCoeffs(prev => ({ ...prev, k: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.k]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, k: value[0] }))} min={-10} max={10} step={0.5} />
                </div>
            </CardContent>
        </Card>
    );
};

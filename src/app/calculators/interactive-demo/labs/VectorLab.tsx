
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, VectorCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const VectorLab: React.FC<LabComponentProps<VectorCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Define a vector by its start and end points.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                 <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Vector</label>
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label className="text-sm">Start Point (x₁, y₁)</Label>
                    <div className="flex gap-2">
                        <Input type="number" className="h-8 w-full" value={coeffs.x1} onChange={(e) => setCoeffs(prev => ({ ...prev, x1: parseFloat(e.target.value) || 0 }))} step={0.5} />
                        <Input type="number" className="h-8 w-full" value={coeffs.y1} onChange={(e) => setCoeffs(prev => ({ ...prev, y1: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm">End Point (x₂, y₂)</Label>
                    <div className="flex gap-2">
                        <Input type="number" className="h-8 w-full" value={coeffs.x2} onChange={(e) => setCoeffs(prev => ({ ...prev, x2: parseFloat(e.target.value) || 0 }))} step={0.5} />
                        <Input type="number" className="h-8 w-full" value={coeffs.y2} onChange={(e) => setCoeffs(prev => ({ ...prev, y2: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import type { LabComponentProps, StereographCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const StereographLab: React.FC<LabComponentProps<StereographCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Stereographic projection of a sphere.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Projection</label>
                </div>
                <Separator />
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Radius (R)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.radius} onChange={(e) => setCoeffs(prev => ({ ...prev, radius: parseFloat(e.target.value) || 0 }))} step={0.5} />
                    </div>
                    <Slider value={[coeffs.radius]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, radius: v[0] }))} min={1} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Grid Density</Label>
                         <Input type="number" className="h-8 w-20" value={coeffs.longitudes} onChange={(e) => setCoeffs(prev => ({ ...prev, longitudes: parseInt(e.target.value) || 0, latitudes: parseInt(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.longitudes]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, longitudes: v[0], latitudes: v[0] }))} min={4} max={32} step={2} />
                </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Rotation X (°)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.rotX} onChange={(e) => setCoeffs(prev => ({ ...prev, rotX: parseFloat(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.rotX]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, rotX: v[0] }))} min={0} max={360} step={1} />
                </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Rotation Y (°)</Label>
                        <Input type="number" className="h-8 w-20" value={coeffs.rotY} onChange={(e) => setCoeffs(prev => ({ ...prev, rotY: parseFloat(e.target.value) || 0 }))} step={1} />
                    </div>
                    <Slider value={[coeffs.rotY]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, rotY: v[0] }))} min={0} max={360} step={1} />
                </div>
                 <div className="flex items-center justify-between pt-2">
                    <Label htmlFor="stereo-invert" className="text-sm">Inversion</Label>
                    <Switch
                        id="stereo-invert"
                        checked={coeffs.isInverted}
                        onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, isInverted: checked }))}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

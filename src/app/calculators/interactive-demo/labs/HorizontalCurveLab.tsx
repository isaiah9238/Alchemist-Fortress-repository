'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Activity } from 'lucide-react';
import type { LabComponentProps, HorizontalCurveCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const HorizontalCurveLab: React.FC<LabComponentProps<HorizontalCurveCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    
    // --- ANALYTICAL TELEMETRY ---
    const telemetry = useMemo(() => {
        const { r, delta } = coeffs;
        const deltaRad = (delta * Math.PI) / 180;
        
        const tangent = r * Math.tan(deltaRad / 2);
        const length = r * deltaRad;
        const chord = 2 * r * Math.sin(deltaRad / 2);
        const external = r * (1 / Math.cos(deltaRad / 2) - 1);
        const middleOrdinate = r * (1 - Math.cos(deltaRad / 2));

        return {
            tangent: tangent.toFixed(3),
            length: length.toFixed(3),
            chord: chord.toFixed(3),
            external: external.toFixed(3),
            middleOrdinate: middleOrdinate.toFixed(3)
        };
    }, [coeffs.r, coeffs.delta]);

    return (
        <Card className="relative border-primary/20 bg-[#020617]/80 backdrop-blur-md shadow-2xl overflow-hidden group">
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive transition-colors z-10" 
                onClick={onClose}
            >
                <X className="h-4 w-4" />
            </Button>

            <CardHeader className="pb-3 bg-slate-950/50 border-b border-white/5">
                <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-3 w-3 text-primary" />
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Geometric Curve Module</CardTitle>
                </div>
                <CardDescription className="text-[11px] font-bold text-blue-100/60 uppercase">
                    ID: 20 - Horizontal Alignment Lab
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 pt-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Checkbox 
                            id={`show-curve-${title}`} 
                            checked={!!coeffs.showCurve} 
                            onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} 
                            className="border-primary/40 data-[state=checked]:bg-primary"
                        />
                        <label htmlFor={`show-curve-${title}`} className="text-[10px] uppercase font-black tracking-widest text-foreground/60 cursor-pointer">Stage Visibility</label>
                    </div>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-primary/20 text-primary">Analytical</span>
                </div>

                <Separator className="opacity-5" />

                {/* Telemetry Readout */}
                <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Curve Telemetry</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Tangent (T)</p>
                            <p className="text-blue-400 font-mono text-xs">{telemetry.tangent}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Arc Length (L)</p>
                            <p className="text-primary font-mono text-xs">{telemetry.length}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Long Chord</p>
                            <p className="text-primary font-mono text-xs">{telemetry.chord}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">External (E)</p>
                            <p className="text-blue-400 font-mono text-xs">{telemetry.external}</p>
                        </div>
                    </div>
                </div>

                <Separator className="opacity-5" />

                {/* Parameters */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="hcurve-r" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Radius (R)</Label>
                            <Input id="hcurve-r" type="number" className="h-7 w-16 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.r} onChange={(e) => setCoeffs(prev => ({ ...prev, r: parseFloat(e.target.value) || 0 }))} step={1} />
                        </div>
                        <Slider value={[coeffs.r]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, r: v[0] }))} min={1} max={20} step={0.1} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="hcurve-delta" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Delta Angle (°)</Label>
                            <Input id="hcurve-delta" type="number" className="h-7 w-16 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.delta} onChange={(e) => setCoeffs(prev => ({ ...prev, delta: parseFloat(e.target.value) || 0 }))} step={1} />
                        </div>
                        <Slider value={[coeffs.delta]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, delta: v[0] }))} min={1} max={180} step={1} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-black opacity-40">PC X</Label>
                            <Input type="number" className="h-8 text-xs font-mono bg-black/50 border-white/5" value={coeffs.pcx} onChange={(e) => setCoeffs(prev => ({ ...prev, pcx: parseFloat(e.target.value) || 0 }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-black opacity-40">PC Y</Label>
                            <Input type="number" className="h-8 text-xs font-mono bg-black/50 border-white/5" value={coeffs.pcy} onChange={(e) => setCoeffs(prev => ({ ...prev, pcy: parseFloat(e.target.value) || 0 }))} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

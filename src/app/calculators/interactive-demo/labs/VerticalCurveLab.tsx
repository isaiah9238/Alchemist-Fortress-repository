'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, FileText, Activity } from 'lucide-react';
import type { LabComponentProps, VerticalCurveCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const VerticalCurveLab: React.FC<LabComponentProps<VerticalCurveCoeffs>> = ({ title, coeffs, setCoeffs, onClose, onGenerateReport }) => {
    
    // --- ANALYTICAL TELEMETRY (Unhidden Data) ---
    const telemetry = useMemo(() => {
        const g1_dec = coeffs.g1 / 100;
        const g2_dec = coeffs.g2 / 100;
        const L = coeffs.L;
        const r_val = (g2_dec - g1_dec) / L;

        // PVI
        const pviStation = coeffs.pvcStation + L / 2;
        const pviElevation = coeffs.pvcElevation + g1_dec * (L / 2);

        // PVT
        const pvtStation = coeffs.pvcStation + L;
        const pvtElevation = coeffs.pvcElevation + g1_dec * L + (r_val / 2) * L * L;

        // High/Low Point
        let highLow = null;
        if (coeffs.g1 * coeffs.g2 < 0) {
            const x = -g1_dec / r_val;
            if (x > 0 && x < L) {
                highLow = {
                    type: coeffs.g1 > 0 ? 'High' : 'Low',
                    station: coeffs.pvcStation + x,
                    elevation: coeffs.pvcElevation + g1_dec * x + (r_val / 2) * x * x
                };
            }
        }

        return {
            r: r_val * 100, // as % per station/unit
            pvi: { station: pviStation, elevation: pviElevation },
            pvt: { station: pvtStation, elevation: pvtElevation },
            highLow
        };
    }, [coeffs]);

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
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Vertical Alignment Module</CardTitle>
                </div>
                <CardDescription className="text-[11px] font-bold text-blue-100/60 uppercase">
                    ID: 19 - Symmetrical Parabolic Curve
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
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Geometric Telemetry</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Rate of Change (r)</p>
                            <p className="text-blue-400 font-mono text-xs">{telemetry.r.toFixed(4)}%</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">PVT Station</p>
                            <p className="text-primary font-mono text-xs">{telemetry.pvt.station.toFixed(2)}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">PVI Elevation</p>
                            <p className="text-primary font-mono text-xs">{telemetry.pvi.elevation.toFixed(3)}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">PVT Elevation</p>
                            <p className="text-blue-400 font-mono text-xs">{telemetry.pvt.elevation.toFixed(3)}</p>
                        </div>
                    </div>
                    {telemetry.highLow && (
                        <div className="p-2 bg-primary/10 rounded border border-primary/20 animate-pulse">
                            <p className="text-[8px] font-black uppercase text-primary mb-1">{telemetry.highLow.type} Point Detected</p>
                            <p className="text-[10px] font-mono text-primary font-black">
                                Sta: {telemetry.highLow.station.toFixed(2)} | Elev: {telemetry.highLow.elevation.toFixed(3)}
                            </p>
                        </div>
                    )}
                </div>

                <Separator className="opacity-5" />

                {/* Grade Controls */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] uppercase font-black opacity-60">Initial (g₁%)</Label>
                            <Input type="number" className="h-7 w-14 text-xs font-mono bg-black/50 border-white/5" value={coeffs.g1} onChange={(e) => setCoeffs(prev => ({ ...prev, g1: parseFloat(e.target.value) || 0 }))} step={0.1} />
                        </div>
                        <Slider value={[coeffs.g1]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, g1: v[0] }))} min={-10} max={10} step={0.1} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] uppercase font-black opacity-60">Final (g₂%)</Label>
                            <Input type="number" className="h-7 w-14 text-xs font-mono bg-black/50 border-white/5" value={coeffs.g2} onChange={(e) => setCoeffs(prev => ({ ...prev, g2: parseFloat(e.target.value) || 0 }))} step={0.1} />
                        </div>
                        <Slider value={[coeffs.g2]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, g2: v[0] }))} min={-10} max={10} step={0.1} />
                    </div>
                </div>

                {/* Length & Stationing */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] uppercase font-black opacity-60">Curve Length (L)</Label>
                            <Input type="number" className="h-7 w-20 text-xs font-mono bg-black/50 border-white/5" value={coeffs.L} onChange={(e) => setCoeffs(prev => ({ ...prev, L: parseFloat(e.target.value) || 1 }))} step={10} />
                        </div>
                        <Slider value={[coeffs.L]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, L: v[0] }))} min={10} max={2000} step={10} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-black opacity-40">PVC Station</Label>
                            <Input type="number" className="h-8 text-xs font-mono bg-black/50 border-white/5" value={coeffs.pvcStation} onChange={(e) => setCoeffs(prev => ({ ...prev, pvcStation: parseFloat(e.target.value) || 0 }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-black opacity-40">PVC Elevation</Label>
                            <Input type="number" className="h-8 text-xs font-mono bg-black/50 border-white/5" value={coeffs.pvcElevation} onChange={(e) => setCoeffs(prev => ({ ...prev, pvcElevation: parseFloat(e.target.value) || 0 }))} />
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="bg-slate-950/30 border-t border-white/5 pt-4">
                {onGenerateReport && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={onGenerateReport} 
                        className="w-full text-[10px] font-black uppercase tracking-[0.2em] border-primary/10 hover:bg-primary/10 hover:text-primary transition-all group/btn"
                    >
                        <FileText className="mr-2 h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
                        Generate Design Report
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

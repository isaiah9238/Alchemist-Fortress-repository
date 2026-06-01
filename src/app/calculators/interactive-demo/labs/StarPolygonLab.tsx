'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Activity } from 'lucide-react';
import type { LabComponentProps, StarPolygonCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const StarPolygonLab: React.FC<LabComponentProps<StarPolygonCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    
    // --- ANALYTICAL TELEMETRY ---
    const telemetry = useMemo(() => {
        const { p, q } = coeffs;
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const stepGcd = gcd(p, q);
        
        const type = q === 1 ? 'Regular Polygon' : (stepGcd === 1 ? 'Regular Star' : 'Compound Star');
        const internalAngle = ((p - 2 * q) * 180) / p;
        const totalAngle = (p - 2 * q) * 180;

        return {
            symbol: `{${p}/${q}}`,
            type,
            internalAngle: internalAngle.toFixed(2) + '°',
            totalAngle: totalAngle.toFixed(0) + '°',
            orbits: stepGcd
        };
    }, [coeffs.p, coeffs.q]);

    return (
        <Card className="relative border-primary/20 bg-[#020617]/80 backdrop-blur-md shadow-2xl overflow-hidden group">
            {/* Kill Switch */}
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
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Geometric Topology Engine</CardTitle>
                </div>
                <CardDescription className="text-[11px] font-bold text-blue-100/60 uppercase">
                    Schläfli Symbol: <span className="text-primary font-mono">{telemetry.symbol}</span>
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
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-primary/20 text-primary">Lab 21</span>
                </div>

                <Separator className="opacity-5" />

                {/* Analytical Readout */}
                <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Topology Telemetry</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Shape Class</p>
                            <p className="text-blue-400 font-mono text-[10px] leading-tight">{telemetry.type}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Orbit Count</p>
                            <p className="text-primary font-mono text-xs">{telemetry.orbits}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Vertex Angle</p>
                            <p className="text-primary font-mono text-xs">{telemetry.internalAngle}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Sum of Angles</p>
                            <p className="text-blue-400 font-mono text-xs">{telemetry.totalAngle}</p>
                        </div>
                    </div>
                </div>

                <Separator className="opacity-5" />

                {/* Parameters */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="sp-p" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Vertices (p)</Label>
                            <Input id="sp-p" type="number" className="h-7 w-16 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.p} onChange={(e) => setCoeffs(prev => ({ ...prev, p: parseInt(e.target.value) || 3 }))} step={1} />
                        </div>
                        <Slider value={[coeffs.p]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, p: v[0] }))} min={3} max={20} step={1} className="py-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="sp-q" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Density (q)</Label>
                            <Input id="sp-q" type="number" className="h-7 w-16 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.q} onChange={(e) => setCoeffs(prev => ({ ...prev, q: parseInt(e.target.value) || 1 }))} step={1} />
                        </div>
                        <Slider value={[coeffs.q]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, q: v[0] }))} min={1} max={Math.floor(coeffs.p / 2)} step={1} className="py-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="sp-radius" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Radius (R)</Label>
                            <Input id="sp-radius" type="number" className="h-7 w-16 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.radius} onChange={(e) => setCoeffs(prev => ({ ...prev, radius: parseFloat(e.target.value) || 1 }))} step={0.5} />
                        </div>
                        <Slider value={[coeffs.radius]} onValueChange={(v) => setCoeffs(prev => ({ ...prev, radius: v[0] }))} min={1} max={10} step={0.5} className="py-2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

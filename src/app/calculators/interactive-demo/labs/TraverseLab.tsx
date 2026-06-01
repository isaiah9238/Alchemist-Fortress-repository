'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Trash2, FileText, Activity } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { LabComponentProps, TraverseState } from './types';
import { Checkbox } from '@/components/ui/checkbox';

export const TraverseLab: React.FC<LabComponentProps<TraverseState>> = ({ title, coeffs, setCoeffs, onClose, onGenerateReport }) => {
    
    // --- ANALYTICAL TELEMETRY (The "Unhidden" Data) ---
    const summary = useMemo(() => {
        let totalDist = 0;
        let dN = 0;
        let dE = 0;
        
        coeffs.legs.forEach(leg => {
            const rad = (leg.direction * Math.PI) / 180;
            totalDist += leg.distance;
            dN += leg.distance * Math.cos(rad);
            dE += leg.distance * Math.sin(rad);
        });

        const misclosure = Math.sqrt(dN * dN + dE * dE);
        const precision = misclosure > 0 ? (totalDist / misclosure) : 0;

        return {
            totalDist,
            dN,
            dE,
            misclosure,
            precision: precision > 0 ? `1:${Math.round(precision).toLocaleString()}` : 'Perfect'
        };
    }, [coeffs.legs]);

    const handleStartChange = (axis: 'x' | 'y', value: string) => {
        setCoeffs(prev => ({ ...prev, start: { ...prev.start, [axis]: parseFloat(value) || 0 } }));
    };

    const handleLegChange = (id: number, field: 'direction' | 'distance', value: string) => {
        setCoeffs(prev => ({
            ...prev,
            legs: prev.legs.map(leg => leg.id === id ? { ...leg, [field]: parseFloat(value) || 0 } : leg)
        }));
    };

    const addLeg = () => {
        setCoeffs(prev => ({
            ...prev,
            legs: [...prev.legs, { id: Date.now(), direction: 0, distance: 2 }]
        }));
    };

    const removeLeg = (id: number) => {
        setCoeffs(prev => ({
            ...prev,
            legs: prev.legs.filter(leg => leg.id !== id)
        }));
    };

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
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Spatial Traverse Engine</CardTitle>
                </div>
                <CardDescription className="text-[11px] font-bold text-blue-100/60 uppercase">
                    ID: 18 - Vector Accumulation Lab
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
                        <label htmlFor={`show-curve-${title}`} className="text-[10px] uppercase font-black tracking-widest text-foreground/60 cursor-pointer">Plot Active</label>
                    </div>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-primary/20 text-primary">Analytical</span>
                </div>

                <Separator className="opacity-5" />

                {/* Telemetry Readout */}
                <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Closure Telemetry</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Total Distance</p>
                            <p className="text-blue-400 font-mono text-xs">{summary.totalDist.toFixed(3)}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Misclosure</p>
                            <p className="text-primary font-mono text-xs">{summary.misclosure.toFixed(4)}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Delta N/E</p>
                            <p className="text-primary font-mono text-[9px] truncate">{summary.dN.toFixed(2)}, {summary.dE.toFixed(2)}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Precision</p>
                            <p className="text-blue-400 font-mono text-xs">{summary.precision}</p>
                        </div>
                    </div>
                </div>

                <Separator className="opacity-5" />

                {/* Start Point Input */}
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Origin Coordinate (X, Y)</Label>
                    <div className="flex gap-2">
                        <Input type="number" className="h-8 text-xs font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.start.x} onChange={(e) => handleStartChange('x', e.target.value)} step={0.5} placeholder="Easting (X)" />
                        <Input type="number" className="h-8 text-xs font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.start.y} onChange={(e) => handleStartChange('y', e.target.value)} step={0.5} placeholder="Northing (Y)" />
                    </div>
                </div>

                <Separator className="opacity-5" />

                {/* Legs List */}
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Traverse Legs (Azimuth / Dist)</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 no-scrollbar">
                        {coeffs.legs.map((leg, index) => (
                            <div key={leg.id} className="flex items-center gap-2 bg-black/20 p-1.5 rounded border border-white/5">
                                <span className="text-[10px] font-black text-muted-foreground/40 w-4">#{(index + 1).toString().padStart(2, '0')}</span>
                                <Input type="number" placeholder="Brg" className="h-7 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={leg.direction} onChange={(e) => handleLegChange(leg.id, 'direction', e.target.value)} />
                                <Input type="number" placeholder="Dist" className="h-7 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={leg.distance} onChange={(e) => handleLegChange(leg.id, 'distance', e.target.value)} />
                                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeLeg(leg.id)}><Trash2 className="h-3 w-3" /></Button>
                            </div>
                        ))}
                    </div>
                </div>

                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addLeg} 
                    className="w-full h-8 text-[9px] font-black uppercase tracking-widest border-primary/10 hover:bg-primary/5 transition-all"
                >
                    <Plus className="mr-2 h-3 w-3" /> Append Leg
                </Button>
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
                        Generate Field Report
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

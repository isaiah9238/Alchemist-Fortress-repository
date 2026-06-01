'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Activity, Database } from 'lucide-react';
import type { LabComponentProps, PointPlotterCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const PointPlotterLab: React.FC<LabComponentProps<PointPlotterCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    
    // --- ANALYTICAL TELEMETRY ---
    const summary = useMemo(() => {
        const lines = coeffs.points.trim().split('\n').filter(l => l.trim() !== '');
        const validPoints = lines.map(line => {
            const parts = line.split(/[,\s]+/);
            return parts.length >= 3 && !isNaN(parseFloat(parts[1])) && !isNaN(parseFloat(parts[2]));
        }).filter(Boolean);

        return {
            totalLines: lines.length,
            validPoints: validPoints.length
        };
    }, [coeffs.points]);

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
                    <Database className="h-3 w-3 text-primary" />
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Data Ingestion Engine</CardTitle>
                </div>
                <CardDescription className="text-[11px] font-bold text-blue-100/60 uppercase">
                    ID: 43 - Coordinate Plotting Lab
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
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-primary/20 text-primary">Data Grid</span>
                </div>

                <Separator className="opacity-5" />

                {/* Telemetry Readout */}
                <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Ingestion Telemetry</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Lines Scanned</p>
                            <p className="text-blue-400 font-mono text-xs">{summary.totalLines}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Valid Points</p>
                            <p className="text-primary font-mono text-xs">{summary.validPoints}</p>
                        </div>
                    </div>
                </div>

                <Separator className="opacity-5" />

                <div className="space-y-2">
                    <Label htmlFor="point-data-input" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Coordinate Payload (Name,Y,X)</Label>
                    <Textarea
                        id="point-data-input"
                        className="font-mono h-48 bg-black/50 border-white/5 text-[10px] leading-tight text-blue-100"
                        value={coeffs.points}
                        onChange={(e) => setCoeffs(prev => ({...prev, points: e.target.value}))}
                        placeholder="H,5000.000,5000.000&#10;G,4935.257,5128.375"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

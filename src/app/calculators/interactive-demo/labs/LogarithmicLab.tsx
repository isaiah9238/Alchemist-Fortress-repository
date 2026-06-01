'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, FileText, Info, Activity } from 'lucide-react';
import type { LabComponentProps, LogarithmicCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const LogarithmicLab: React.FC<LabComponentProps<LogarithmicCoeffs>> = ({ title, coeffs, setCoeffs, onClose, onGenerateReport }) => {
    
    // Derived Analytical Data ("Unhiding the data")
    const domain = `x > ${coeffs.h}`;
    const asymptote = `x = ${coeffs.h}`;
    
    let xIntercept = 'None';
    try {
        if (coeffs.a !== 0) {
            const x = coeffs.h + Math.pow(coeffs.b, -coeffs.k / coeffs.a);
            xIntercept = x.toFixed(3);
        }
    } catch (e) {}

    let yIntercept = 'None';
    if (coeffs.h < 0) {
        try {
            const y = coeffs.a * (Math.log(-coeffs.h) / Math.log(coeffs.b)) + coeffs.k;
            yIntercept = y.toFixed(3);
        } catch (e) {}
    }

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
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Analytical Module</CardTitle>
                </div>
                <CardDescription className="font-mono text-[11px] font-bold text-blue-100/90 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                    y = {coeffs.a.toFixed(1)} * log_{coeffs.b.toFixed(1)}(x - {coeffs.h}) + {coeffs.k}
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
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-primary/20 text-primary">Lab 07</span>
                </div>
                
                <Separator className="opacity-5" />

                {/* Analytical Readout Section */}
                <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Telemetry Readout</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Domain</p>
                            <p className="text-blue-400 font-mono text-xs">{domain}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Asymptote</p>
                            <p className="text-blue-400 font-mono text-xs">{asymptote}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">X-Intercept</p>
                            <p className="text-primary font-mono text-xs">{xIntercept}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                            <p className="text-[8px] font-black uppercase text-muted-foreground/50 mb-1">Y-Intercept</p>
                            <p className="text-primary font-mono text-xs">{yIntercept}</p>
                        </div>
                    </div>
                </div>

                <Separator className="opacity-5" />

                {/* Controls */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="log-a" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Amplitude (a)</Label>
                            <Input id="log-a" type="number" className="h-7 w-16 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.a} onChange={(e) => setCoeffs(prev => ({ ...prev, a: parseFloat(e.target.value) || 0 }))} step={0.1} />
                        </div>
                        <Slider value={[coeffs.a]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, a: value[0] }))} min={-5} max={5} step={0.1} className="py-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="log-b" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Base (b)</Label>
                            <Input id="log-b" type="number" className="h-7 w-16 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.b} onChange={(e) => setCoeffs(prev => ({ ...prev, b: parseFloat(e.target.value) || 1.1 }))} step={0.1} />
                        </div>
                        <Slider value={[coeffs.b]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, b: value[0] }))} min={1.1} max={10} step={0.1} className="py-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="log-h" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Shift H</Label>
                                <Input id="log-h" type="number" className="h-7 w-14 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.h} onChange={(e) => setCoeffs(prev => ({ ...prev, h: parseFloat(e.target.value) || 0 }))} step={0.5} />
                            </div>
                            <Slider value={[coeffs.h]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, h: value[0] }))} min={-10} max={10} step={0.5} className="py-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="log-k" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Shift K</Label>
                                <Input id="log-k" type="number" className="h-7 w-14 text-[10px] font-mono bg-black/50 border-white/5 text-blue-100" value={coeffs.k} onChange={(e) => setCoeffs(prev => ({ ...prev, k: parseFloat(e.target.value) || 0 }))} step={0.5} />
                            </div>
                            <Slider value={[coeffs.k]} onValueChange={(value) => setCoeffs(prev => ({ ...prev, k: value[0] }))} min={-10} max={10} step={0.5} className="py-2" />
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
                        Execute Analytics
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

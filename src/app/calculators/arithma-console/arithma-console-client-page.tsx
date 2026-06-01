'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { calculateDerivative, calculateIntegral, convertCoordinates } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { spcs2011Data } from '@/lib/spcs-2011';
import type { CalculateDerivativeOutput, CalculateIntegralOutput } from '@/types/ai';
import { 
    Loader2, 
    Terminal as TerminalIcon, 
    Activity, 
    Database, 
    ShieldCheck, 
    Calculator, 
    Globe, 
    BrainCircuit, 
    Sigma,
    Map
} from 'lucide-react';

type ConsoleMode = 'DERIVATIVE' | 'INTEGRAL' | 'INVERSE' | 'SPCS';

const ArithmaConsoleClientPage = () => {
    const { toast } = useToast();
    const [mode, setMode] = useState<ConsoleMode>('DERIVATIVE');
    const [isLoading, setIsLoading] = useState(false);
    
    const [unitSystem, setUnitSystem] = useState<'ft-us' | 'm'>('ft-us');

    const [calcFn, setCalcFn] = useState("x^3 + 2x^2 - 5");
    const [calcVar, setCalcVar] = useState("x");
    const [calcResult, setCalcResult] = useState<CalculateDerivativeOutput | null>(null);

    const [intFn, setIntFn] = useState("x^2 + 3x");
    const [intVar, setIntVar] = useState("x");
    const [intLower, setIntLower] = useState("");
    const [intUpper, setIntUpper] = useState("");
    const [intResult, setIntResult] = useState<CalculateIntegralOutput | null>(null);

    const [p1N, setP1N] = useState("5000.00");
    const [p1E, setP1E] = useState("5000.00");
    const [p2N, setP2N] = useState("5100.00");
    const [p2E, setP2E] = useState("5100.00");
    const [inverseResult, setInverseResult] = useState<{ distance: number, azimuth: number } | null>(null);

    const [selectedState, setSelectedState] = useState('CA');
    const [selectedZone, setSelectedZone] = useState('0403');
    const [gridN, setGridN] = useState("2062331.42");
    const [gridE, setGridE] = useState("656372.93");
    const [spcsResult, setSpcsResult] = useState<{ lat: number, lon: number } | null>(null);

    const availableZones = useMemo(() => {
        return spcs2011Data.find(s => s.stateCode === selectedState)?.zones || [];
    }, [selectedState]);

    const currentZoneName = useMemo(() => {
        return availableZones.find(z => z.fipsCode === selectedZone)?.zoneName || 'Unknown';
    }, [selectedZone, availableZones]);

    const handleExecute = async () => {
        setIsLoading(true);
        try {
            if (mode === 'DERIVATIVE') {
                setCalcResult(null);
                const res = await calculateDerivative({ expression: calcFn, variable: calcVar });
                setCalcResult(res);
            } else if (mode === 'INTEGRAL') {
                setIntResult(null);
                const res = await calculateIntegral({ 
                    expression: intFn, 
                    variable: intVar,
                    lowerBound: intLower || undefined,
                    upperBound: intUpper || undefined
                });
                setIntResult(res);
            } else if (mode === 'INVERSE') {
                setInverseResult(null);
                const dN = parseFloat(p2N) - parseFloat(p1N);
                const dE = parseFloat(p2E) - parseFloat(p1E);
                const dist = Math.sqrt(dN * dN + dE * dE);
                let az = Math.atan2(dE, dN) * (180 / Math.PI);
                if (az < 0) az += 360;
                setInverseResult({ distance: dist, azimuth: az });
            } else if (mode === 'SPCS') {
                setSpcsResult(null);
                const z = availableZones.find(zone => zone.fipsCode === selectedZone);
                if (!z) throw new Error("Target zone configuration not found.");
                
                const sourceProj = unitSystem === 'm' ? z.proj4Meters : z.proj4SurveyFeet;
                const targetProj = 'EPSG:4326'; 

                const pts = [{ id: 'P1', x: parseFloat(gridE), y: parseFloat(gridN) }];
                const convResults = await convertCoordinates(pts, sourceProj, targetProj);
                
                if (convResults && convResults.length > 0) {
                    setSpcsResult({ lat: convResults[0].y, lon: convResults[0].x });
                } else {
                    throw new Error("Geodetic engine returned no results.");
                }
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'System Error',
                description: error.message || 'The command sequence could not be completed.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderInputs = () => {
        const labelStyle = "text-[10px] uppercase text-blue-400/70 font-black tracking-widest mb-1 block";
        const inputStyle = "bg-black/50 text-blue-100 border-blue-500/20 h-9 font-mono text-xs";
        
        switch (mode) {
            case 'DERIVATIVE':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelStyle}>Target f(x)</label>
                            <Input value={calcFn} onChange={(e) => setCalcFn(e.target.value)} className={inputStyle} />
                        </div>
                        <div>
                            <label className={labelStyle}>Variable</label>
                            <Input value={calcVar} onChange={(e) => setCalcVar(e.target.value)} className={cn(inputStyle, "w-24")} />
                        </div>
                    </div>
                );
            case 'INTEGRAL':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelStyle}>Target ∫ f(x)</label>
                            <Input value={intFn} onChange={(e) => setIntFn(e.target.value)} className={inputStyle} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className={labelStyle}>Var</label>
                                <Input value={intVar} onChange={(e) => setIntVar(e.target.value)} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Lower</label>
                                <Input value={intLower} onChange={(e) => setIntLower(e.target.value)} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Upper</label>
                                <Input value={intUpper} onChange={(e) => setIntUpper(e.target.value)} className={inputStyle} />
                            </div>
                        </div>
                    </div>
                );
            case 'INVERSE':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelStyle}>P1 Northing</label>
                                <Input value={p1N} onChange={(e) => setP1N(e.target.value)} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>P1 Easting</label>
                                <Input value={p1E} onChange={(e) => setP1E(e.target.value)} className={inputStyle} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelStyle}>P2 Northing</label>
                                <Input value={p2N} onChange={(e) => setP2N(e.target.value)} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>P2 Easting</label>
                                <Input value={p2E} onChange={(e) => setP2E(e.target.value)} className={inputStyle} />
                            </div>
                        </div>
                    </div>
                );
            case 'SPCS':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelStyle}>Unit System</label>
                            <Select value={unitSystem} onValueChange={(v: any) => setUnitSystem(v)}>
                                <SelectTrigger className={cn(inputStyle, "font-bold uppercase h-9")}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-blue-500/20 text-blue-100">
                                    <SelectItem value="ft-us">Survey Feet</SelectItem>
                                    <SelectItem value="m">Meters</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className={labelStyle}>State</label>
                            <Select value={selectedState} onValueChange={v => { setSelectedState(v); setSelectedZone(spcs2011Data.find(s => s.stateCode === v)?.zones[0].fipsCode || ''); }}>
                                <SelectTrigger className={cn(inputStyle, "font-bold uppercase h-9")}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-blue-500/20 text-blue-100 max-h-60">
                                    {spcs2011Data.map(s => <SelectItem key={s.stateCode} value={s.stateCode}>{s.stateName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className={labelStyle}>Zone</label>
                            <Select value={selectedZone} onValueChange={setSelectedZone}>
                                <SelectTrigger className={cn(inputStyle, "font-bold uppercase h-9")}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-blue-500/20 text-blue-100">
                                    {availableZones.map(z => <SelectItem key={z.fipsCode} value={z.fipsCode}>{z.zoneName} ({z.fipsCode})</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelStyle}>Grid Northing</label>
                                <Input value={gridN} onChange={(e) => setGridN(e.target.value)} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Grid Easting</label>
                                <Input value={gridE} onChange={(e) => setGridE(e.target.value)} className={inputStyle} />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#020617] font-mono text-blue-400 overflow-hidden">
            {/* 1. STATUS BAR */}
            <div className="h-8 flex items-center justify-between px-4 bg-slate-950 border-b border-blue-500/20 text-[10px] uppercase tracking-[0.2em] font-black shrink-0">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 text-blue-500" /> System: Nom</span>
                    <span className="flex items-center gap-1.5 text-blue-400/50"><Database className="h-3 w-3" /> Core: Active</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-blue-400/30">Mode: {mode}</span>
                    <span className="flex items-center gap-1.5 text-amber-400"><ShieldCheck className="h-3 w-3" /> Secure Link</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden min-h-0">
                {/* 2. OPERATIONAL SIDEBAR */}
                <aside className="w-[320px] border-r border-blue-500/20 p-6 space-y-8 overflow-y-auto bg-[#020617] shrink-0 no-scrollbar">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-blue-500/10">
                            <TerminalIcon className="h-4 w-4 text-blue-500" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-blue-100">Command Input</h2>
                        </div>
                        {renderInputs()}
                    </div>

                    <Button 
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-widest h-11 transition-all"
                        onClick={handleExecute}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Execute Sequence
                    </Button>

                    <Separator className="bg-blue-500/10"/>

                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase text-blue-400/40 tracking-widest">Active Modules</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { id: 'DERIVATIVE', icon: <BrainCircuit className="h-4 w-4" />, label: 'Derivative AI' },
                                { id: 'INTEGRAL', icon: <Sigma className="h-4 w-4" />, label: 'Integral AI' },
                                { id: 'INVERSE', icon: <Calculator className="h-4 w-4" />, label: 'Inverse Vector' },
                                { id: 'SPCS', icon: <Map className="h-4 w-4" />, label: 'SPCS Geodetic' }
                            ].map(btn => (
                                <button key={btn.id} onClick={() => setMode(btn.id as any)} className={cn("flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest rounded border transition-all text-left", mode === btn.id ? "bg-blue-500/10 border-blue-500 text-blue-100" : "border-blue-500/10 text-blue-400/40 hover:border-blue-500/30")}>
                                    {btn.icon} {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* 3. MONITOR DISPLAY */}
                <main className="relative flex-1 bg-black p-8 overflow-y-auto min-w-0 no-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-8 pb-12">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-blue-400/30 text-[10px] uppercase tracking-[0.3em] font-black">
                                <span>Output Monitor</span>
                                <span>Status: Receiving</span>
                            </div>
                            <Separator className="bg-blue-500/20" />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase text-blue-400/40 font-black tracking-widest">Sequence Log:</p>
                                <div className="space-y-1 text-xs text-blue-200/80 font-bold leading-relaxed">
                                    <p className="opacity-40">{`> Booting ${mode} processing engine...`}</p>
                                    {mode === 'SPCS' && <p className="text-blue-300/80">{`> Initializing NAD83 Projection for ${selectedState} Zone ${currentZoneName}`}</p>}
                                    {isLoading && (
                                        <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded animate-pulse mt-4">
                                            <Loader2 className="h-5 w-5 animate-spin text-blue-400"/>
                                            <span className="text-xs uppercase font-black tracking-widest text-blue-300">Processing Data Sequence...</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RESULTS DISPLAY */}
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                {mode === 'DERIVATIVE' && calcResult && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded">
                                                <p className="text-[10px] uppercase text-blue-400/50 mb-2 font-black">AI Output:</p>
                                                <p className="text-base font-black text-blue-100">{calcResult.derivative}</p>
                                            </div>
                                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded">
                                                <p className="text-[10px] uppercase text-blue-400/50 mb-2 font-black">Simplified Form:</p>
                                                <p className="text-base font-black text-blue-100">{calcResult.simplified}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-black/50 text-blue-300 text-xs rounded border border-blue-500/10 break-all leading-loose">
                                            <span className="text-[10px] uppercase text-blue-400/30 block mb-2 font-black">LaTeX Render:</span>
                                            {calcResult.latex}
                                        </div>
                                    </div>
                                )}

                                {mode === 'INTEGRAL' && intResult && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded">
                                                <p className="text-[10px] uppercase text-blue-400/50 mb-2 font-black">Integrated Result:</p>
                                                <p className="text-base font-black text-blue-100">{intResult.integral}</p>
                                            </div>
                                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded">
                                                <p className="text-[10px] uppercase text-blue-400/50 mb-2 font-black">Definite Value:</p>
                                                <p className="text-base font-black text-blue-100">{intResult.value !== undefined ? intResult.value.toFixed(6) : 'Indefinite'}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-black/50 text-blue-300 text-xs rounded border border-blue-500/10 break-all leading-loose">
                                            <span className="text-[10px] uppercase text-blue-400/30 block mb-2 font-black">LaTeX Render:</span>
                                            {intResult.latex}
                                        </div>
                                    </div>
                                )}

                                {mode === 'INVERSE' && inverseResult && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded text-center">
                                            <p className="text-[10px] uppercase text-blue-400/50 font-black mb-2">Distance</p>
                                            <p className="text-2xl font-black text-blue-100 tracking-tighter">{inverseResult.distance.toFixed(4)}</p>
                                        </div>
                                        <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded text-center">
                                            <p className="text-[10px] uppercase text-blue-400/50 font-black mb-2">Azimuth</p>
                                            <p className="text-2xl font-black text-blue-100 tracking-tighter">{inverseResult.azimuth.toFixed(6)}°</p>
                                        </div>
                                    </div>
                                )}

                                {mode === 'SPCS' && spcsResult && (
                                    <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded space-y-6">
                                        <div className="flex items-center justify-between border-b border-blue-500/10 pb-4">
                                            <h4 className="text-xs font-black uppercase text-blue-100 tracking-widest">WGS84 Geodetic Output</h4>
                                            <span className="text-[10px] font-bold text-blue-400/50 uppercase">Zone Code: {selectedZone}</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-blue-400/50 uppercase font-black tracking-widest">Latitude</p>
                                                <p className="text-xl font-black text-blue-100">{spcsResult.lat.toFixed(8)}°</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-blue-400/50 uppercase font-black tracking-widest">Longitude</p>
                                                <p className="text-xl font-black text-blue-100">{spcsResult.lon.toFixed(8)}°</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isLoading && !calcResult && !intResult && !inverseResult && !spcsResult && (
                                    <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-blue-500/5 rounded opacity-10">
                                        <TerminalIcon className="h-12 w-12 mb-4 text-blue-500" />
                                        <p className="text-[10px] uppercase font-black tracking-[0.5em]">Standby for Data</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ArithmaConsoleClientPage;

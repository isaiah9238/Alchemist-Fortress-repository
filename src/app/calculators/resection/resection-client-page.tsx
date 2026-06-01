
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, Loader2, Plus, Trash2, AlertCircle, Download } from 'lucide-react';
import { adjustResectionLeastSquares } from '@/app/actions';
import type { ResectionAdjustmentInput, ResectionAdjustmentOutput, KnownPoint, Observation, PointAnalysis } from '@/types/ai';
import ErrorEllipse from '@/components/error-ellipse';
import ResidualsChart from '@/components/ResidualsChart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AzimuthInput, type AzimuthPayload, dmsToDD, quadrantToDD } from '@/components/azimuth-input';

type Unit = 'ft-us' | 'ft' | 'm';

type ClientObservation = {
  id: number;
  to: string;
  angle: AzimuthPayload;
  distance: string;
};

type DiagnosticResult = {
  observationId: string;
  type: 'Angle' | 'Distance';
  misclosure: number;
  status: 'SUSPECT' | 'OK';
};

export default function ResectionClientPage() {
  const { toast } = useToast();

  const [knownPointsData, setKnownPointsData] = useState('G,5000.000,5000.000\nJ,4958.120,5087.032\nK,4890.330,4912.450\nE,5120.000,4850.000');
  const [observations, setObservations] = useState<ClientObservation[]>([
    { id: 1, to: 'G', angle: { mode: 'DD', dd: '15.255119', dms: {d:'',m:'',s:''}, quad:{ns:'N',ew:'E',d:'',m:'',s:''}}, distance: '57.00877' },
    { id: 2, to: 'J', angle: { mode: 'DD', dd: '82.716898', dms: {d:'',m:'',s:''}, quad:{ns:'N',ew:'E',d:'',m:'',s:''}}, distance: '102.85871' },
    { id: 3, to: 'K', angle: { mode: 'DD', dd: '232.923831', dms: {d:'',m:'',s:''}, quad:{ns:'N',ew:'E',d:'',m:'',s:''}}, distance: '90.43040' },
    { id: 4, to: 'E', angle: { mode: 'DD', dd: '322.424593', dms: {d:'',m:'',s:''}, quad:{ns:'N',ew:'E',d:'',m:'',s:''}}, distance: '220.85063' },
  ]);
  
  const [units, setUnits] = useState<Unit>('m');
  const [result, setResult] = useState<(ResectionAdjustmentOutput & { success: true }) | null>(null);
  const [lastDiagnostics, setLastDiagnostics] = useState<DiagnosticResult[] | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const getSelectedUnitLabel = () => {
    switch (units) {
      case 'ft-us': return 'U.S. Survey Feet';
      case 'ft': return 'Intl. Feet';
      case 'm': return 'Meters';
    }
  };
  
  const parseAngle = (payload: AzimuthPayload): number => {
    let bearingDD: number;
    switch (payload.mode) {
        case 'DD': bearingDD = parseFloat(payload.dd); break;
        case 'DMS': bearingDD = dmsToDD(parseInt(payload.dms.d || '0'), parseInt(payload.dms.m || '0'), parseFloat(payload.dms.s || '0')); break;
        case 'Quadrant': bearingDD = quadrantToDD(payload.quad.ns, payload.quad.ew, parseInt(payload.quad.d || '0'), parseInt(payload.quad.m || '0'), parseFloat(payload.quad.s || '0')); break;
        default: throw new Error('Invalid bearing mode.');
    }
    if (isNaN(bearingDD)) throw new Error('Invalid angle input.');
    return bearingDD;
  };

  const handleObservationChange = (id: number, field: keyof Omit<ClientObservation, 'id'>, value: string | AzimuthPayload) => {
    setObservations(prev => prev.map(obs => obs.id === id ? { ...obs, [field]: value } : obs));
    setResult(null);
    setLastDiagnostics(null);
    setHasAttempted(false);
  }

  const addObservation = () => {
      setObservations(prev => [...prev, {
          id: Date.now(),
          to: '',
          angle: { mode: 'DD', dd: '', dms: {d:'',m:'',s:''}, quad:{ns:'N',ew:'E',d:'',m:'',s:''}},
          distance: '',
      }])
  }

  const removeObservation = (id: number) => {
      setObservations(prev => prev.filter(obs => obs.id !== id));
      setResult(null);
      setLastDiagnostics(null);
      setHasAttempted(false);
  }
  
  const handleExportReport = () => {
    if (result) {
        handleExportSuccessReport();
    } else if (lastDiagnostics) {
        handleExportDiagnosticReport();
    } else {
         toast({ variant: 'destructive', title: 'No results to export' });
    }
  };

  const handleExportSuccessReport = () => {
    if (!result) return;
    let report = `RESECTION (LEAST SQUARES) ADJUSTMENT REPORT\n`;
    report += `=============================================\n`;
    report += `Date: ${new Date().toLocaleString()}\n\n`;
    report += `ADJUSTED SETUP COORDINATES\n--------------------------\n`;
    report += `Northing (Y): ${result.northing.toFixed(4)}\nEasting (X):  ${result.easting.toFixed(4)}\n\n`;
    report += `ADJUSTMENT STATISTICS\n---------------------\n`;
    if (result.redundancy !== undefined) report += `Redundancy: ${result.redundancy}\n`;
    if (result.sigma0 !== undefined) report += `Std. Dev. of Unit Weight (Sigma-0): ${result.sigma0.toFixed(5)}\n`;
    if (result.stdY !== undefined) report += `Std. Dev. Northing (Y): ${result.stdY.toFixed(4)}\n`;
    if (result.stdX !== undefined) report += `Std. Dev. Easting (X): ${result.stdX.toFixed(4)}\n\n`;
    report += `INPUT OBSERVATIONS\n--------------------\n`;
    report += `Known Points:\n${knownPointsData}\n\nObservations from Setup:\n`;
    observations.forEach(o => {
        let line = `- To: ${o.to}`;
        if (o.angle.dd) line += `, Angle: ${o.angle.dd}°`;
        if (o.distance) line += `, Distance: ${o.distance}`;
        report += `${line}\n`;
    });
    report += `\n`;
    if (result.pointAnalysis && result.pointAnalysis.length > 0) {
        report += `RESIDUAL ANALYSIS\n-----------------\n`;
        report += `Observation          | Type     | Residual     | Std. Residual | Outlier\n`;
        report += `---------------------+----------+--------------+---------------+--------\n`;
        result.pointAnalysis.forEach(p => {
            const residualStr = p.type === 'Angle' ? `${p.residual.toFixed(1)}"` : p.residual.toFixed(4);
            report += `${p.observationId.padEnd(20)} | ${p.type.padEnd(8)} | ${residualStr.padStart(12)} | ${(p.standardizedResidual ?? 0).toFixed(3).padStart(13)} | ${p.isOutlier ? 'YES' : 'No'}\n`;
        });
         report += `\n${result.summary}\n`;
    }
    downloadReport(report, "Resection-Success-Report.txt");
  }

  const handleExportDiagnosticReport = () => {
    if (!lastDiagnostics) return;
    let report = `RESECTION ADJUSTMENT - DIAGNOSTIC REPORT\n`;
    report += `=========================================\n`;
    report += `Date: ${new Date().toLocaleString()}\n`;
    report += `Status: Adjustment Failed to Converge\n\n`;
    report += `INITIAL MISCLOSURES (based on average coordinate guess):\n`;
    report += `----------------------------------------------------------\n`;
    report += `Observation          | Type     | Misclosure   | Status\n`;
    report += `---------------------+----------+--------------+--------\n`;
    lastDiagnostics.forEach(d => {
        const misclosureStr = d.type === 'Angle' ? `${d.misclosure.toFixed(1)}"` : d.misclosure.toFixed(4);
        report += `${d.observationId.padEnd(20)} | ${d.type.padEnd(8)} | ${misclosureStr.padStart(12)} | ${d.status}\n`;
    });
     report += `\nThis report indicates the initial 'tension' in your measurements. A 'SUSPECT' status suggests a significant difference between the measured value and the geometrically expected value. Review suspect measurements for blunders.\n`;
    downloadReport(report, "Resection-Diagnostic-Report.txt");
  }
  
  const downloadReport = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const calculateResection = async (obs: ClientObservation[], knownPtsData: string) => {
    setIsAdjusting(true);
    setHasAttempted(true);
    setResult(null);
    setLastDiagnostics(null);

    try {
      const knownPoints: KnownPoint[] = knownPtsData.trim().split('\n').map((line, i) => {
        const parts = line.split(/[,\s]+/).filter(Boolean);
        if (parts.length < 3) throw new Error(`Invalid known point format on line ${i + 1}. Expected "Name,N,E"`);
        const name = parts[0];
        const y = parseFloat(parts[1]);
        const x = parseFloat(parts[2]);
        if (isNaN(y) || isNaN(x)) throw new Error(`Invalid coordinate on line ${i + 1}`);
        return { name, y, x };
      });

      const formattedObservations: Observation[] = obs
        .map(o => {
            const angleDD = parseAngle(o.angle);
            const distance = parseFloat(o.distance);
            
            const newObs: Observation = { to: o.to };
            if (!isNaN(angleDD)) newObs.angle = angleDD;
            if (!isNaN(distance)) newObs.distance = distance;
            
            if (newObs.angle === undefined && newObs.distance === undefined) return null;
            
            return newObs;
        })
        .filter((o): o is Observation => o !== null);

      if (knownPoints.length < 2) throw new Error('At least two known points are required.');
      if (formattedObservations.length < 3) throw new Error('At least three total measurements are required.');

      const res = await adjustResectionLeastSquares({ knownPoints, observations: formattedObservations });
      
      if (res.success) {
          setResult(res);
          toast({ title: "Adjustment Successful", description: "The resection was calculated successfully." });
      } else {
          setLastDiagnostics(res.diagnostics);
          toast({ variant: 'destructive', title: 'Adjustment Failed', description: res.summary || "Could not converge on a solution." });
      }

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Calculation Failed', description: error.message || "An unexpected error occurred." });
    } finally {
      setIsAdjusting(false);
    }
  };
  
  const worstOutlier = useMemo(() => {
    if (!result || !result.pointAnalysis || result.pointAnalysis.length === 0) return null;
    const outliers = result.pointAnalysis.filter(p => p.isOutlier);
    if (outliers.length === 0) return null;
    return outliers.reduce((max, current) => (current.standardizedResidual ?? 0) > (max.standardizedResidual ?? 0) ? current : max, outliers[0]);
  }, [result]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader><CardTitle>Field Book Data</CardTitle><CardDescription>Enter known points and your observations from the instrument setup.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Units</Label><Select value={units} onValueChange={(v: Unit) => setUnits(v)}><SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ft-us">U.S. Survey Feet</SelectItem><SelectItem value="ft">International Feet</SelectItem><SelectItem value="m">Meters</SelectItem></SelectContent></Select></div>
             <div className="space-y-2"><Label>Known Points (Name,Northing,Easting)</Label><Textarea value={knownPointsData} onChange={(e) => setKnownPointsData(e.target.value)} rows={4} placeholder="G,5000,5000..."/></div>
             <div className="space-y-2">
                <Label>Observations from Setup</Label>
                <div className="border rounded-md"><Table><TableHeader><TableRow><TableHead>To Point</TableHead><TableHead>Angle / Azimuth</TableHead><TableHead>Distance</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader><TableBody>
                            {observations.map(obs => (<TableRow key={obs.id}><TableCell><Input className="h-8" value={obs.to} onChange={e => handleObservationChange(obs.id, 'to', e.target.value)} placeholder="e.g., G" /></TableCell><TableCell className="min-w-[200px]"><AzimuthInput value={obs.angle} onChange={payload => handleObservationChange(obs.id, 'angle', payload)}/></TableCell><TableCell><Input className="h-8" value={obs.distance} onChange={e => handleObservationChange(obs.id, 'distance', e.target.value)} placeholder="e.g., 143.780"/></TableCell><TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeObservation(obs.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button></TableCell></TableRow>))}
                </TableBody></Table></div>
                 <Button variant="outline" size="sm" onClick={addObservation} className="w-full"><Plus className="mr-2 h-4 w-4" /> Add Observation</Button>
            </div>
        </CardContent>
        <CardFooter><Button onClick={() => calculateResection(observations, knownPointsData)} disabled={isAdjusting}>{isAdjusting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}Adjust</Button></CardFooter>
      </Card>
      
       <div className="space-y-8">
            {isAdjusting && <Card><CardContent className="pt-6 flex h-48 items-center justify-center text-center text-muted-foreground"><Loader2 className="mr-4 h-6 w-6 animate-spin" /><p>Adjusting the resection...</p></CardContent></Card>}
            
            {!isAdjusting && result && (
                <Card>
                    <CardHeader><CardTitle>Calculated Position</CardTitle><CardDescription>The least squares adjusted coordinates of your unknown instrument location.</CardDescription></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {worstOutlier && (<Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Potential Blunder Detected</AlertTitle><AlertDescription>{result.summary.includes("re-calculated") ? `Initial adjustment identified '${worstOutlier.observationId}' as an outlier. It was removed and the solution was re-calculated.` : `Observation to "${worstOutlier.observationId}" has the largest residual. Consider removing it and re-running the adjustment.`}</AlertDescription></Alert>)}
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="text-muted-foreground">Adjusted Northing (Y):</span><span className="font-mono text-lg font-bold text-primary">{result.northing.toFixed(4)}</span></div><Separator />
                                <div className="flex justify-between"><span className="text-muted-foreground">Adjusted Easting (X):</span><span className="font-mono text-lg font-bold text-primary">{result.easting.toFixed(4)}</span></div>
                            </div><Separator />
                            <div><h4 className="font-medium text-sm">Adjustment Summary</h4><p className="text-sm text-muted-foreground mt-1">{result.summary}</p></div>
                            {result.sigma0 !== undefined && (<><Separator /><div><h4 className="font-medium text-sm">Adjustment Statistics</h4><div className="text-sm mt-1 space-y-1 text-muted-foreground"><div className="flex justify-between"><span>Redundancy:</span> <span className="font-mono">{result.redundancy}</span></div><div className="flex justify-between"><span>Std. Dev. of Unit Weight (σ₀):</span> <span className="font-mono">{result.sigma0.toFixed(5)}</span></div><div className="flex justify-between"><span>Std. Dev. Easting (σₓ):</span> <span className="font-mono">{result.stdX?.toFixed(4)}</span></div><div className="flex justify-between"><span>Std. Dev. Northing (σᵧ):</span> <span className="font-mono">{result.stdY?.toFixed(4)}</span></div></div></div></>)}
                            {result.covarianceXX !== undefined && result.covarianceYY !== undefined && result.covarianceXY !== undefined && (<><Separator /><div><h4 className="font-medium text-sm">95% Confidence Error Ellipse</h4><div className="mt-2 flex justify-center"><ErrorEllipse sigmaX2={result.covarianceXX} sigmaY2={result.covarianceYY} sigmaXY={result.covarianceXY} /></div><p className="text-xs text-center text-muted-foreground mt-2">The ellipse represents the area where the true point is located with 95% probability.</p></div></>)}
                        </div>
                    </CardContent>
                    {hasAttempted && (<CardFooter><Button onClick={handleExportReport} variant="outline"><Download className="mr-2 h-4 w-4" />Export {result ? 'Success' : 'Diagnostic'} Report</Button></CardFooter>)}
                </Card>
            )}

            {!isAdjusting && lastDiagnostics && (
                <Card>
                    <CardHeader><CardTitle>Diagnostic Report</CardTitle><CardDescription>Adjustment failed. The initial misclosures below may help identify blunders.</CardDescription></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Observation</TableHead><TableHead>Type</TableHead><TableHead>Misclosure</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {lastDiagnostics.map((d, i) => (<TableRow key={i}><TableCell>{d.observationId}</TableCell><TableCell>{d.type}</TableCell><TableCell className="font-mono">{d.type === 'Angle' ? `${d.misclosure.toFixed(1)}"` : d.misclosure.toFixed(4)}</TableCell><TableCell><span className={cn('font-semibold', d.status === 'SUSPECT' ? 'text-destructive' : 'text-primary')}>{d.status}</span></TableCell></TableRow>))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {hasAttempted && (<CardFooter><Button onClick={handleExportReport} variant="outline"><Download className="mr-2 h-4 w-4" />Export {result ? 'Success' : 'Diagnostic'} Report</Button></CardFooter>)}
                </Card>
            )}
            
            {!isAdjusting && !result && !lastDiagnostics && (
                <Card><CardHeader><CardTitle>Calculated Position</CardTitle><CardDescription>The adjusted coordinates of your unknown instrument location.</CardDescription></CardHeader><CardContent><div className="flex h-48 items-center justify-center text-center text-muted-foreground"><p>Enter known points and observations, then click "Adjust".</p></div></CardContent></Card>
            )}

            {result && result.pointAnalysis && result.pointAnalysis.length > 0 && (
                 <ResidualsChart data={result.pointAnalysis} />
            )}
       </div>
    </div>
  );
}

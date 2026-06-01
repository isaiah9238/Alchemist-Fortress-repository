
'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, NetworkAnalysisLabCoeffs } from './types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MathPoint } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

// Helper to convert radians to DMS string
const toDMS = (rad: number): string => {
    let dd = (rad * 180) / Math.PI;
    if (dd < 0) dd += 360;
    dd = Math.abs(dd);
    const deg = Math.floor(dd);
    const minFloat = (dd - deg) * 60;
    const min = Math.floor(minFloat);
    const secFloat = (minFloat - min) * 60;
    const sec = Math.round(secFloat * 100) / 100;
    return `${deg}° ${min.toString().padStart(2, '0')}' ${sec.toFixed(2).padStart(5, '0')}"`;
};

export const NetworkAnalysisLab: React.FC<LabComponentProps<NetworkAnalysisLabCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    
    const { lines, points } = useMemo(() => {
        const parsedPoints: (MathPoint & { name: string })[] = (coeffs.points || '')
            .trim()
            .split('\n')
            .map(line => {
                const parts = line.split(/[,\s]+/);
                if (parts.length < 3) return null;
                const name = parts[0];
                const y = parseFloat(parts[1]); // Northing
                const x = parseFloat(parts[2]); // Easting
                if (isNaN(x) || isNaN(y)) return null;
                return { name, x, y };
            })
            .filter((p): p is MathPoint & { name: string } => p !== null);

        const calculatedLines: { from: string, to: string, distance: number, azimuth: string }[] = [];
        for (let i = 0; i < parsedPoints.length; i++) {
            for (let j = i + 1; j < parsedPoints.length; j++) {
                const p1 = parsedPoints[i];
                const p2 = parsedPoints[j];
                const deltaX = p2.x - p1.x;
                const deltaY = p2.y - p1.y;
                const distance = Math.sqrt(deltaX**2 + deltaY**2);
                const azimuthRad = Math.atan2(deltaX, deltaY);
                calculatedLines.push({
                    from: p1.name,
                    to: p2.name,
                    distance: distance,
                    azimuth: toDMS(azimuthRad)
                });
            }
        }
        return { lines: calculatedLines, points: parsedPoints };
    }, [coeffs.points]);

    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Inverse calculations for every line in the network.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                 <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Network</label>
                </div>
                <Separator />
                 <div className="space-y-2">
                    <Label htmlFor="network-analysis-data-input">Points (Name,Y,X)</Label>
                    <Textarea
                        id="network-analysis-data-input"
                        className="font-mono h-32"
                        value={coeffs.points}
                        onChange={(e) => setCoeffs(prev => ({...prev, points: e.target.value}))}
                        placeholder="H,5000.000,5000.000&#10;G,4935.257,5128.375"
                    />
                </div>
                 {lines.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Line</TableHead>
                                    <TableHead>Distance</TableHead>
                                    <TableHead>Azimuth</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lines.map((line, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{line.from}-{line.to}</TableCell>
                                        <TableCell className="font-mono">{line.distance.toFixed(3)}</TableCell>
                                        <TableCell className="font-mono">{line.azimuth}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-4">No valid points to analyze.</p>
                )}
            </CardContent>
        </Card>
    );
};

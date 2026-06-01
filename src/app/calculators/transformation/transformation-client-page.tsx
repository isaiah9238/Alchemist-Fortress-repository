
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { Point } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Upload, Download, Save } from 'lucide-react';
import { useUser } from '@/firebase';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


type ControlPointPair = {
    local: Point;
    grid: Point;
}

type TransformationParams = {
    translationX: number;
    translationY: number;
    rotation: number; // in degrees
    scale: number;
}

type TransformationResult = {
    params: TransformationParams;
    transformedPoints: Point[];
}

export default function TransformationClientPage() {
    const { toast } = useToast();
    const { user } = useUser();
    
    // Inputs
    const [localPointsData, setLocalPointsData] = useState('G,4935.257,5128.375\nJ,4956.755,4914.259\nK,5053.834,4893.170\nE,5110.888,4970.696');
    const [control1, setControl1] = useState<ControlPointPair>({
        local: { y: 4935.257, x: 5128.375 },
        grid: { y: 197423.44, x: 2792112.56 }
    });
    const [control2, setControl2] = useState<ControlPointPair>({
        local: { y: 4956.755, x: 4914.259 },
        grid: { y: 197478.61, x: 2791902.93 }
    });
    
    const [result, setResult] = useState<TransformationResult | null>(null);
    const localPointsFileInputRef = useRef<HTMLInputElement>(null);
    const [importFormat, setImportFormat] = useState<'pnezd' | 'penzd'>('pnezd');


    const handleControlChange = (
        pair: 'c1' | 'c2', 
        type: 'local' | 'grid', 
        axis: 'y' | 'x', 
        value: string
    ) => {
        const setter = pair === 'c1' ? setControl1 : setControl2;
        setter(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [axis]: parseFloat(value) || 0
            }
        }));
        setResult(null);
    }
    
    const calculateTransformation = () => {
        try {
            // Parse local points to transform
            const lines = localPointsData.trim().split(/\r?\n/).filter(Boolean);
            if(lines.length === 0) throw new Error('No local points provided to transform.');
            
            const localPoints: Point[] = lines.map((line, index) => {
                const parts = line.split(/[,\s]+/).filter(Boolean);
                 if (parts.length < 3) throw new Error(`Invalid local point format on line ${index + 1}. Expected "Name,Northing,Easting".`);
                const name = parts[0];
                const y = parseFloat(parts[1]);
                const x = parseFloat(parts[2]);
                const z = parts.length > 3 ? parseFloat(parts[3]) : undefined;
                const description = parts.length > 4 ? parts.slice(4).join(' ') : undefined;
                if (isNaN(x) || isNaN(y)) throw new Error(`Invalid number in local point on line ${index + 1}`);
                return { name, x, y, z, description };
            });

            // 1. Calculate parameters from control points
            const { local: l1, grid: g1 } = control1;
            const { local: l2, grid: g2 } = control2;
            
            const dy_local = l2.y - l1.y;
            const dx_local = l2.x - l1.x;
            const dist_local = Math.sqrt(dx_local**2 + dy_local**2);
            if (dist_local === 0) throw new Error('Local control points cannot be identical.');
            
            const dy_grid = g2.y - g1.y;
            const dx_grid = g2.x - g1.x;
            const dist_grid = Math.sqrt(dx_grid**2 + dy_grid**2);
            if (dist_grid === 0) throw new Error('Grid control points cannot be identical.');

            // Scale
            const scale = dist_grid / dist_local;

            // Rotation
            const bearing_local = Math.atan2(dx_local, dy_local);
            const bearing_grid = Math.atan2(dx_grid, dy_grid);
            const rotationRad = bearing_grid - bearing_local;
            const rotationDeg = rotationRad * (180 / Math.PI);
            
            // Translation
            const cosR = Math.cos(rotationRad);
            const sinR = Math.sin(rotationRad);
            const rotatedL1_X = l1.x * cosR - l1.y * sinR;
            const rotatedL1_Y = l1.x * sinR + l1.y * cosR;
            const scaledRotatedL1_X = rotatedL1_X * scale;
            const scaledRotatedL1_Y = rotatedL1_Y * scale;

            const translationX = g1.x - scaledRotatedL1_X;
            const translationY = g1.y - scaledRotatedL1_Y;
            
            const params: TransformationParams = { translationX, translationY, rotation: rotationDeg, scale };
            
            // 2. Apply parameters to all local points
            const transformedPoints = localPoints.map(p => {
                const rotatedX = p.x * cosR - p.y * sinR;
                const rotatedY = p.x * sinR + p.y * cosR;
                const scaledX = rotatedX * scale;
                const scaledY = rotatedY * scale;
                const finalX = scaledX + translationX;
                const finalY = scaledY + translationY;

                // Simple vertical transformation: apply translation only. Rotation and scale are not applied to elevation.
                const finalZ = p.z !== undefined && l1.z !== undefined && g1.z !== undefined ? p.z + (g1.z - l1.z) : p.z;
                
                return { ...p, x: finalX, y: finalY, z: finalZ };
            });
            
            setResult({ params, transformedPoints });

        } catch (e: any) {
            toast({
                variant: 'destructive',
                title: 'Calculation Error',
                description: e.message || 'Please check your input data.',
            });
            setResult(null);
        }
    }
    
    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            const text = e.target?.result;
            if (typeof text !== 'string') return;
            try {
                let lines = text.trim().split(/\r?\n/).filter(Boolean);
                if(lines.length === 0) throw new Error("File is empty.");

                // Check for header row
                const firstLineParts = lines[0].split(/[,\s]+/);
                if (firstLineParts.length >= 3 && (isNaN(parseFloat(firstLineParts[1])) || isNaN(parseFloat(firstLineParts[2])))) {
                    lines = lines.slice(1); // Skip header
                }

                if(lines.length === 0) throw new Error("File contains only a header row.");
                
                const parsedPoints: Point[] = [];
                const formattedPointStrings: string[] = [];

                lines.forEach((line, index) => {
                    const parts = line.split(/[,]\s*/); // Split by comma and optional whitespace
                     if (parts.length < 3) throw new Error(`Invalid format on line ${index + 1}. Expected Name,Y,X or Name,X,Y`);
                    
                    const name = parts[0].trim();
                    const val1 = parseFloat(parts[1]);
                    const val2 = parseFloat(parts[2]);
                    
                    const northing = importFormat === 'pnezd' ? val1 : val2;
                    const easting = importFormat === 'pnezd' ? val2 : val1;
                    
                    if (isNaN(northing) || isNaN(easting)) throw new Error(`Invalid number on line ${index + 1}.`);
                    
                    const point: Point = { name, y: northing, x: easting };
                    
                    if (parts.length > 3 && parts[3].trim()) {
                        const elevation = parseFloat(parts[3]);
                        if (!isNaN(elevation)) {
                           point.z = elevation;
                        }
                    }

                    if(parts.length > 4 && parts[4].trim()) {
                        const description = parts.slice(4).join(',').trim();
                        point.description = description;
                    }
                    parsedPoints.push(point);
                    // Always store in PNEZD format in the textarea
                    formattedPointStrings.push([name, northing.toFixed(4), easting.toFixed(4), point.z?.toFixed(4), point.description].filter(p => p !== undefined).join(','));
                });

                if (parsedPoints.length >= 2) {
                    const p1 = parsedPoints[0];
                    const p2 = parsedPoints[1];
                    setControl1(prev => ({ ...prev, local: { y: p1.y, x: p1.x, z: p1.z }}));
                    setControl2(prev => ({ ...prev, local: { y: p2.y, x: p2.x, z: p2.z }}));
                    toast({ title: "Control Points Updated", description: `Auto-filled local control points using the first two points from your file.` });
                }
                
                setLocalPointsData(formattedPointStrings.join('\n'));
                toast({ title: "Import Successful", description: `${lines.length} local points loaded.` });

            } catch (error: any) {
                toast({ variant: 'destructive', title: "Import Failed", description: error.message });
            } finally {
                 if (localPointsFileInputRef.current) {
                    localPointsFileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

    const handleExport = () => {
        if (!result) return;
        const header = "PointName,GridNorthing,GridEasting,GridElevation,Description\n";
        const csvContent = result.transformedPoints.map(p => {
            const elevation = p.z !== undefined ? p.z.toFixed(4) : '';
            const description = p.description || '';
            return `"${p.name || ''}",${p.y.toFixed(4)},${p.x.toFixed(4)},${elevation},"${description}"`
        }).join('\n');
        
        const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "transformed_points.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Transformation Inputs</CardTitle>
                    <CardDescription>Define the local points and control points to calculate the transformation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="local-points">Local Points</Label>
                        <Textarea 
                            id="local-points"
                            value={localPointsData}
                            onChange={(e) => setLocalPointsData(e.target.value)}
                            rows={5}
                            placeholder="P1,5000,5000,100.0,Corner\nP2,5100,5000\n..."
                        />
                         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
                            <div className="space-y-2">
                                <Label>Import Format</Label>
                                <RadioGroup value={importFormat} onValueChange={(v: 'pnezd' | 'penzd') => setImportFormat(v)} className="flex gap-4">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pnezd" id="pnezd" />
                                    <Label htmlFor="pnezd" className="text-xs">P,N,E,Z,D (Y,X)</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="penzd" id="penzd" />
                                    <Label htmlFor="penzd" className="text-xs">P,E,N,Z,D (X,Y)</Label>
                                  </div>
                                </RadioGroup>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => localPointsFileInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4"/>
                                Import Points
                            </Button>
                            <input
                                type="file"
                                ref={localPointsFileInputRef}
                                onChange={handleFileImport}
                                className="hidden"
                                accept=".csv,.txt"
                            />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Control Points</Label>
                        <p className="text-xs text-muted-foreground">Import Local Points or manually input them. Manually input two Grid Points.</p>
                    </div>
                    <div className="space-y-4 rounded-md border p-4">
                        <h3 className="font-semibold">Point No. 1</h3>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Local N</Label>
                                <Input type="number" value={control1.local.y} onChange={e => handleControlChange('c1', 'local', 'y', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>Local E</Label>
                                <Input type="number" value={control1.local.x} onChange={e => handleControlChange('c1', 'local', 'x', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Grid N</Label>
                                <Input type="number" value={control1.grid.y} onChange={e => handleControlChange('c1', 'grid', 'y', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>Grid E</Label>
                                <Input type="number" value={control1.grid.x} onChange={e => handleControlChange('c1', 'grid', 'x', e.target.value)} />
                            </div>
                        </div>
                    </div>
                     <div className="space-y-4 rounded-md border p-4">
                        <h3 className="font-semibold">Point No. 2</h3>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Local N</Label>
                                <Input type="number" value={control2.local.y} onChange={e => handleControlChange('c2', 'local', 'y', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>Local E</Label>
                                <Input type="number" value={control2.local.x} onChange={e => handleControlChange('c2', 'local', 'x', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Grid N</Label>
                                <Input type="number" value={control2.grid.y} onChange={e => handleControlChange('c2', 'grid', 'y', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>Grid E</Label>
                                <Input type="number" value={control2.grid.x} onChange={e => handleControlChange('c2', 'grid', 'x', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={calculateTransformation}>Calculate Transformation</Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Transformation Results</CardTitle>
                    <CardDescription>The calculated parameters and transformed coordinates.</CardDescription>
                </CardHeader>
                <CardContent>
                    {result ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Calculated Parameters</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Translation X:</span><span className="font-mono">{result.params.translationX.toFixed(4)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Translation Y:</span><span className="font-mono">{result.params.translationY.toFixed(4)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Rotation:</span><span className="font-mono">{result.params.rotation.toFixed(6)}°</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Scale Factor:</span><span className="font-mono">{result.params.scale.toFixed(8)}</span></div>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Transformed Points</h3>
                                    <div className="flex gap-2">
                                        {user && (
                                            <Button variant="outline" size="sm" disabled>
                                                <Save className="mr-2 h-4 w-4"/>
                                                Save
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm" onClick={handleExport}>
                                            <Download className="mr-2 h-4 w-4"/>
                                            Export
                                        </Button>
                                    </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Point</TableHead>
                                                <TableHead>Grid N</TableHead>
                                                <TableHead>Grid E</TableHead>
                                                <TableHead>Grid Elev</TableHead>
                                                <TableHead>Desc</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {result.transformedPoints.map((p, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{p.name || `P${i+1}`}</TableCell>
                                                    <TableCell className="font-mono">{p.y.toFixed(4)}</TableCell>
                                                    <TableCell className="font-mono">{p.x.toFixed(4)}</TableCell>
                                                    <TableCell className="font-mono">{p.z !== undefined ? p.z.toFixed(4) : '-'}</TableCell>
                                                    <TableCell>{p.description || '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            <p>Click "Calculate" to see the results.</p>
                        </div>
                    )}
                </CardContent>
             </Card>
        </div>
    )
}

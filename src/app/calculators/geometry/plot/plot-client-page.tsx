'use client';

import { useState, useEffect, useRef } from 'react';
import type { Point } from '@/types/geometry'; // Fixed tracking alias path
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SingleLinePlotData = {
  point1: Point;
  point2: Point;
};

type AdvancedPlotWrapper = {
  type: 'intersection-bb' | 'intersection-bd' | 'intersection-dd' | 'traverse';
  points: Point[];
};

export default function PlotClientPage() {
    const [plotData, setPlotData] = useState<Point[] | null>(null);
    const [plotType, setPlotType] = useState<string>('traverse');
    const [title, setTitle] = useState('Coordinate Plot');
    const [description, setDescription] = useState("A visual representation of coordinates.");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        try {
            const loopItem = localStorage.getItem('lastLoopPlotData');
            if (loopItem) {
                const parsed = JSON.parse(loopItem);
                
                // Advanced parsing for multi-ray intersection layouts
                if (parsed && typeof parsed === 'object' && parsed.type && Array.isArray(parsed.points)) {
                    setPlotData(parsed.points);
                    setPlotType(parsed.type);
                    setTitle(parsed.type.startsWith('intersection') ? 'Geometric Intersection Canvas' : 'Traverse Loop Plot');
                    setDescription(parsed.type.startsWith('intersection') ? 'Vector projections converging on calculated targets.' : 'A visual representation of the calculated traverse loop.');
                    return;
                }

                // Legacy fallback array
                if (Array.isArray(parsed) && parsed.length > 1) {
                    setPlotData(parsed);
                    // Smart auto-detection fallback: if there are exactly 3 points or 4 points, treat it as an intersection
                    if (parsed.length === 3 || parsed.length === 4) {
                        setPlotType('intersection-bb');
                        setTitle('Geometric Intersection Canvas');
                        setDescription('Vector projections converging on calculated target layout coordinates.');
                    } else {
                        setPlotType('traverse');
                        setTitle('Traverse Loop Plot');
                        setDescription('A visual representation of the calculated traverse loop.');
                    }
                    return;
                }
            }

            // Fallback to single line data
            const lineItem = localStorage.getItem('lastPlotData');
            if (lineItem) {
                const parsedLine: SingleLinePlotData = JSON.parse(lineItem);
                if (parsedLine.point1 && parsedLine.point2) {
                    setPlotData([parsedLine.point1, parsedLine.point2]);
                    setPlotType('line');
                    setTitle('Line Plot');
                    setDescription(`Plot from Point 1 to Point 2.`);
                    return;
                }
            }
        } catch (error) {
            console.error("Failed to read from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (!plotData || plotData.length < 2 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        const { width, height } = rect;

        const northings = plotData.map(p => p.y);
        const eastings = plotData.map(p => p.x);
        const minN = Math.min(...northings);
        const maxN = Math.max(...northings);
        const minE = Math.min(...eastings);
        const maxE = Math.max(...eastings);
        
        const deltaN = maxN - minN;
        const deltaE = maxE - minE;
        const midN = (minN + maxN) / 2;
        const midE = (minE + maxE) / 2;

        const paddingMultiplier = 0.75;
        const scale = (Math.min(width, height) * paddingMultiplier) / (Math.max(deltaN, deltaE) || 1);

        const toScreen = (n: number, e: number) => {
            return {
                x: (width / 2) + (e - midE) * scale,
                y: (height / 2) - (n - midN) * scale
            };
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#000000';
        ctx.fillRect(0, 0, width, height);
        
        const primaryColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '186 100% 50%'})`;
        const foregroundColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '0 0% 98%'})`;
        const cyanColor = '#00e5ff';
        const zincColor = '#52525b';

        ctx.lineWidth = 2;

        // --- DRAW LINES BASED ON STRUCTURAL TYPE ---
        if (plotType.startsWith('intersection')) {
            // For intersections: P1 and P2 are setup baselines. The last points are solutions.
            const screenP1 = toScreen(plotData[0].y, plotData[0].x);
            const screenP2 = toScreen(plotData[1].y, plotData[1].x);
            
            // Draw baseline between control point 1 and 2
            ctx.strokeStyle = zincColor;
            ctx.setLineDash([4, 4]); // Dashed line for control baseline
            ctx.beginPath();
            ctx.moveTo(screenP1.x, screenP1.y);
            ctx.lineTo(screenP2.x, screenP2.y);
            ctx.stroke();
            ctx.setLineDash([]); // Reset to solid lines

            // Draw vector solutions
            ctx.strokeStyle = cyanColor;
            if (plotData.length === 3) {
                // Single convergence point (P3)
                const screenP3 = toScreen(plotData[2].y, plotData[2].x);
                
                ctx.beginPath();
                ctx.moveTo(screenP1.x, screenP1.y);
                ctx.lineTo(screenP3.x, screenP3.y);
                ctx.moveTo(screenP2.x, screenP2.y);
                ctx.lineTo(screenP3.x, screenP3.y);
                ctx.stroke();
            } else if (plotData.length === 4) {
                // Two potential vector solutions (P3 and P4)
                const screenP3 = toScreen(parsedP3Or4Y(plotData[2]), plotData[2].x);
                const screenP4 = toScreen(parsedP3Or4Y(plotData[3]), plotData[3].x);

                ctx.beginPath();
                // Ray sets to solution alpha
                ctx.moveTo(screenP1.x, screenP1.y); ctx.lineTo(screenP3.x, screenP3.y);
                ctx.moveTo(screenP2.x, screenP2.y); ctx.lineTo(screenP3.x, screenP3.y);
                // Ray sets to solution beta
                ctx.moveTo(screenP1.x, screenP1.y); ctx.lineTo(screenP4.x, screenP4.y);
                ctx.moveTo(screenP2.x, screenP2.y); ctx.lineTo(screenP4.x, screenP4.y);
                ctx.stroke();
            }
        } else {
            // Standard continuous chain loop line rendering (Traverse loops)
            ctx.strokeStyle = primaryColor;
            ctx.beginPath();
            const firstPoint = toScreen(plotData[0].y, plotData[0].x);
            ctx.moveTo(firstPoint.x, firstPoint.y);
            for(let i = 1; i < plotData.length; i++) {
                const point = toScreen(plotData[i].y, plotData[i].x);
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
        }

        // --- DRAW POINTS AND TEXT LABELS ---
        ctx.font = 'bold 10px monospace';
        plotData.forEach((p, i) => {
            const screenP = toScreen(p.y, p.x);
            
            // Assign smart point identities
            let labelText = `P${i + 1}`;
            let currentPointColor = primaryColor;
            
            if (plotType.startsWith('intersection')) {
                if (i === 0) { labelText = 'STN_1 (P1)'; currentPointColor = '#ffffff'; }
                else if (i === 1) { labelText = 'STN_2 (P2)'; currentPointColor = '#ffffff'; }
                else if (i === 2) { labelText = 'SOL_ALPHA (P3)'; currentPointColor = cyanColor; }
                else if (i === 3) { labelText = 'SOL_BETA (P4)'; currentPointColor = cyanColor; }
            }

            // Draw target circles
            ctx.fillStyle = '#000000';
            ctx.strokeStyle = currentPointColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenP.x, screenP.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Core dot center
            ctx.fillStyle = currentPointColor;
            ctx.beginPath();
            ctx.arc(screenP.x, screenP.y, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Labels placement
            ctx.fillStyle = foregroundColor;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(` ${labelText}`, screenP.x + 6, screenP.y);
        });

    }, [plotData, plotType]);

    function parsedP3Or4Y(p: Point): number {
        return p.y;
    }

    const hasValidData = plotData && plotData.length > 0;

    return (
        <Card className="bg-black border-zinc-800 text-white font-mono">
            <CardHeader className="border-b border-zinc-900 pb-3">
                <CardTitle className="text-sm tracking-widest text-cyan-400 uppercase">{title}</CardTitle>
                {description && (
                    <CardDescription className="text-xs text-zinc-500 font-mono">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="h-[65vh] w-full p-0 bg-black/50 relative scanline">
                {hasValidData ? (
                   <canvas ref={canvasRef} style={{width: '100%', height: '100%'}} />
                ) : (
                    <div className="flex h-full items-center justify-center text-zinc-600 text-xs uppercase tracking-wider">
                        <p>// ERROR: ACCESS_DENIED - NO_MAP_COORDINATES_BUFFERED</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
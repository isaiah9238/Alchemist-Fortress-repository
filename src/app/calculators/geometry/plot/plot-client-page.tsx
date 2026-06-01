
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Point } from '@/lib/types';
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

type LoopPlotData = Point[];

export default function PlotClientPage() {
    const [plotData, setPlotData] = useState<LoopPlotData | null>(null);
    const [title, setTitle] = useState('Coordinate Plot');
    const [description, setDescription] = useState("A visual representation of coordinates.");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        try {
            // Check for loop data first
            const loopItem = localStorage.getItem('lastLoopPlotData');
            if (loopItem) {
                const parsedLoop = JSON.parse(loopItem);
                if (Array.isArray(parsedLoop) && parsedLoop.length > 1) {
                    setPlotData(parsedLoop);
                    setTitle('Traverse Loop Plot');
                    setDescription('A visual representation of the calculated traverse loop.');
                    return;
                }
            }

            // Fallback to single line data
            const lineItem = localStorage.getItem('lastPlotData');
            if (lineItem) {
                const parsedLine: SingleLinePlotData = JSON.parse(lineItem);
                if (parsedLine.point1 && parsedLine.point2) {
                    setPlotData([parsedLine.point1, parsedLine.point2]);
                    setTitle('Line Plot');
                    setDescription(`Plot from Point 1 (N: ${parsedLine.point1.y.toFixed(2)}, E: ${parsedLine.point1.x.toFixed(2)}) to Point 2 (N: ${parsedLine.point2.y.toFixed(2)}, E: ${parsedLine.point2.x.toFixed(2)})`);
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

        const paddingMultiplier = 0.8;
        const scale = (Math.min(width, height) * paddingMultiplier) / (Math.max(deltaN, deltaE) || 1);

        const toScreen = (n: number, e: number) => {
            return {
                x: (width / 2) + (e - midE) * scale,
                y: (height / 2) - (n - midN) * scale
            };
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
        ctx.fillRect(0,0,width, height);
        
        const primaryColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()})`;
        const foregroundColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()})`;
        const pointColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--primary-foreground').trim()})`;


        // Draw lines
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const firstPoint = toScreen(plotData[0].y, plotData[0].x);
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for(let i = 1; i < plotData.length; i++) {
            const point = toScreen(plotData[i].y, plotData[i].x);
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();

        // Draw points and labels
        ctx.font = '10px sans-serif';
        plotData.forEach((p, i) => {
            const screenP = toScreen(p.y, p.x);
            
            // Point circle
            ctx.fillStyle = pointColor;
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenP.x, screenP.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Label
            ctx.fillStyle = foregroundColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`P${i+1}`, screenP.x, screenP.y - 8);
        });


    }, [plotData]);


    const hasValidData = plotData && plotData.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="h-[60vh] w-full">
                {hasValidData ? (
                   <canvas ref={canvasRef} style={{width: '100%', height: '100%'}} />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <p>
                            No plot data found. Go to a calculator to generate plot data.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


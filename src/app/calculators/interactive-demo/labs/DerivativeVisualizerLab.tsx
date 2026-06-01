'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { ParabolaCoeffs } from './types';

interface DerivativeVisualizerLabProps {
    title: string;
    parabola?: ParabolaCoeffs;
    onClose: () => void;
}

export const DerivativeVisualizerLab: React.FC<DerivativeVisualizerLabProps> = ({ parabola, onClose, title }) => {
    if (!parabola) {
        return (
            <Card className="relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        Calculates the slope of Parabola Lab (01).
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                    Summon a Parabola Lab (01) to visualize its derivative.
                </CardContent>
            </Card>
        );
    }

    const { a, h } = parabola;
    const slope = (2 * a).toFixed(2);
    const intercept = (-2 * a * h).toFixed(2);
    const derivativeEq = `y' = ${slope}x + ${intercept}`;

    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Calculates the slope of Parabola Lab (01).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Derivative Equation:</span>
                    <code className="font-mono text-primary text-sm bg-muted p-2 rounded-md">{derivativeEq}</code>
                </div>
            </CardContent>
        </Card>
    );
};

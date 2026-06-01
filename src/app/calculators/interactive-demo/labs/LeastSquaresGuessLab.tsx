
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { LabComponentProps, LeastSquaresGuessCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const LeastSquaresGuessLab: React.FC<LabComponentProps<LeastSquaresGuessCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Calculates and plots the centroid of control points as an initial guess for a resection.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                 <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Points</label>
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label htmlFor="ls-guess-data-input">Control Points (Name,Y,X)</Label>
                    <Textarea
                        id="ls-guess-data-input"
                        className="font-mono h-48"
                        value={coeffs.points}
                        onChange={(e) => setCoeffs(prev => ({...prev, points: e.target.value}))}
                        placeholder="G,5000.000,5000.000\nJ,4958.120,5087.032"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

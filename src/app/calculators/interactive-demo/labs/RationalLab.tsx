
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { LabComponentProps, RationalCoeffs } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export const RationalLab: React.FC<LabComponentProps<RationalCoeffs>> = ({ title, coeffs, setCoeffs, onClose }) => {
    // This is a static lab for a specific equation.
    return (
        <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}><X className="h-4 w-4" /></Button>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Eq: <span className="font-mono text-xs">y = (x² - 1) / (x + 3)</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
                 <div className="flex items-center space-x-2">
                    <Checkbox id={`show-curve-${title}`} checked={!!coeffs.showCurve} onCheckedChange={(checked) => setCoeffs(prev => ({ ...prev, showCurve: !!checked }))} />
                    <label htmlFor={`show-curve-${title}`} className="text-sm font-medium">Show Curve</label>
                </div>
                <Separator />
                 <p className="text-xs text-muted-foreground">This is a static lab with no adjustable parameters.</p>
            </CardContent>
        </Card>
    );
};

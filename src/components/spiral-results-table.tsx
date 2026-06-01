'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SpiralElements } from '@/lib/spiralMath';
import { Separator } from './ui/separator';

interface Props {
  data: SpiralElements;
  unit: string; // "ft" or "m"
}

export const SpiralResultsTable: React.FC<Props> = ({ data, unit }) => {
  const f = (val: number, precision = 4) => val.toFixed(precision);
  const toDMS = (dd: number): string => {
    dd = Math.abs(dd);
    const deg = Math.floor(dd);
    const minFloat = (dd - deg) * 60;
    const min = Math.floor(minFloat);
    const secFloat = (minFloat - min) * 60;
    const sec = Math.round(secFloat * 100) / 100;
    return `${deg}° ${min.toString().padStart(2, '0')}' ${sec.toFixed(2).padStart(5, '0')}"`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spiral Curve Elements</CardTitle>
        <CardDescription>
          Calculated properties for the symmetric spiral curve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Spiral Angle (&theta;<sub>s</sub>)</TableCell>
              <TableCell className="text-right font-mono">{toDMS(data.thetaS_deg)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">The "Throw" (p)</TableCell>
              <TableCell className="text-right font-mono">{f(data.p)} {unit}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Distance TS to PC' (k)</TableCell>
              <TableCell className="text-right font-mono">{f(data.k)} {unit}</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium text-muted-foreground">External Distance (E<sub>s</sub>)</TableCell>
              <TableCell className="text-right font-mono">{f(data.Es)} {unit}</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium text-muted-foreground">Coord at SC (X<sub>c</sub>, Y<sub>c</sub>)</TableCell>
              <TableCell className="text-right font-mono text-xs">
                ({f(data.xc)}, {f(data.yc)})
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Circular Arc Length (L<sub>c</sub>)</TableCell>
              <TableCell className="text-right font-mono">{f(data.Lc)} {unit}</TableCell>
            </TableRow>
             <TableRow className="bg-muted/50">
              <TableCell className="font-bold">Total Tangent (T<sub>s</sub>)</TableCell>
              <TableCell className="text-right font-mono text-primary font-bold">{f(data.Ts)} {unit}</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell className="font-bold">Total Length (L)</TableCell>
              <TableCell className="text-right font-mono text-primary font-bold">{f(data.totalLength)} {unit}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type LevelRow = {
  id: number;
  station: string;
  bs?: string; // Backsight
  hi?: number; // Height of Instrument
  fs?: string; // Foresight
  elevation?: number;
};

type Unit = 'ft-us' | 'ft' | 'm';

export default function LevelNotesClientPage() {
  const { toast } = useToast();
  const [startElevation, setStartElevation] = useState('100.00');
  const [units, setUnits] = useState<Unit>('ft-us');
  const [rows, setRows] = useState<LevelRow[]>([
    { id: 1, station: 'BM 1', bs: '4.58' },
    { id: 2, station: 'TP 1', bs: '6.12', fs: '3.45' },
    { id: 3, station: 'TP 2', bs: '8.91', fs: '7.89' },
    { id: 4, station: 'BM 2', fs: '5.67' },
  ]);
  
  const getSelectedUnitLabel = () => {
    switch (units) {
      case 'ft-us':
        return 'U.S. Survey Feet';
      case 'ft':
        return 'Intl. Feet';
      case 'm':
        return 'Meters';
    }
  };


  const handleRowChange = (id: number, field: 'station' | 'bs' | 'fs', value: string) => {
    setRows(
      rows.map(row => (row.id === id ? { ...row, [field]: value, hi: undefined, elevation: undefined } : { ...row, hi: undefined, elevation: undefined }))
    );
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), station: '' }]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const calculateElevations = () => {
    const startElev = parseFloat(startElevation);
    if (isNaN(startElev)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Start Elevation',
        description: 'Please enter a valid number for the starting elevation.',
      });
      return;
    }

    const newRows: LevelRow[] = [];
    let lastHI = 0;
    let bsSum = 0;
    let fsSum = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = { ...rows[i] };
      const bs = row.bs ? parseFloat(row.bs) : NaN;
      const fs = row.fs ? parseFloat(row.fs) : NaN;
      
      if (i === 0) {
        if (isNaN(bs)) {
          toast({ variant: 'destructive', title: 'Invalid First Row', description: 'The first row must have a valid Backsight (BS).' });
          return;
        }
        row.elevation = startElev;
        row.hi = startElev + bs;
        lastHI = row.hi;
        bsSum += bs;
      } else {
         if (!isNaN(fs)) {
            if(lastHI === 0) {
                 toast({ variant: 'destructive', title: 'Calculation Error', description: `Row for station "${row.station || i+1}" has a Foresight but no preceding Backsight to establish an instrument height.` });
                 return;
            }
            row.elevation = lastHI - fs;
            fsSum += fs;

            if (!isNaN(bs)) {
                row.hi = row.elevation + bs;
                lastHI = row.hi;
                bsSum += bs;
            } else {
                row.hi = undefined;
            }
        } else if (!isNaN(bs)) {
             toast({ variant: 'destructive', title: 'Invalid Row Order', description: `Station "${row.station || i+1}" has a Backsight but no Foresight from a previous setup.` });
             return;
        } else {
            if(lastHI === 0) {
                 toast({ variant: 'destructive', title: 'Calculation Error', description: `Cannot calculate intermediate shot for "${row.station || i+1}" without an instrument height.` });
                 return;
            }
            row.elevation = undefined;
        }
      }
      newRows.push(row);
    }
    
     const lastRow = newRows[newRows.length - 1];
     if (lastRow && lastRow.elevation !== undefined && !lastRow.bs) {
        const misclosure = (startElev + bsSum) - (lastRow.elevation + fsSum);
         if (Math.abs(misclosure) > 0.005) {
            toast({
                variant: "destructive",
                title: "Checksum Failed",
                description: `Misclosure of ${misclosure.toFixed(4)} exceeds tolerance.`,
            });
         } else {
             toast({ title: 'Calculation Successful', description: `Level loop closed with a misclosure of ${misclosure.toFixed(4)}.` });
         }
     } else {
         toast({title: "Calculation Complete", description: "Elevations have been calculated for the open-ended traverse."})
     }

    setRows(newRows);
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <div className="space-y-2">
              <Label htmlFor="units">Units</Label>
                <Select value={units} onValueChange={(value: Unit) => {setUnits(value); setRows(rows.map(r => ({...r, hi: undefined, elevation: undefined})))}}>
                  <SelectTrigger id="units" className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select units..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ft-us">U.S. Survey Feet</SelectItem>
                    <SelectItem value="ft">International Feet</SelectItem>
                    <SelectItem value="m">Meters</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-elev">Starting Elevation ({getSelectedUnitLabel()})</Label>
              <Input
                id="start-elev"
                type="number"
                value={startElevation}
                onChange={e => setStartElevation(e.target.value)}
                className="w-full sm:w-[200px]"
              />
            </div>
        </div>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[120px]">Station</TableHead>
                <TableHead className="w-[100px] text-center">BS (+)</TableHead>
                <TableHead className="w-[100px] text-center">HI</TableHead>
                <TableHead className="w-[100px] text-center">FS (-)</TableHead>
                <TableHead className="w-[100px] text-center">Elevation</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input
                      value={row.station}
                      onChange={e => handleRowChange(row.id, 'station', e.target.value)}
                      placeholder="Station"
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.bs ?? ''}
                      onChange={e => handleRowChange(row.id, 'bs', e.target.value)}
                      className="h-8 text-center"
                    />
                  </TableCell>
                   <TableCell>
                    <Input
                      readOnly
                      value={row.hi?.toFixed(4) ?? ''}
                      className="h-8 font-mono bg-muted text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.fs ?? ''}
                      onChange={e => handleRowChange(row.id, 'fs', e.target.value)}
                      className="h-8 text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      readOnly
                      value={row.elevation?.toFixed(4) ?? ''}
                      className="h-8 font-mono font-bold text-primary bg-muted text-center"
                    />
                  </TableCell>
                   <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeRow(row.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 sm:flex-row pb-6 justify-center">
        <Button onClick={calculateElevations} className="w-full sm:w-auto">
          Calculate Elevations
        </Button>
        <Button variant="outline" onClick={addRow} className="w-full sm:w-auto">
          Add Row
        </Button>
      </CardFooter>
    </Card>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const UNITS = [
  { label: 'Feet (Decimal)', value: 'ft', factor: 1 },
  { label: 'U.S. Survey Feet', value: 'ft-us', factor: 1.000002 },
  { label: 'Meters', value: 'm', factor: 0.3048 },
  { label: 'Gunter\'s Chains (ch)', value: 'ch', factor: 66 },
  { label: 'Links (lk)', value: 'lk', factor: 0.66 },
  { label: 'Rods / Poles / Perches', value: 'rod', factor: 16.5 },
  { label: 'Varas (Texas)', value: 'vara', factor: 33.333333 / 12 }, // Approx 2.777 ft
];

export default function UnitConverterClientPage() {
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('ch');

  const getResults = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return [];
    
    const fromFactor = UNITS.find(u => u.value === fromUnit)?.factor || 1;
    const valueInFeet = val * fromFactor;

    return UNITS.map(u => ({
      ...u,
      result: valueInFeet / u.factor
    }));
  };

  const results = getResults();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Input Value</CardTitle>
          <CardDescription>Enter the distance and the unit you are converting from.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Value</Label>
            <Input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>From Unit</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {UNITS.map(u => (
                  <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Conversions</CardTitle>
          <CardDescription>Equivalent distances across various surveying systems.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map(r => (
              <div key={r.value} className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">{r.label}:</span>
                <span className="font-mono text-lg font-bold text-primary">
                  {r.result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

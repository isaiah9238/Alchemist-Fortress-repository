
'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export type AzimuthInputMode = 'DD' | 'DMS' | 'Quadrant';

export type AzimuthPayload = {
    mode: AzimuthInputMode,
    dd: string,
    dms: { d: string, m: string, s: string },
    quad: { ns: 'N' | 'S', ew: 'E' | 'W', d: string, m: string, s: string }
}

interface AzimuthInputProps {
    value: AzimuthPayload;
    onChange: (payload: AzimuthPayload) => void;
}

// Helper to convert DMS to Decimal Degrees
export const dmsToDD = (d: number, m: number, s: number): number => {
  if (isNaN(d) || isNaN(m) || isNaN(s)) throw new Error('Invalid DMS values');
  if (m < 0 || m >= 60 || s < 0 || s >= 60) throw new Error('Minutes and Seconds must be between 0 and 59.');
  const sign = d < 0 ? -1 : 1;
  return sign * (Math.abs(d) + m / 60 + s / 3600);
};

// Helper for Quadrant Bearing to DD
export const quadrantToDD = (
  ns: 'N' | 'S',
  ew: 'E' | 'W',
  d: number,
  m: number,
  s: number
): number => {
  if (d < 0 || d > 90) throw new Error("Quadrant degrees must be between 0 and 90.");
  const angle = dmsToDD(d, m, s);
  if (angle > 90) throw new Error("Quadrant angle cannot exceed 90 degrees.");
  
  if (ns === 'N' && ew === 'E') return angle;
  if (ns === 'S' && ew === 'E') return 180 - angle;
  if (ns === 'S' && ew === 'W') return 180 + angle;
  if (ns === 'N' && ew === 'W') return 360 - angle;
  return -1; // Invalid
};


export const AzimuthInput = ({ value, onChange }: AzimuthInputProps) => {

    const handleModeChange = (newMode: AzimuthInputMode) => {
        onChange({ ...value, mode: newMode });
    }

    const handleDdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, dd: e.target.value });
    }

    const handleDmsChange = (part: 'd' | 'm' | 's', val: string) => {
        onChange({ ...value, dms: { ...value.dms, [part]: val } });
    }

    const handleQuadChange = (part: 'ns' | 'ew' | 'd' | 'm' | 's', val: string) => {
        onChange({ ...value, quad: { ...value.quad, [part]: val } });
    }

    const renderInputs = () => {
        switch (value.mode) {
          case 'DMS':
            return (
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  value={value.dms.d}
                  onChange={e => handleDmsChange('d', e.target.value)}
                  placeholder="DD"
                />
                <Input
                  type="number"
                  value={value.dms.m}
                  onChange={e => handleDmsChange('m', e.target.value)}
                  placeholder="MM"
                />
                <Input
                  type="number"
                  step="any"
                  value={value.dms.s}
                  onChange={e => handleDmsChange('s', e.target.value)}
                  placeholder="SS.ss"
                />
              </div>
            );
          case 'Quadrant':
            return (
              <div className="grid grid-cols-5 items-center gap-2">
                <Select value={value.quad.ns} onValueChange={(v: 'N' | 'S') => handleQuadChange('ns', v)}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N">N</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" value={value.quad.d} onChange={e => handleQuadChange('d', e.target.value)} placeholder="DD"/>
                <Input type="number" value={value.quad.m} onChange={e => handleQuadChange('m', e.target.value)} placeholder="MM"/>
                <Input type="number" step="any" value={value.quad.s} onChange={e => handleQuadChange('s', e.target.value)} placeholder="SS.ss"/>
                <Select value={value.quad.ew} onValueChange={(v: 'E' | 'W') => handleQuadChange('ew', v)}>
                   <SelectTrigger><SelectValue/></SelectTrigger>
                   <SelectContent>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="W">W</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            );
          case 'DD':
          default:
            return (
              <Input
                id="azimuth"
                type="number"
                step="any"
                value={value.dd}
                onChange={handleDdChange}
                placeholder="e.g., 45.0"
              />
            );
        }
      };


    return (
        <div className="space-y-2">
             <RadioGroup
                value={value.mode}
                onValueChange={handleModeChange}
                className="flex space-x-4"
            >
                <div className="flex items-center space-x-2">
                <RadioGroupItem value="DD" id={`dd-${value.dms.d}`} />
                <Label htmlFor={`dd-${value.dms.d}`}>DD</Label>
                </div>
                <div className="flex items-center space-x-2">
                <RadioGroupItem value="DMS" id={`dms-${value.dms.d}`} />
                <Label htmlFor={`dms-${value.dms.d}`}>DMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                <RadioGroupItem value="Quadrant" id={`quad-${value.dms.d}`} />
                <Label htmlFor={`quad-${value.dms.d}`}>Quadrant</Label>
                </div>
            </RadioGroup>
            {renderInputs()}
        </div>
    )
}


'use client';

import { useEffect } from 'react';
import proj4 from 'proj4';
import { convertCoordinates } from '@/app/actions';
import { type SPCS2011Zone } from '@/lib/spcs-2011';
import { useToast } from '@/hooks/use-toast';
import { ConversionResult, Point } from '@/types/actions';

interface SpcsHandlerProps {
  inputData: string;
  direction: 'spcs-to-geo' | 'geo-to-spcs';
  unitSystem: 'ft-us' | 'm';
  zone: SPCS2011Zone;
  onConversionComplete: (results: ConversionResult[]) => void;
  onConversionError: (error: Error) => void;
}

export function SpcsHandler({ 
    inputData, 
    direction, 
    unitSystem, 
    zone, 
    onConversionComplete,
    onConversionError
}: SpcsHandlerProps) {

  useEffect(() => {
    const performConversion = async () => {
      try {
        const lines = inputData.trim().split(/\r?\n/).filter(Boolean);
        if (lines.length === 0) throw new Error("Input data cannot be empty.");

        const points: Point[] = lines.map((line, index) => {
            const parts = line.split(/[,\s]+/).filter(Boolean);
            if (parts.length < 2) throw new Error(`Invalid format on line ${index + 1}. Expected "x, y".`);
            const x = parseFloat(parts[0]);
            const y = parseFloat(parts[1]);
            if (isNaN(x) || isNaN(y)) throw new Error(`Invalid number on line ${index + 1}.`);
            return { id: `P${index + 1}`, x, y };
        });

        const isSpcsToGeo = direction === 'spcs-to-geo';
        
        // Use proj4 on the client to get the full def string
        const sourceProj4String = isSpcsToGeo 
            ? (unitSystem === 'm' ? zone.proj4Meters : zone.proj4SurveyFeet)
            : 'EPSG:4326';
        
        const targetProj4String = isSpcsToGeo 
            ? 'EPSG:4326' 
            : (unitSystem === 'm' ? zone.proj4Meters : zone.proj4SurveyFeet);

        // Define projections for proj4 before calling server action
        if (sourceProj4String !== 'EPSG:4326') proj4.defs('SOURCE', sourceProj4String);
        if (targetProj4String !== 'EPSG:4326') proj4.defs('TARGET', targetProj4String);
        
        const conversionResults = await convertCoordinates(points, sourceProj4String, targetProj4String);
        onConversionComplete(conversionResults);
      } catch (e: any) {
        onConversionError(e);
      }
    };
    
    performConversion();
  }, [inputData, direction, unitSystem, zone, onConversionComplete, onConversionError]);

  return null; // This component does not render anything
}

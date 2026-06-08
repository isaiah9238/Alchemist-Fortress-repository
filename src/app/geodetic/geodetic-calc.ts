// src/app/geodetic/geodetic-calc.ts
import proj4 from 'proj4';
import { type SPCS2011Zone } from '@/lib/spcs-2011';

// 1. Factory to resolve projection strings
export const getProjectionDef = (zone: SPCS2011Zone, units: 'ft-us' | 'm') => {
    return units === 'm' ? zone.proj4Meters : zone.proj4SurveyFeet;
};

// 2. Core transformation service
export const transformCoordinates = (
    points: { x: number, y: number }[],
    sourceDef: string,
    targetDef: string
) => {
    return points.map(p => {
        const [x, y] = proj4(sourceDef, targetDef, [p.x, p.y]);
        return { x, y };
    });
};

// 3. Placeholder for the surveying math we will centralize
export const calculateInverse = (n1: number, e1: number, n2: number, e2: number) => {
    const dN = n2 - n1;
    const dE = e2 - e1;
    const distance = Math.sqrt(dN * dN + dE * dE);
    let azimuth = Math.atan2(dE, dN) * (180 / Math.PI);
    if (azimuth < 0) azimuth += 360;
    return { distance, azimuth };
};

import type React from 'react';

export interface LabComponentProps<T> {
    title: string;
    coeffs: T;
    setCoeffs: (updater: React.SetStateAction<T>) => void;
    onClose: () => void;
    onGenerateReport?: () => void;
}

export type MathPoint = { x: number; y: number };

export interface LabFunction {
  isParametric?: false;
  getY: (x: number) => number | null; // null if x is outside domain
  getSlope: (x: number) => number | null; // null if derivative is undefined or x is outside domain
}

export interface ParametricLabFunction {
    isParametric: true;
    getX: (t: number) => number | null;
    getY: (t: number) => number | null;
    getSlopeX: (t: number) => number | null; // dx/dt
    getSlopeY: (t: number) => number | null; // dy/dt
    getTMin: () => number;
    getTMax: () => number;
}

export type ParabolaCoeffs = { a: number; h: number; k: number; showCurve?: boolean };
export type LineCoeffs = { m: number; b: number; showCurve?: boolean };
export type CircleCoeffs = { h: number; k: number; r: number; showCurve?: boolean };
export type ConstantCoeffs = { k: number, showCurve?: boolean };
export type AbsoluteValueCoeffs = { a: number; h: number; k: number; showCurve?: boolean };
export type GreatestIntegerCoeffs = { h: number; k: number; showCurve?: boolean };
export type LogarithmicCoeffs = { a: number; b: number; h: number; k: number; showCurve?: boolean };
export type ExponentialCoeffs = { a: number; b: number; h: number; k: number; showCurve?: boolean };
export type ReciprocalCoeffs = { a: number; h: number; k: number; showCurve?: boolean };
export type SquareRootCoeffs = { a: number; h: number; k: number; showCurve?: boolean };
export type GoniometricType = 'sin' | 'cos';
export type GoniometricCoeffs = { type: GoniometricType; a: number; b: number; h: number; k: number; showCurve?: boolean };
export type CubingCoeffs = { a: number; h: number; k: number; showCurve?: boolean };
export type LogisticCoeffs = { L: number; k: number; x0: number; showCurve?: boolean };
export type TangentialType = 'tan';
export type TangentialCoeffs = { type: TangentialType; a: number; b: number; h: number; k: number; showCurve?: boolean };
export type BellCurveCoeffs = { mu: number; sigma: number; showCurve?: boolean };
export type VectorCoeffs = { x1: number; y1: number; x2: number; y2: number; showCurve?: boolean };
export type TraverseLeg = { id: number; direction: number; distance: number };
export type TraverseState = { start: { x: number; y: number }; legs: TraverseLeg[]; showCurve?: boolean };
export type HorizontalCurveCoeffs = { r: number; delta: number; pcx: number; pcy: number; bearing: number; showCurve?: boolean };
export type VerticalCurveCoeffs = { g1: number; g2: number; L: number; pvcStation: number; pvcElevation: number; showCurve?: boolean };
export type IntegralCoeffs = { a: number; b: number; showCurve?: boolean };
export type ArchimedeanSpiralCoeffs = { growthFactor: number; rotations: number; showCurve?: boolean };
export type RoseStarCoeffs = { a: number; k: number; showCurve?: boolean };
export type StarPolygonCoeffs = { p: number; q: number; radius: number; showCurve?: boolean };
export type SpiralCurveCoeffs = { r: number; ls: number; delta: number; tsx: number; tsy: number; bearing: number; showCurve?: boolean };
export type LissajousCoeffs = { A: number; B: number; a: number; b: number; delta: number; showCurve?: boolean };
export type TrochoidCoeffs = { r: number; d: number; rotations: number; showCurve?: boolean };
export type EpitrochoidCoeffs = { R: number; r: number; d: number; rotations: number; showCurve?: boolean };
export type HypotrochoidCoeffs = { R: number; r: number; d: number; rotations: number; showCurve?: boolean };
export type StereographCoeffs = { radius: number; longitudes: number; latitudes: number; rotX: number; rotY: number; isInverted: boolean; showCurve?: boolean; };
export type FactorialSpiralCoeffs = { minT: number; maxT: number; logScale: boolean; showCurve?: boolean };
export type FactorialPolygonCoeffs = { p: number; k: number; radius: number; showCurve?: boolean };
export type RationalCoeffs = { showCurve?: boolean };
export type PointPlotterCoeffs = { points: string; showCurve?: boolean; };
export type NetworkLabCoeffs = { points: string; showCurve?: boolean; };
export type NetworkAnalysisLabCoeffs = { points: string; showCurve?: boolean; };
export type LeastSquaresGuessCoeffs = { points: string; showCurve?: boolean; };
export type OffsetLabCoeffs = { px: number; py: number; m: number; b: number; showCurve?: boolean; };


// New Lab Types
export type DampedOscillationCoeffs = { amplitude: number; decay: number; frequency: number; showCurve?: boolean };
export type PowerLawCoeffs = { coefficient: number; power: number; showCurve?: boolean };
export type ProjectileMotionCoeffs = { a: number; b: number; c: number; showCurve?: boolean; };
export type BlackbodyRadiationCoeffs = { c1: number; c2: number; showCurve?: boolean };
export type MagneticFieldCoeffs = { mu0: number; I: number; showCurve?: boolean };
export type AtomLabCoeffs = { a: number; showCurve?: boolean };
export type GaussianCoeffs = { A: number; c: number; x0: number; showCurve?: boolean; };
export type GravitationalPotentialCoeffs = { GMm: number; showCurve?: boolean; };
export type MichaelisMentenCoeffs = { Vmax: number; Km: number; showCurve?: boolean; };
export type PhotoelectricEffectCoeffs = { h: number; phi: number; showCurve?: boolean; };
export type RadioactiveDecayCoeffs = { N0: number; lambda: number; showCurve?: boolean; };
export type QuantumTunnelingCoeffs = { A: number; B: number; showCurve?: boolean; };
export type CrystallographyCoeffs = { A: number; B: number; n: number; showCurve?: boolean; };
export type SemiconductorCoeffs = { Is: number; n: number; showCurve?: boolean; };
export type WavePropagationCoeffs = { a: number, b: number, showCurve?: boolean };

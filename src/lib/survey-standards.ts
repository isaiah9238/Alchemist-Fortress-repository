
export interface SurveyStandard {
  id: number;
  surveyType: 'Boundary' | 'Control' | 'Topographic' | 'Construction';
  terrain: 'Urban' | 'Suburban' | 'Rural' | 'Mountainous';
  standardName: string;
  description: string;
  toleranceValue: string; // e.g., "1:15,000"
  justification: string;
}

export const SURVEY_STANDARDS: SurveyStandard[] = [
  {
    id: 1,
    surveyType: 'Boundary',
    terrain: 'Urban',
    standardName: 'ALTA/NSPS Land Title Survey',
    description: 'High-precision surveys for commercial properties.',
    toleranceValue: '1:15,000',
    justification: 'Urban environments demand high accuracy for property lines and improvements.',
  },
  {
    id: 2,
    surveyType: 'Boundary',
    terrain: 'Suburban',
    standardName: 'State Minimum Technical Standards',
    description: 'Standard for residential or less dense commercial areas.',
    toleranceValue: '1:10,000',
    justification: 'Slightly less stringent than urban due to lower density, but still requires high accuracy for legal boundaries.',
  },
  {
    id: 3,
    surveyType: 'Boundary',
    terrain: 'Rural',
    standardName: 'State Minimum Technical Standards',
    description: 'For large tracts of land with fewer improvements.',
    toleranceValue: '1:7,500',
    justification: 'Rural areas allow for slightly lower precision as parcels are larger and land values may be lower.',
  },
   {
    id: 4,
    surveyType: 'Boundary',
    terrain: 'Mountainous',
    standardName: 'BLM Manual of Surveying Instructions',
    description: 'Standard for difficult terrain and remote areas.',
    toleranceValue: '1:5,000',
    justification: 'The difficult terrain makes achieving high precision challenging and costly. Focus is on reliable, repeatable monumentation.',
  },
  {
    id: 5,
    surveyType: 'Control',
    terrain: 'Urban',
    standardName: 'FGCS First-Order Control',
    description: 'Establishes the primary horizontal and vertical control network for large projects.',
    toleranceValue: '1:100,000',
    justification: 'Control networks must be extremely precise as they form the basis for all other survey work.',
  },
   {
    id: 6,
    surveyType: 'Control',
    terrain: 'Rural',
    standardName: 'FGCS Second-Order Control',
    description: 'Secondary control for large-scale mapping or engineering projects.',
    toleranceValue: '1:20,000',
    justification: 'Still requires high accuracy, but less than first-order control which serves as its foundation.',
  },
   {
    id: 7,
    surveyType: 'Topographic',
    terrain: 'Urban',
    standardName: 'General Topographic Survey',
    description: 'Mapping features and elevations for design purposes.',
    toleranceValue: '1:5,000',
    justification: 'Focus is on accurate representation of features, not legal boundaries. Precision can be lower than boundary surveys.',
  },
   {
    id: 8,
    surveyType: 'Construction',
    terrain: 'Urban',
    standardName: 'Construction Layout',
    description: 'Staking out buildings, roads, and utilities.',
    toleranceValue: '1:10,000',
    justification: 'Construction requires high precision to ensure elements are built according to design plans.',
  },
];

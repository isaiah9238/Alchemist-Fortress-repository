
# ArithmaGen Studio: Application Map

This explorer outlines the high-density directory structure of the ArithmaGen engine, specifically focusing on the `src/app` routing and calculation modules.

```text
src/app/
├── actions.ts                  # Centralized Server Actions (AI & Geodetic)
├── layout.tsx                  # Global Studio Layout (Sidebar & Nav)
├── page.tsx                    # Mission Control Dashboard
├── globals.css                 # Semantic Theme Definitions
├── arithma-sketch/             # Real-time Field Drafting Environment
│   ├── page.tsx
│   └── styles.css
├── calculators/                # Specialized Toolkit Sub-directory
│   ├── algebra/                # AI-Powered Calculus & Algebra
│   │   ├── derivative/
│   │   ├── factor-polynomial/
│   │   └── integral/
│   ├── arithma-console/        # Terminal Command-Line Interface
│   ├── curves/                 # Advanced Curve Systems
│   │   ├── compound-curve/
│   │   └── spiral-curve/
│   ├── geodetic/               # Global Reference & Scale Tools
│   │   ├── combined-factor/
│   │   └── spcs-converter/
│   ├── geometry/               # Fundamental COGO & Analytical Routines
│   │   ├── area-by-coordinates/
│   │   ├── curve/              # Simple Horizontal Curves
│   │   ├── curve-diagram/
│   │   ├── intersections/      # Brg-Brg, Brg-Dist, Dist-Dist
│   │   ├── level-notes/        # Vertical Elevation Adjustment
│   │   ├── loop-closure/       # Traverse Error Analysis
│   │   ├── plot/               # Dynamic Visual Stage
│   │   ├── point-offset/
│   │   ├── resection/          # 3-Point Tienstra Method
│   │   └── sideshot/           # Forward Calculations
│   ├── interactive-demo/       # Multi-Lab Visualization Engine
│   │   ├── labs/               # Individual Modular Plotting Components
│   │   └── solver.ts           # Numerical Intersection Engine
│   ├── resection/              # Rigorous Least Squares Resection
│   ├── stakeout/               # Construction & Field Design Reports
│   │   ├── building-corners/
│   │   ├── curve-staking/
│   │   └── slope-staking/
│   ├── storm-water/            # Hydraulics & Hydrology Suite
│   │   ├── mannings-equation/
│   │   ├── nrcs-curve-number/
│   │   └── orifice-equation/
│   ├── tools/                  # General Productivity Utilities
│   │   └── unit-converter/     # Historical Surveying Units
│   └── vertical/               # Roadway Profile Engineering
│       ├── slope-to-horizontal/
│       ├── vertical-curve/
│       └── vertical-curve-diagram/
├── comments/                   # Public Feedback Channel
├── documents/                  # Legal & System Specifications
├── history/                    # Persistent Cloud Session Archive
├── login/                      # Studio Authentication (Sign In)
└── signup/                     # Studio Registration
```

'use client';

import React from 'react';
import type { PointAnalysis } from '@/types/ai';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ResidualsChartProps {
  data: PointAnalysis[];
}

const ResidualsChart: React.FC<ResidualsChartProps> = ({ data }) => {
  const angleResiduals = data.filter((r) => r.type === 'Angle');
  const distanceResiduals = data.filter((r) => r.type === 'Distance');

  const renderBar = (residual: number, isOutlier: boolean, type: 'Angle' | 'Distance') => {
    // Adjust scale for visualization
    const widthPercent =
      type === 'Angle'
        ? Math.min(Math.abs(residual) * 5, 100) // Scale for arc-seconds
        : Math.min(Math.abs(residual) * 2000, 100); // Scale for linear units (e.g., 0.05 * 2000 = 100%)

    return (
      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all',
            isOutlier ? 'bg-destructive' : 'bg-primary'
          )}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Residual Analysis</CardTitle>
        <CardDescription>
          A visual representation of the error for each observation. Outliers are
          highlighted.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {angleResiduals.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Angle Residuals</h4>
            <div className="space-y-4">
              {angleResiduals.map((res) => (
                <div key={res.observationId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-muted-foreground">
                      {res.observationId}
                    </span>
                    <span
                      className={cn(
                        'font-mono',
                        res.isOutlier && 'text-destructive'
                      )}
                    >
                      {res.residual.toFixed(1)}&quot;
                    </span>
                  </div>
                  {renderBar(res.residual, res.isOutlier, 'Angle')}
                </div>
              ))}
            </div>
          </div>
        )}

        {distanceResiduals.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Distance Residuals</h4>
             <div className="space-y-4">
                {distanceResiduals.map((res) => (
                    <div key={res.observationId}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-muted-foreground">
                        {res.observationId}
                        </span>
                        <span
                        className={cn(
                            'font-mono',
                            res.isOutlier && 'text-destructive'
                        )}
                        >
                        {res.residual.toFixed(4)}
                        </span>
                    </div>
                    {renderBar(res.residual, res.isOutlier, 'Distance')}
                    </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResidualsChart;

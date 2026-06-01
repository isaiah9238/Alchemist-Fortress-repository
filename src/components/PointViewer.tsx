import React from 'react';

export interface Point {
  id: string;
  x: number;
  y: number;
  z?: number;
  label?: string;
}

interface PointViewerProps {
  point: Point;
}

export const PointViewer: React.FC<PointViewerProps> = ({ point }) => {
  return (
    <div className="p-4 border rounded shadow-sm bg-white inline-block">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg">{point.label || 'Unnamed Point'}</span>
        <span className="text-xs text-gray-400 ml-2">{point.id}</span>
      </div>
      <div className="grid grid-cols-1 gap-1 text-sm font-mono">
        <div className="flex justify-between"><span className="text-gray-500 mr-4">X:</span> <span>{point.x.toFixed(3)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500 mr-4">Y:</span> <span>{point.y.toFixed(3)}</span></div>
        {point.z !== undefined && (
          <div className="flex justify-between"><span className="text-gray-500 mr-4">Z:</span> <span>{point.z.toFixed(3)}</span></div>
        )}
      </div>
    </div>
  );
};
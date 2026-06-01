import React from 'react';

// Interfaces derived from docs/backend.json

export interface Point {
  id: string;
  x: number;
  y: number;
  z?: number;
  label?: string;
}

export interface Line {
  id: string;
  startPointId: string;
  endPointId: string;
  order: number;
  bearing?: number;
  distance?: number;
  label?: string;
}

export interface Loop {
  id: string;
  name: string;
  lineIds: string[];
  misclosure?: number;
  tolerance?: number;
  label?: string;
}

interface LoopViewerProps {
  loop: Loop;
  lines: Line[];
}

export const LoopViewer: React.FC<LoopViewerProps> = ({ loop, lines }) => {
  // Sort lines by order as defined in the schema
  const sortedLines = [...lines].sort((a, b) => a.order - b.order);

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-2">{loop.name}</h2>
      {loop.label && <p className="text-gray-600 mb-4">{loop.label}</p>}
      
      <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-3 rounded">
        {loop.misclosure !== undefined && (
          <div>
            <span className="font-semibold">Misclosure:</span> {loop.misclosure}
          </div>
        )}
        {loop.tolerance !== undefined && (
          <div>
            <span className="font-semibold">Tolerance:</span> {loop.tolerance}
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">Lines</h3>
      {sortedLines.length > 0 ? (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Order</th>
              <th className="py-2">Label</th>
              <th className="py-2">Bearing</th>
              <th className="py-2">Distance</th>
            </tr>
          </thead>
          <tbody>
            {sortedLines.map((line) => (
              <tr key={line.id} className="border-b last:border-0">
                <td className="py-2">{line.order}</td>
                <td className="py-2">{line.label || '-'}</td>
                <td className="py-2">{line.bearing?.toFixed(4) || '-'}</td>
                <td className="py-2">{line.distance?.toFixed(3) || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No lines defined for this loop.</p>
      )}
    </div>
  );
};
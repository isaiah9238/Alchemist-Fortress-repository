import React from 'react';

export interface FunctionModel {
  id: string;
  name: string;
  description?: string;
  functionText: string;
  result?: string;
}

interface FunctionViewerProps {
  func: FunctionModel;
}

export const FunctionViewer: React.FC<FunctionViewerProps> = ({ func }) => {
  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-2">{func.name}</h2>
      {func.description && <p className="text-gray-600 mb-4">{func.description}</p>}
      
      <div className="mb-4">
        <h3 className="font-semibold mb-1 text-sm text-gray-700 uppercase">Function Definition</h3>
        <code className="block bg-gray-100 p-3 rounded text-sm font-mono border">
          {func.functionText}
        </code>
      </div>

      {func.result && (
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100">
          <span className="font-semibold text-blue-800">Result:</span>
          <span className="ml-2 text-blue-900 font-mono">{func.result}</span>
        </div>
      )}
    </div>
  );
};
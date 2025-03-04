import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export function OTCalculation() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Overtime Calculation</h2>
      </div>
      
      <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-800">Under Development</h3>
        </div>
        <p className="text-yellow-700 mb-3">
          This feature is currently under development and will be available soon.
        </p>
        <p className="text-yellow-700 text-sm">
          The overtime calculation module will allow you to:
        </p>
        <ul className="list-disc list-inside text-yellow-700 text-sm mt-2 space-y-1">
          <li>View your overtime hours</li>
          <li>Calculate overtime pay</li>
          <li>Generate overtime reports</li>
          <li>Submit overtime requests</li>
        </ul>
      </div>
    </div>
  );
}
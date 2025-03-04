import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

export function EmployeeRoster() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Monthly Roster</h2>
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
          The monthly roster module will allow you to:
        </p>
        <ul className="list-disc list-inside text-yellow-700 text-sm mt-2 space-y-1">
          <li>View your monthly shift schedule</li>
          <li>Request shift changes</li>
          <li>View team availability</li>
          <li>Export roster to calendar</li>
        </ul>
      </div>
    </div>
  );
}
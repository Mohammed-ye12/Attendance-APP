import React, { useState } from 'react';
import { Calendar, Search, RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { ShiftEntry, Employee } from '../types';

interface Props {
  entries: ShiftEntry[];
  employees: Record<string, Employee>;
  currentManager: Employee;
  onApprove: (entryId: string) => void;
  onReject: (entryId: string, justification: string) => void;
  onRefresh: () => void;
}

export function ManagersDashboard({ 
  entries, 
  employees, 
  currentManager, 
  onApprove, 
  onReject,
  onRefresh
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rejectingEntryId, setRejectingEntryId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Filter entries based on manager's section and search term
  const filteredEntries = entries.filter(entry => {
    const employee = employees[entry.employeeId];
    if (!employee) return false;

    // Only show entries for employees in the manager's section
    if (currentManager.section && employee.section !== currentManager.section) {
      return false;
    }

    // Apply search term filter
    if (searchTerm && !employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !employee.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Group entries by approval status
  const pendingEntries = filteredEntries.filter(entry => entry.approved === null);
  const approvedEntries = filteredEntries.filter(entry => entry.approved === true);
  const rejectedEntries = filteredEntries.filter(entry => entry.approved === false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const handleApprove = async (entryId: string) => {
    setActionInProgress(entryId);
    await onApprove(entryId);
    setActionInProgress(null);
  };

  const handleReject = async () => {
    if (!rejectingEntryId || !rejectionReason.trim()) return;
    
    setActionInProgress(rejectingEntryId);
    await onReject(rejectingEntryId, rejectionReason);
    setRejectingEntryId(null);
    setRejectionReason('');
    setActionInProgress(null);
  };

  const getShiftTypeLabel = (shiftType: string): string => {
    switch (shiftType) {
      case '1st_shift': return '1st Shift';
      case '2nd_shift': return '2nd Shift';
      case '3rd_shift': return '3rd Shift';
      case 'leave': return 'Leave';
      case 'medical': return 'Medical Leave';
      case 'ot_off_day': return 'OT (Off Day)';
      case 'ot_week_off': return 'OT (Week Off)';
      case 'ot_public_holiday': return 'OT (Public Holiday)';
      case 'other': return 'Other';
      default: return shiftType;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Manager Dashboard
        </h2>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{currentManager.fullName}</span>
            <span className="mx-1">•</span>
            <span>{currentManager.section} Section</span>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-full hover:bg-gray-100 ${isRefreshing ? 'opacity-50' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Pending Approvals</h3>
          
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {pendingEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No pending approvals</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingEntries.map((entry) => {
                  const employee = employees[entry.employeeId];
                  
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.date).toLocaleDateString('default', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employee && (
                          <>
                            <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                            <div className="text-sm text-gray-500">{employee.id}</div>
                          </>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getShiftTypeLabel(entry.shiftType)}
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {entry.otherRemark || '-'}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleApprove(entry.id)}
                          disabled={actionInProgress === entry.id}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                            actionInProgress === entry.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {actionInProgress === entry.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                          )}
                          Approve
                        </button>
                        
                        <button
                          onClick={() => setRejectingEntryId(entry.id)}
                          disabled={actionInProgress === entry.id}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                            actionInProgress === entry.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectingEntryId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Shift Entry</h3>
            
            <div className="mb-4">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Please provide a reason for rejection..."
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setRejectingEntryId(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim() || actionInProgress === rejectingEntryId}
                className={`px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  !rejectionReason.trim() || actionInProgress === rejectingEntryId ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {actionInProgress === rejectingEntryId ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Rejecting...
                  </div>
                ) : (
                  'Confirm Rejection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Approved Entries */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-green-50 px-4 py-2 border-b">
              <h4 className="font-medium text-green-800 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approved Entries
              </h4>
            </div>
            
            <div className="p-4">
              {approvedEntries.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No approved entries</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {approvedEntries.slice(0, 5).map(entry => {
                    const employee = employees[entry.employeeId];
                    
                    return (
                      <li key={entry.id} className="py-2">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {employee?.fullName || entry.employeeId}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getShiftTypeLabel(entry.shiftType)} • {new Date(entry.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-xs text-green-600">
                            {entry.approvedAt ? new Date(entry.approvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          
          {/* Rejected Entries */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-red-50 px-4 py-2 border-b">
              <h4 className="font-medium text-red-800 flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Rejected Entries
              </h4>
            </div>
            
            <div className="p-4">
              {rejectedEntries.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No rejected entries</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {rejectedEntries.slice(0, 5).map(entry => {
                    const employee = employees[entry.employeeId];
                    
                    return (
                      <li key={entry.id} className="py-2">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {employee?.fullName || entry.employeeId}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getShiftTypeLabel(entry.shiftType)} • {new Date(entry.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-xs text-red-600">
                            {entry.approvedAt ? new Date(entry.approvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        {entry.otherRemark && (
                          <p className="text-xs text-gray-600 mt-1 italic">
                            Reason: {entry.otherRemark}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
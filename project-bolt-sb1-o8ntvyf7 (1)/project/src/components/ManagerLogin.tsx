import React, { useState } from 'react';
import { KeyRound, AlertCircle, ChevronDown } from 'lucide-react';
import type { Employee } from '../types';

interface Props {
  onLogin: (managerId: string, password: string) => void;
  managers: Employee[];
}

// Define manager structure with departments and roles
interface ManagerGroup {
  department: string;
  managers: {
    title: string;
    id: string;
    password: string;
  }[];
}

export function ManagerLogin({ onLogin }: Props) {
  const [managerId, setManagerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  // Predefined manager structure with departments, titles, and passwords
  const managerGroups: ManagerGroup[] = [
    {
      department: "Operations Managers",
      managers: [
        { title: "Senior Manager (x1)", id: "OPS-SM1", password: "Ops$enior2025!" },
        { title: "Senior Manager (x2)", id: "OPS-SM2", password: "Ops$enior2@25!" },
        { title: "Berthing Manager", id: "OPS-BM", password: "B3rth!ngM@n2025" },
        { title: "Shift Manager G-A", id: "OPS-SMGA", password: "Sh1ftGA@2025!" },
        { title: "Shift Manager G-B", id: "OPS-SMGB", password: "Sh1ftGB@2025!" },
        { title: "Shift Manager G-C", id: "OPS-SMGC", password: "Sh1ftGC@2025!" },
        { title: "Shift Manager G-D", id: "OPS-SMGD", password: "Sh1ftGD@2025!" }
      ]
    },
    {
      department: "Engineering Managers",
      managers: [
        { title: "Senior Manager (x1)", id: "ENG-SM1", password: "Eng$enior2025!" },
        { title: "QC Manager", id: "ENG-QC", password: "QC@Eng2025!" },
        { title: "RTG Manager", id: "ENG-RTG", password: "RTG@Eng2025!" },
        { title: "MES Manager", id: "ENG-MES", password: "MES@Eng2025!" },
        { title: "Shift Manager (x1)", id: "ENG-SM1", password: "Sh1ft1@Eng2025!" },
        { title: "Shift Manager (x2)", id: "ENG-SM2", password: "Sh1ft2@Eng2025!" },
        { title: "Infrastructure Manager", id: "ENG-IM", password: "Infra@Eng2025!" },
        { title: "Store Manager", id: "ENG-STM", password: "St0re@Eng2025!" },
        { title: "E-Planning Manager", id: "ENG-EPM", password: "EPlan@Eng2025!" }
      ]
    },
    {
      department: "Human Resource Managers",
      managers: [
        { title: "HR Manager", id: "HR-M", password: "HR@M@nager2025!" },
        { title: "Assistant HR Manager", id: "HR-AM", password: "HRAsst@2025!" }
      ]
    },
    {
      department: "Commercial Managers",
      managers: [
        { title: "Senior Commercial Manager", id: "COM-SCM", password: "Comm$enior2025!" }
      ]
    },
    {
      department: "Finance Managers",
      managers: [
        { title: "Finance Manager (1)", id: "FIN-M1", password: "F1nance1@2025!" },
        { title: "Finance Manager (2)", id: "FIN-M2", password: "F1nance2@2025!" },
        { title: "Assistant Finance Manager", id: "FIN-AM", password: "AsstF1n@2025!" }
      ]
    },
    {
      department: "Safety Managers",
      managers: [
        { title: "Safety Manager", id: "SAF-M", password: "S@fety2025!" },
        { title: "Assistant Safety Manager", id: "SAF-AM", password: "AsstS@fety2025!" }
      ]
    },
    {
      department: "IT Managers",
      managers: [
        { title: "IT Manager", id: "IT-M", password: "IT@M@nager2025!" },
        { title: "Assistant IT Manager", id: "IT-AM", password: "AsstIT@2025!" }
      ]
    },
    {
      department: "Security Managers",
      managers: [
        { title: "Security Manager", id: "SEC-M", password: "S3curity2025!" },
        { title: "Assistant Security Manager", id: "SEC-AM", password: "AsstS3c@2025!" }
      ]
    },
    {
      department: "Planning Managers",
      managers: [
        { title: "Planning Manager", id: "PLN-M", password: "Pl@nning2025!" },
        { title: "Assistant Planning Manager", id: "PLN-AM", password: "AsstPl@n2025!" }
      ]
    },
    {
      department: "Staff Medical Insurance & Training Manager",
      managers: [
        { title: "Manager", id: "MIT-M", password: "M3dical@2025!" }
      ]
    },
    {
      department: "Other Managers",
      managers: [
        { title: "Manager-1", id: "OTH-M1", password: "Other1@2025!" },
        { title: "Manager-2", id: "OTH-M2", password: "Other2@2025!" },
        { title: "Manager-3", id: "OTH-M3", password: "Other3@2025!" }
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected manager
    let selectedManager = null;
    for (const group of managerGroups) {
      const manager = group.managers.find(m => m.id === managerId);
      if (manager) {
        selectedManager = manager;
        break;
      }
    }
    
    if (!selectedManager) {
      setError('Please select a manager');
      return;
    }
    
    if (password !== selectedManager.password) {
      setError('Invalid password');
      return;
    }
    
    onLogin(managerId, password);
  };

  const toggleDepartment = (dept: string) => {
    if (expandedDept === dept) {
      setExpandedDept(null);
    } else {
      setExpandedDept(dept);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <div className="flex items-center gap-2 mb-6">
        <KeyRound className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Manager Login</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Manager
          </label>
          
          <div className="border rounded-md overflow-hidden">
            {managerGroups.map((group) => (
              <div key={group.department} className="border-b last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleDepartment(group.department)}
                  className="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                >
                  <span className="font-medium">{group.department}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${expandedDept === group.department ? 'transform rotate-180' : ''}`} />
                </button>
                
                {expandedDept === group.department && (
                  <div className="bg-gray-50 pl-6 pr-4 py-2 space-y-2">
                    {group.managers.map((manager) => (
                      <label
                        key={manager.id}
                        className={`block p-2 rounded cursor-pointer ${
                          managerId === manager.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="managerId"
                            value={manager.id}
                            checked={managerId === manager.id}
                            onChange={() => {
                              setManagerId(manager.id);
                              setError('');
                            }}
                            className="mr-2"
                          />
                          <span>{manager.title}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { EmployeeRegistration } from './components/EmployeeRegistration';
import { ShiftRegistration } from './components/ShiftRegistration';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { HRLogin } from './components/HRLogin';
import { HRDashboard } from './components/HRDashboard';
import { ManagerLogin } from './components/ManagerLogin';
import { ManagersDashboard } from './components/ManagersDashboard';
import { EmployeeRoster } from './components/EmployeeRoster';
import { OTCalculation } from './components/OTCalculation';
import type { Employee, EmployeeRegistration as EmployeeRegistrationType, ShiftEntry, ShiftType } from './types';
import { 
  getEmployeeById, 
  getEmployeeByCustomId, 
  getAllEmployees, 
  registerEmployee, 
  approveEmployee, 
  rejectEmployee,
  getShiftEntries,
  submitShiftEntry,
  approveShiftEntry,
  rejectShiftEntry,
  getManagers,
  authenticateManager,
  authenticateHR,
  authenticateAdmin
} from './services/api';

function App() {
  // State for authentication and user management
  const [currentView, setCurrentView] = useState<string>('employee-registration');
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [currentManager, setCurrentManager] = useState<Employee | null>(null);
  const [isHR, setIsHR] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // State for data
  const [employees, setEmployees] = useState<Record<string, Employee>>({});
  const [managers, setManagers] = useState<Employee[]>([]);
  const [shiftEntries, setShiftEntries] = useState<ShiftEntry[]>([]);
  
  // State for UI
  const [shiftStep, setShiftStep] = useState<'date' | 'shift'>('date');
  const [loading, setLoading] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const allEmployees = await getAllEmployees();
        setEmployees(allEmployees);
        
        const managersList = await getManagers();
        setManagers(managersList);
        
        const entries = await getShiftEntries();
        setShiftEntries(entries);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Handle employee registration
  const handleEmployeeRegistration = async (data: EmployeeRegistrationType) => {
    try {
      const newEmployee = await registerEmployee(data);
      if (newEmployee) {
        setEmployees(prev => ({
          ...prev,
          [newEmployee.id]: newEmployee
        }));
        setCurrentEmployee(newEmployee);
      }
    } catch (error) {
      console.error('Error registering employee:', error);
    }
  };

  // Handle shift registration
  const handleShiftRegistration = async (shiftType: ShiftType, date: string, otherRemark?: string) => {
    if (!currentEmployee) return;
    
    try {
      const newEntry = await submitShiftEntry(
        currentEmployee.id,
        shiftType,
        date,
        otherRemark
      );
      
      if (newEntry) {
        setShiftEntries(prev => [...prev, newEntry]);
      }
    } catch (error) {
      console.error('Error submitting shift:', error);
      throw error;
    }
  };

  // Handle employee approval/rejection
  const handleApproveEmployee = async (employeeId: string) => {
    try {
      const success = await approveEmployee(employeeId);
      if (success) {
        setEmployees(prev => ({
          ...prev,
          [employeeId]: {
            ...prev[employeeId],
            approved: true
          }
        }));
      }
    } catch (error) {
      console.error('Error approving employee:', error);
    }
  };

  const handleRejectEmployee = async (employeeId: string) => {
    try {
      const success = await rejectEmployee(employeeId);
      if (success) {
        setEmployees(prev => {
          const newEmployees = { ...prev };
          delete newEmployees[employeeId];
          return newEmployees;
        });
      }
    } catch (error) {
      console.error('Error rejecting employee:', error);
    }
  };

  // Handle shift approval/rejection
  const handleApproveShift = async (entryId: string) => {
    if (!currentManager) return;
    
    try {
      const success = await approveShiftEntry(entryId, currentManager.id);
      if (success) {
        setShiftEntries(prev => prev.map(entry => 
          entry.id === entryId 
            ? { 
                ...entry, 
                approved: true, 
                approvedBy: currentManager.id,
                approvedAt: new Date().toISOString()
              } 
            : entry
        ));
      }
    } catch (error) {
      console.error('Error approving shift:', error);
    }
  };

  const handleRejectShift = async (entryId: string, justification: string) => {
    if (!currentManager) return;
    
    try {
      const success = await rejectShiftEntry(entryId, currentManager.id, justification);
      if (success) {
        setShiftEntries(prev => prev.map(entry => 
          entry.id === entryId 
            ? { 
                ...entry, 
                approved: false, 
                approvedBy: currentManager.id,
                approvedAt: new Date().toISOString(),
                otherRemark: justification
              } 
            : entry
        ));
      }
    } catch (error) {
      console.error('Error rejecting shift:', error);
    }
  };

  // Handle authentication
  const handleHRLogin = async (code: string) => {
    try {
      const hrType = await authenticateHR(code);
      if (hrType) {
        setIsHR(hrType);
        setCurrentView('hr-dashboard');
      }
    } catch (error) {
      console.error('Error authenticating HR:', error);
    }
  };

  const handleManagerLogin = async (managerId: string, password: string) => {
    try {
      const manager = await authenticateManager(managerId, password);
      if (manager) {
        setCurrentManager(manager);
        setCurrentView('manager-dashboard');
      }
    } catch (error) {
      console.error('Error authenticating manager:', error);
    }
  };

  const handleAdminLogin = async (code: string) => {
    try {
      const isAuthenticated = await authenticateAdmin(code);
      if (isAuthenticated) {
        setIsAdmin(true);
        setCurrentView('admin-dashboard');
      }
    } catch (error) {
      console.error('Error authenticating admin:', error);
    }
  };

  // Handle refresh data
  const handleRefreshData = async () => {
    try {
      const allEmployees = await getAllEmployees();
      setEmployees(allEmployees);
      
      const entries = await getShiftEntries();
      setShiftEntries(entries);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render main content
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Shift Management System</h1>
          
          <nav className="space-x-4">
            {!currentEmployee && !currentManager && !isHR && !isAdmin && (
              <>
                <button 
                  onClick={() => setCurrentView('employee-registration')}
                  className={`px-3 py-1 rounded ${currentView === 'employee-registration' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-500'}`}
                >
                  Employee
                </button>
                <button 
                  onClick={() => setCurrentView('manager-login')}
                  className={`px-3 py-1 rounded ${currentView === 'manager-login' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-500'}`}
                >
                  Manager
                </button>
                <button 
                  onClick={() => setCurrentView('hr-login')}
                  className={`px-3 py-1 rounded ${currentView === 'hr-login' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-500'}`}
                >
                  HR
                </button>
                <button 
                  onClick={() => setCurrentView('admin-login')}
                  className={`px-3 py-1 rounded ${currentView === 'admin-login' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-500'}`}
                >
                  Admin
                </button>
              </>
            )}
            
            {currentEmployee && (
              <>
                <button 
                  onClick={() => setCurrentView('shift-registration')}
                  className={`px-3 py-1 rounded ${currentView === 'shift-registration' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-500'}`}
                >
                  Register Shift
                </button>
                <button 
                  onClick={() => setCurrentView('employee-roster')}
                  className={`px-3 py-1 rounded ${currentView === 'employee-roster' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-500'}`}
                >
                  View Roster
                </button>
                <button 
                  onClick={() => setCurrentView('ot-calculation')}
                  className={`px-3 py-1 rounded ${currentView === 'ot-calculation' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-500'}`}
                >
                  OT Calculation
                </button>
                <button 
                  onClick={() => {
                    setCurrentEmployee(null);
                    setCurrentView('employee-registration');
                  }}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
            
            {(currentManager || isHR || isAdmin) && (
              <button 
                onClick={() => {
                  setCurrentManager(null);
                  setIsHR(null);
                  setIsAdmin(false);
                  setCurrentView('employee-registration');
                }}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center">
          {/* Employee Registration View */}
          {currentView === 'employee-registration' && (
            <EmployeeRegistration 
              onRegister={handleEmployeeRegistration}
              existingEmployee={null}
              onExistingEmployee={() => setCurrentView('shift-registration')}
            />
          )}
          
          {/* Shift Registration View */}
          {currentView === 'shift-registration' && currentEmployee && (
            <ShiftRegistration 
              employee={currentEmployee}
              onSubmit={handleShiftRegistration}
              entries={shiftEntries.filter(entry => entry.employeeId === currentEmployee.id)}
              initialStep={shiftStep}
              onStepChange={setShiftStep}
            />
          )}
          
          {/* Employee Roster View */}
          {currentView === 'employee-roster' && currentEmployee && (
            <EmployeeRoster />
          )}
          
          {/* OT Calculation View */}
          {currentView === 'ot-calculation' && currentEmployee && (
            <OTCalculation />
          )}
          
          {/* Manager Login View */}
          {currentView === 'manager-login' && (
            <ManagerLogin 
              onLogin={handleManagerLogin}
              managers={managers}
            />
          )}
          
          {/* Manager Dashboard View */}
          {currentView === 'manager-dashboard' && currentManager && (
            <ManagersDashboard 
              entries={shiftEntries}
              employees={employees}
              currentManager={currentManager}
              onApprove={handleApproveShift}
              onReject={handleRejectShift}
              onRefresh={handleRefreshData}
            />
          )}
          
          {/* HR Login View */}
          {currentView === 'hr-login' && (
            <HRLogin onLogin={handleHRLogin} />
          )}
          
          {/* HR Dashboard View */}
          {currentView === 'hr-dashboard' && isHR && (
            <HRDashboard 
              entries={shiftEntries}
              employees={employees}
              userType={isHR}
            />
          )}
          
          {/* Admin Login View */}
          {currentView === 'admin-login' && (
            <AdminLogin onLogin={handleAdminLogin} />
          )}
          
          {/* Admin Dashboar d View */}
          {currentView === 'admin-dashboard' && isAdmin && (
            <AdminDashboard 
              employees={employees}
              onApproveEmployee={handleApproveEmployee}
              onRejectEmployee={handleRejectEmployee}
              onChangePassword={() => {}}
            />
          )}
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>Shift Management System &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
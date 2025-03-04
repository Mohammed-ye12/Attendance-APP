import React, { useState, useEffect } from 'react';
import { UserPlus, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import type { EmployeeRegistration, Department, ShiftSystem } from '../types';
import { supabase } from '../lib/supabase';

interface Props {
  onRegister: (data: EmployeeRegistration) => void;
  existingEmployee: EmployeeRegistration | null;
  onExistingEmployee?: () => void;
}

const departments: Department[] = [
  'Operations & Berthing',
  'Engineering',
  'Human Resource',
  'Commercial',
  'Finance',
    'Purchase',
  'Service',
  'Safety',
  'IT',
  'Security',
  'Planning',
   'Staff Medical Insurance and Training',
  'Others'
];

const shiftSystems: ShiftSystem[] = ['Normal', 'TwoShift', 'ThreeShift'];
const normalOptions = ['Admin', 'Others'];
const twoShiftOptions = ['QC', 'RTG', 'MES'];
const twoShiftSeniorOptions = ['Senior', 'Equipment'];
const threeShiftOptions = ['A', 'B', 'C', 'D'];
const threeShiftGroups = ['Shift Incharge', 'Store', 'Planning'];
const operationsTwoShiftOptions = [
  'QC-Senior Equipment', 
  'RTG-Senior Equipment', 
  'MES-Senior Equipment'
];

export function EmployeeRegistration({ onRegister, existingEmployee, onExistingEmployee }: Props) {
  const [employeeCode, setEmployeeCode] = useState(existingEmployee?.id || '');
  const [fullName, setFullName] = useState(existingEmployee?.fullName || '');
  const [department, setDepartment] = useState<Department>(existingEmployee?.department || 'Operations');
  const [shiftSystem, setShiftSystem] = useState<ShiftSystem | undefined>(existingEmployee?.shiftSystem);
  const [shiftOption, setShiftOption] = useState<string | undefined>(existingEmployee?.shiftOption);
  const [shiftGroup, setShiftGroup] = useState<string | undefined>(existingEmployee?.shiftGroup);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExistingEmployee, setIsExistingEmployee] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAutoLogin();
  }, []);

  useEffect(() => {
    if (employeeCode.length >= 3) {
      checkEmployeeExists(employeeCode);
    } else {
      setIsExistingEmployee(false);
      setIsApproved(false);
    }
  }, [employeeCode]);

  const checkAutoLogin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setIsExistingEmployee(true);
          setIsApproved(profile.is_approved);
          if (profile.is_approved && onExistingEmployee) {
            onExistingEmployee();
          }
        }
      }
    } catch (error) {
      console.error('Auto login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEmployeeExists = async (code: string) => {
    try {
      // First check by custom_id
      const { data: profileByCustomId, error: customIdError } = await supabase
        .from('profiles')
        .select('*')
        .eq('custom_id', code)
        .single();
      
      if (profileByCustomId) {
        setIsExistingEmployee(true);
        setIsApproved(profileByCustomId.is_approved);
        if (profileByCustomId.is_approved && onExistingEmployee) {
          onExistingEmployee();
        }
        return;
      }
      
      // If not found by custom_id, try by id (though this is less likely for employee codes)
      const { data: profileById } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', code)
        .single();
      
      if (profileById) {
        setIsExistingEmployee(true);
        setIsApproved(profileById.is_approved);
        if (profileById.is_approved && onExistingEmployee) {
          onExistingEmployee();
        }
      } else {
        setIsExistingEmployee(false);
        setIsApproved(false);
      }
    } catch (error) {
      setIsExistingEmployee(false);
      setIsApproved(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeCode.trim()) {
      setError('Employee code is required');
      return;
    }
    
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (department === 'Engineering' || department === 'Operations') {
      if (!shiftSystem) {
        setError(`Shift system is required for ${department} department`);
        return;
      }
      if (!shiftOption) {
        setError('Shift option is required');
        return;
      }
      if (shiftSystem === 'ThreeShift' && !shiftGroup && department === 'Engineering') {
        setError('Shift group is required');
        return;
      }
    }

    if (isExistingEmployee) {
      if (onExistingEmployee && isApproved) {
        onExistingEmployee();
      }
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Generate a UUID for the new employee
      const { data: newUuid } = await supabase.rpc('generate_uuid');
      
      if (!newUuid) {
        throw new Error('Failed to generate UUID');
      }
      
      // Insert the employee profile with the generated UUID
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: newUuid,
          custom_id: employeeCode,
          full_name: fullName,
          department: department,
          section: shiftOption,
          shift_group: shiftGroup,
          role: 'employee',
          is_approved: false
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSuccess(true);
        onRegister({
          id: data.id,
          fullName: data.full_name,
          department: data.department,
          section: data.section,
          shiftGroup: data.shift_group,
          role: 'employee',
          approved: data.is_approved
        });
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isExistingEmployee) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Account Exists</h2>
        </div>
        <p className="text-gray-600 mb-6">
          An account with employee code {employeeCode} already exists.
          {isApproved 
            ? ' You can proceed to register your shift.'
            : ' Your registration is pending approval from the administrator.'}
        </p>
        {isApproved && onExistingEmployee && (
          <button
            onClick={onExistingEmployee}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 text-lg"
          >
            Continue to Shift Registration
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Registration Successful</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Your registration has been submitted successfully and is pending approval from the administrator.
          You will be able to register your shifts once your registration is approved.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="font-medium text-green-800 mb-2">Registration Details:</h3>
          <ul className="text-green-700 space-y-1">
            <li>Employee Code: {employeeCode}</li>
            <li>Name: {fullName}</li>
            <li>Department: {department}</li>
            {shiftSystem && <li>Shift System: {shiftSystem}</li>}
            {shiftOption && <li>Shift Option: {shiftOption}</li>}
            {shiftGroup && <li>Shift Group: {shiftGroup}</li>}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Employee Registration</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="employeeCode" className="block text-sm font-medium text-gray-700">
            Employee Code
          </label>
          <input
            type="text"
            id="employeeCode"
            value={employeeCode}
            onChange={(e) => {
              setEmployeeCode(e.target.value.toUpperCase());
              setError('');
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
            placeholder="Enter your employee code"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setError('');
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
            placeholder="Enter your full name"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => {
              const newDepartment = e.target.value as Department;
              setDepartment(newDepartment);
              setShiftSystem(undefined);
              setShiftOption(undefined);
              setShiftGroup(undefined);
              setError('');
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
            disabled={isSubmitting}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {(department === 'Engineering' || department === 'Operations') && (
          <>
            <div>
              <label htmlFor="shiftSystem" className="block text-sm font-medium text-gray-700">
                Shift System
              </label>
              <select
                id="shiftSystem"
                value={shiftSystem}
                onChange={(e) => {
                  setShiftSystem(e.target.value as ShiftSystem);
                  setShiftOption(undefined);
                  setShiftGroup(undefined);
                  setError('');
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Shift System</option>
                {shiftSystems.map((system) => (
                  <option key={system} value={system}>
                    {system.replace('Shift', ' Shift')}
                  </option>
                ))}
              </select>
            </div>

            {shiftSystem === 'Normal' && (
              <div>
                <label htmlFor="normalShift" className="block text-sm font-medium text-gray-700">
                  Normal Shift Option
                </label>
                <select
                  id="normalShift"
                  value={shiftOption}
                  onChange={(e) => setShiftOption(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Option</option>
                  {normalOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}

            {shiftSystem === 'TwoShift' && (
              <div>
                <label htmlFor="twoShift" className="block text-sm font-medium text-gray-700">
                  Two Shift Option
                </label>
                <select
                  id="twoShift"
                  value={shiftOption}
                  onChange={(e) => setShiftOption(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Option</option>
                  {department === 'Operations' ? (
                    operationsTwoShiftOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))
                  ) : (
                    twoShiftOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))
                  )}
                </select>
              </div>
            )}

            {shiftSystem === 'ThreeShift' && (
              <>
                {department === 'Engineering' && (
                  <div>
                    <label htmlFor="threeShiftGroup" className="block text-sm font-medium text-gray-700">
                      Three Shift Group Type
                    </label>
                    <select
                      id="threeShiftGroup"
                      value={shiftGroup}
                      onChange={(e) => setShiftGroup(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select Group Type</option>
                      {threeShiftGroups.map((group) => (
                        <option key={group} value={group}>{group} Group</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="threeShift" className="block text-sm font-medium text-gray-700">
                    {department === 'Engineering' 
                      ? (shiftGroup ? `${shiftGroup} Group` : 'Three Shift Group') 
                      : 'Shift Group'}
                  </label>
                  <select
                    id="threeShift"
                    value={shiftOption}
                    onChange={(e) => setShiftOption(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    required
                    disabled={isSubmitting || (department === 'Engineering' && !shiftGroup)}
                  >
                    <option value="">Select Group</option>
                    {threeShiftOptions.map((group) => (
                      <option key={group} value={group}>
                        {department === 'Operations' ? `Shift Group ${group}` : `Group ${group}`}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </div>
  );
}

export default EmployeeRegistration
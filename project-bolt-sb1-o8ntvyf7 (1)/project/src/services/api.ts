import { supabase } from '../lib/supabase';
import type { Employee, EmployeeRegistration, ShiftEntry, ShiftType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Employee Services
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching employee:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    department: data.department as any,
    section: data.section || undefined,
    shiftGroup: data.shift_group || undefined,
    role: data.role as 'employee' | 'manager',
    approved: data.is_approved
  };
};

export const getEmployeeByCustomId = async (customId: string): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('custom_id', customId)
    .single();

  if (error) {
    console.error('Error fetching employee by custom ID:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    department: data.department as any,
    section: data.section || undefined,
    shiftGroup: data.shift_group || undefined,
    role: data.role as 'employee' | 'manager',
    approved: data.is_approved
  };
};

export const getAllEmployees = async (): Promise<Record<string, Employee>> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'employee');

  if (error) {
    console.error('Error fetching employees:', error);
    return {};
  }

  const employees: Record<string, Employee> = {};
  
  data.forEach(profile => {
    employees[profile.id] = {
      id: profile.id,
      fullName: profile.full_name,
      department: profile.department as any,
      section: profile.section || undefined,
      shiftGroup: profile.shift_group || undefined,
      role: profile.role as 'employee' | 'manager',
      approved: profile.is_approved
    };
  });

  return employees;
};

export const registerEmployee = async (data: EmployeeRegistration): Promise<Employee | null> => {
  // Generate a UUID for the new employee
  const { data: newUuid, error: uuidError } = await supabase.rpc('generate_uuid');
  
  if (uuidError || !newUuid) {
    console.error('Failed to generate UUID:', uuidError);
    throw new Error('Failed to generate UUID');
  }
  
  // Insert the employee profile with the generated UUID
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert([{
      id: newUuid,
      custom_id: data.id,
      full_name: data.fullName,
      department: data.department,
      section: data.section,
      shift_group: data.shiftGroup,
      role: 'employee',
      is_approved: false
    }])
    .select()
    .single();

  if (error) {
    console.error('Error registering employee:', error);
    throw error;
  }

  if (!profile) return null;

  return {
    id: profile.id,
    fullName: profile.full_name,
    department: profile.department as any,
    section: profile.section || undefined,
    shiftGroup: profile.shift_group || undefined,
    role: profile.role as 'employee' | 'manager',
    approved: profile.is_approved
  };
};

export const approveEmployee = async (employeeId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update({ is_approved: true })
    .eq('id', employeeId);

  if (error) {
    console.error('Error approving employee:', error);
    return false;
  }

  return true;
};

export const rejectEmployee = async (employeeId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', employeeId);

  if (error) {
    console.error('Error rejecting employee:', error);
    return false;
  }

  return true;
};

// Shift Services
export const getShiftEntries = async (employeeId?: string): Promise<ShiftEntry[]> => {
  let query = supabase
    .from('shift_entries')
    .select('*');
  
  if (employeeId) {
    query = query.eq('employee_id', employeeId);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error('Error fetching shift entries:', error);
    return [];
  }

  return data.map(entry => ({
    id: entry.id,
    employeeId: entry.employee_id,
    date: entry.date,
    shiftType: entry.shift_type as ShiftType,
    otherRemark: entry.other_remark || undefined,
    approved: entry.approved,
    approvedBy: entry.approved_by || undefined,
    approvedAt: entry.approved_at || undefined
  }));
};

export const submitShiftEntry = async (
  employeeId: string,
  shiftType: ShiftType,
  date: string,
  otherRemark?: string
): Promise<ShiftEntry | null> => {
  const { data, error } = await supabase
    .from('shift_entries')
    .insert([{
      employee_id: employeeId,
      shift_type: shiftType,
      date,
      other_remark: otherRemark || null,
      approved: null
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting shift entry:', error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    employeeId: data.employee_id,
    date: data.date,
    shiftType: data.shift_type as ShiftType,
    otherRemark: data.other_remark || undefined,
    approved: data.approved,
    approvedBy: data.approved_by || undefined,
    approvedAt: data.approved_at || undefined
  };
};

export const approveShiftEntry = async (entryId: string, managerId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('shift_entries')
    .update({
      approved: true,
      approved_by: managerId,
      approved_at: new Date().toISOString()
    })
    .eq('id', entryId);

  if (error) {
    console.error('Error approving shift entry:', error);
    return false;
  }

  return true;
};

export const rejectShiftEntry = async (
  entryId: string,
  managerId: string,
  justification: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('shift_entries')
    .update({
      approved: false,
      approved_by: managerId,
      approved_at: new Date().toISOString(),
      other_remark: justification
    })
    .eq('id', entryId);

  if (error) {
    console.error('Error rejecting shift entry:', error);
    return false;
  }

  return true;
};

// Manager Services
export const getManagers = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('managers')
    .select('*');

  if (error) {
    console.error('Error fetching managers:', error);
    return [];
  }

  return data.map(manager => ({
    id: manager.id,
    fullName: manager.full_name,
    department: manager.department as any,
    section: manager.section || undefined,
    role: 'manager',
    approved: true
  }));
};

export const authenticateManager = async (managerId: string, password: string): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('managers')
    .select('*')
    .eq('id', managerId)
    .eq('password', password)
    .single();

  if (error || !data) {
    console.error('Error authenticating manager:', error);
    return null;
  }

  return {
    id: data.id,
    fullName: data.full_name,
    department: data.department as any,
    section: data.section || undefined,
    role: 'manager',
    approved: true
  };
};

// HR Services
export const authenticateHR = async (code: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('hr_users')
    .select('*')
    .eq('password', code)
    .single();

  if (error || !data) {
    console.error('Error authenticating HR:', error);
    return null;
  }

  return data.type;
};

// Admin Services
export const authenticateAdmin = async (code: string): Promise<boolean> => {
  return code === 'ADMIN123'; // Hardcoded for simplicity
};
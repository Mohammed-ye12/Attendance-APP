export type Department = 
  | 'Operations & Berthing'
  | 'Engineering'
  | 'Human Resource'
  | 'Commercial'
  | 'Finance'
  | 'Purchase'
  | 'Service'
  | 'Safety'
  | 'IT'
  | 'Security'
  | 'Planning'
  | 'Staff Medical Insurance and Training'
  | 'Others';

export type ShiftSystem = 'Normal' | 'TwoShift' | 'ThreeShift';

export type EngineeringSection = 
  | 'QC' 
  | 'RTG' 
  | 'MES' 
  | 'Senior' 
  | 'Equipment' 
  | 'Shift Incharge' 
  | 'Store' 
  | 'Planning';

export type ShiftType = 
  | '1st_shift' 
  | '2nd_shift' 
  | '3rd_shift' 
  | 'leave' 
  | 'medical' 
  | 'ot_off_day' 
  | 'ot_week_off' 
  | 'ot_public_holiday' 
  | 'other';

export interface Employee {
  id: string;
  fullName: string;
  department: Department;
  section?: string;
  shiftGroup?: string;
  role: 'employee' | 'manager';
  approved: boolean;
}

export interface EmployeeRegistration {
  id: string;
  fullName: string;
  department: Department;
  section?: string;
  shiftGroup?: string;
  shiftSystem?: ShiftSystem;
  shiftOption?: string;
  role: string;
  approved: boolean;
}

export interface ShiftEntry {
  id: string;
  employeeId: string;
  date: string;
  shiftType: ShiftType;
  otherRemark?: string;
  approved: boolean | null;
  approvedBy?: string;
  approvedAt?: string;
}

export interface PasswordChange {
  employeeId: string;
  newPassword: string;
}

export interface Manager {
  id: string;
  fullName: string;
  department: string;
  section?: string;
  password: string;
}

export interface HRUser {
  id: string;
  username: string;
  password: string;
  type: 'hr' | 'hr-eng' | 'op-logistic';
  departments?: string[];
}
export interface Employee {
  id: string;
  fullName: string;
  department: Department;
  section?: EngineeringSection;
  role?: 'manager' | 'employee' | 'admin';
  password?: string;
  approved?: boolean;
  pendingRegistration?: boolean;
  shiftSystem?: ShiftSystem;
  shiftOption?: string;
}

export interface ShiftEntry {
  id: string;
  employee_id: string;
  date: string;
  shift_type: ShiftType;
  approved: boolean | null;
  approved_by: string | null;
  approved_at: string | null;
  other_remark: string;
}

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

export type Department =
  | 'Operations'
  | 'Engineering'
  | 'Human Resource'
  | 'Finance'
  | 'Safety'
  | 'IT'
  | 'Security'
  | 'Planning'
  | 'Others';

export type EngineeringSection =
  | 'QC'
  | 'RTG'
  | 'MES'
  | 'Shift Incharge'
  | 'Planning'
  | 'Store'
  | 'Infra'
  | 'Others';

export type ShiftSystem = 'Normal' | 'TwoShift' | 'ThreeShift';

export interface EmployeeRegistration {
  id: string;
  fullName: string;
  department: Department;
  section?: EngineeringSection;
  role?: 'manager' | 'employee' | 'admin';
  pendingRegistration?: boolean;
  shiftSystem?: ShiftSystem;
  shiftOption?: string;
}

export interface HRCredentials {
  code: string;
}

export interface PasswordChange {
  userId: string;
  newPassword: string;
}
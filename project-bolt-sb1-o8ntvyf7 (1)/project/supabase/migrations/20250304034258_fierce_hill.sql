/*
  # Create shift entries table

  1. New Tables
    - `shift_entries`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `employee_id` (uuid, references profiles.id)
      - `date` (date)
      - `shift_type` (text)
      - `other_remark` (text)
      - `approved` (boolean)
      - `approved_by` (uuid, references profiles.id)
      - `approved_at` (timestamptz)
  2. Security
    - Enable RLS on `shift_entries` table
    - Add policy for employees to read their own entries
    - Add policy for employees to insert their own entries
    - Add policy for managers to read entries in their department/section
    - Add policy for managers to update entries in their department/section
    - Add policy for HR to read all entries
*/

CREATE TABLE IF NOT EXISTS shift_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  employee_id uuid REFERENCES profiles(id) NOT NULL,
  date date NOT NULL,
  shift_type text NOT NULL,
  other_remark text,
  approved boolean,
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz
);

ALTER TABLE shift_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can read own shift entries"
  ON shift_entries
  FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid());

CREATE POLICY "Employees can insert own shift entries"
  ON shift_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Managers can read shift entries in their department"
  ON shift_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role = 'manager'
      AND p.department = (
        SELECT department FROM profiles WHERE id = shift_entries.employee_id
      )
    )
  );

CREATE POLICY "Managers can update shift entries in their department"
  ON shift_entries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role = 'manager'
      AND p.department = (
        SELECT department FROM profiles WHERE id = shift_entries.employee_id
      )
    )
  );

CREATE POLICY "HR can read all shift entries"
  ON shift_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role = 'hr'
    )
  );
/*
  # Create shift_entries table with policies

  1. New Tables
    - `shift_entries` - Stores employee shift registrations
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `employee_id` (uuid, references profiles)
      - `date` (date)
      - `shift_type` (text)
      - `other_remark` (text, optional)
      - `approved` (boolean)
      - `approved_by` (uuid, references profiles)
      - `approved_at` (timestamp)
  
  2. Security
    - Enable RLS on `shift_entries` table
    - Add policies for employees to manage their own entries
    - Add policies for managers to manage entries in their department
    - Add policy for HR to view all entries
*/

-- Check if shift_entries table exists, if not create it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'shift_entries') THEN
    CREATE TABLE shift_entries (
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
  END IF;
END $$;

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'shift_entries' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE shift_entries ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Policy for employees to read their own entries
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'shift_entries' 
    AND policyname = 'Employees can read own shift entries'
  ) THEN
    CREATE POLICY "Employees can read own shift entries"
      ON shift_entries
      FOR SELECT
      TO authenticated
      USING (employee_id = auth.uid());
  END IF;
  
  -- Policy for employees to insert their own entries
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'shift_entries' 
    AND policyname = 'Employees can insert own shift entries'
  ) THEN
    CREATE POLICY "Employees can insert own shift entries"
      ON shift_entries
      FOR INSERT
      TO authenticated
      WITH CHECK (employee_id = auth.uid());
  END IF;
  
  -- Policy for managers to read entries in their department
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'shift_entries' 
    AND policyname = 'Managers can read shift entries in their department'
  ) THEN
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
  END IF;
  
  -- Policy for managers to update entries in their department
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'shift_entries' 
    AND policyname = 'Managers can update shift entries in their department'
  ) THEN
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
  END IF;
  
  -- Policy for HR to read all entries
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'shift_entries' 
    AND policyname = 'HR can read all shift entries'
  ) THEN
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
  END IF;
END $$;
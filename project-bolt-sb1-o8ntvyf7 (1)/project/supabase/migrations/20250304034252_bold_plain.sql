/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `custom_id` (text, unique)
      - `full_name` (text)
      - `department` (text)
      - `section` (text)
      - `shift_group` (text)
      - `role` (text)
      - `is_approved` (boolean)
  2. Security
    - Enable RLS on `profiles` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to update their own data
    - Add policy for admins to read all profiles
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  custom_id text UNIQUE,
  full_name text NOT NULL,
  department text NOT NULL,
  section text,
  shift_group text,
  role text NOT NULL DEFAULT 'employee',
  is_approved boolean DEFAULT false
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (role = 'admin');

-- Create function to generate UUID
CREATE OR REPLACE FUNCTION generate_uuid()
RETURNS uuid
LANGUAGE sql
AS $$
  SELECT gen_random_uuid();
$$;
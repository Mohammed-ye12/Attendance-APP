/*
  # Create managers table

  1. New Tables
    - `managers`
      - `id` (text, primary key)
      - `created_at` (timestamptz)
      - `full_name` (text)
      - `department` (text)
      - `section` (text)
      - `password` (text)
  2. Security
    - Enable RLS on `managers` table
    - Add policy for authenticated users to read managers data
    - Add policy for admins to manage managers
*/

CREATE TABLE IF NOT EXISTS managers (
  id text PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  full_name text NOT NULL,
  department text NOT NULL,
  section text,
  password text NOT NULL
);

ALTER TABLE managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read managers data"
  ON managers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage managers"
  ON managers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );
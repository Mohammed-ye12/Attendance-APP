/*
  # Create HR users table

  1. New Tables
    - `hr_users`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `username` (text)
      - `password` (text)
      - `type` (text)
      - `departments` (text[])
  2. Security
    - Enable RLS on `hr_users` table
    - Add policy for authenticated users to read HR users data
    - Add policy for admins to manage HR users
*/

CREATE TABLE IF NOT EXISTS hr_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  username text NOT NULL,
  password text NOT NULL,
  type text NOT NULL,
  departments text[]
);

ALTER TABLE hr_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read HR users data"
  ON hr_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage HR users"
  ON hr_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );
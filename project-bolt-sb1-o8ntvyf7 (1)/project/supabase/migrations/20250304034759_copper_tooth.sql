/*
  # Create additional policies for profiles table

  1. Security
    - Add policy for managers to read profiles in their department
    - Add policy for HR to read all profiles
*/

-- Create additional policies for profiles table
DO $$ 
BEGIN
  -- Policy for managers to read profiles in their department
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Managers can read profiles in their department'
  ) THEN
    CREATE POLICY "Managers can read profiles in their department"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles p
          WHERE p.id = auth.uid() 
          AND p.role = 'manager'
          AND p.department = profiles.department
        )
      );
  END IF;
  
  -- Policy for HR to read all profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'HR can read all profiles'
  ) THEN
    CREATE POLICY "HR can read all profiles"
      ON profiles
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
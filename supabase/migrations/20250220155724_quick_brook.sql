/*
  # Update Audit Logs Table and Policies
  
  1. Drop existing policy to avoid conflicts
  2. Recreate audit logs table and policies
  3. Set up audit trigger function and triggers
*/

-- Drop existing policy and triggers if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "HR and admins can view audit logs" ON audit_logs;
    DROP TRIGGER IF EXISTS audit_profiles_changes ON profiles;
    DROP TRIGGER IF EXISTS audit_shift_entries_changes ON shift_entries;
END $$;

-- Create Audit Logs Table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  changed_by uuid REFERENCES profiles(id),
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for HR and admin access
CREATE POLICY "HR and admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('hr', 'admin')
    )
  );

-- Create audit trigger function
CREATE OR REPLACE FUNCTION process_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    changed_by
  )
  VALUES (
    TG_TABLE_NAME,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    TG_OP,
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD)
      ELSE NULL
    END,
    CASE 
      WHEN TG_OP = 'DELETE' THEN NULL 
      ELSE to_jsonb(NEW)
    END,
    auth.uid()
  );
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create cleanup function for old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(p_days integer)
RETURNS integer AS $$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM audit_logs
  WHERE changed_at < now() - (p_days || ' days')::interval;
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
CREATE TRIGGER audit_profiles_changes
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION process_audit_log();

CREATE TRIGGER audit_shift_entries_changes
  AFTER INSERT OR UPDATE OR DELETE ON shift_entries
  FOR EACH ROW EXECUTE FUNCTION process_audit_log();
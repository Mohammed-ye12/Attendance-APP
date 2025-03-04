/*
  # Seed initial data

  1. Data Seeding
    - Insert HR users with different access levels
    - Insert manager accounts for different departments
  2. Notes
    - This migration populates the database with initial test data
    - Passwords are stored in plain text for demonstration purposes only
    - In a production environment, passwords should be properly hashed
*/

-- Insert HR users
INSERT INTO hr_users (username, password, type, departments)
VALUES
  ('main_hr', 'Main123*', 'hr', NULL),
  ('eng_hr', 'ENG123*', 'hr-eng', ARRAY['Engineering']),
  ('op_logistic', 'OP123*', 'op-logistic', ARRAY['Operations & Berthing', 'Logistics']);

-- Insert Operations Managers
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('OPS-SM1', 'Operations Senior Manager 1', 'Operations & Berthing', NULL, 'Ops$enior2025!'),
  ('OPS-SM2', 'Operations Senior Manager 2', 'Operations & Berthing', NULL, 'Ops$enior2@25!'),
  ('OPS-BM', 'Berthing Manager', 'Operations & Berthing', 'Berthing', 'B3rth!ngM@n2025'),
  ('OPS-SMGA', 'Shift Manager Group A', 'Operations & Berthing', 'Group A', 'Sh1ftGA@2025!'),
  ('OPS-SMGB', 'Shift Manager Group B', 'Operations & Berthing', 'Group B', 'Sh1ftGB@2025!'),
  ('OPS-SMGC', 'Shift Manager Group C', 'Operations & Berthing', 'Group C', 'Sh1ftGC@2025!'),
  ('OPS-SMGD', 'Shift Manager Group D', 'Operations & Berthing', 'Group D', 'Sh1ftGD@2025!');

-- Insert Engineering Managers
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('ENG-SM1', 'Engineering Senior Manager', 'Engineering', NULL, 'Eng$enior2025!'),
  ('ENG-QC', 'QC Manager', 'Engineering', 'QC', 'QC@Eng2025!'),
  ('ENG-RTG', 'RTG Manager', 'Engineering', 'RTG', 'RTG@Eng2025!'),
  ('ENG-MES', 'MES Manager', 'Engineering', 'MES', 'MES@Eng2025!'),
  ('ENG-SM1', 'Engineering Shift Manager 1', 'Engineering', 'Shift', 'Sh1ft1@Eng2025!'),
  ('ENG-SM2', 'Engineering Shift Manager 2', 'Engineering', 'Shift', 'Sh1ft2@Eng2025!'),
  ('ENG-IM', 'Infrastructure Manager', 'Engineering', 'Infrastructure', 'Infra@Eng2025!'),
  ('ENG-STM', 'Store Manager', 'Engineering', 'Store', 'St0re@Eng2025!'),
  ('ENG-EPM', 'E-Planning Manager', 'Engineering', 'Planning', 'EPlan@Eng2025!');

-- Insert HR Managers
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('HR-M', 'HR Manager', 'Human Resource', NULL, 'HR@M@nager2025!'),
  ('HR-AM', 'Assistant HR Manager', 'Human Resource', NULL, 'HRAsst@2025!');

-- Insert Commercial Managers
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('COM-SCM', 'Senior Commercial Manager', 'Commercial', NULL, 'Comm$enior2025!');

-- Insert Finance Managers
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('FIN-M1', 'Finance Manager 1', 'Finance', NULL, 'F1nance1@2025!'),
  ('FIN-M2', 'Finance Manager 2', 'Finance', NULL, 'F1nance2@2025!'),
  ('FIN-AM', 'Assistant Finance Manager', 'Finance', NULL, 'AsstF1n@2025!');

-- Insert Safety Managers
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('SAF-M', 'Safety Manager', 'Safety', NULL, 'S@fety2025!'),
  ('SAF-AM', 'Assistant Safety Manager', 'Safety', NULL, 'AsstS@fety2025!');

-- Insert IT Managers
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('IT-M', 'IT Manager', 'IT', NULL, 'IT@M@nager2025!'),
  ('IT-AM', 'Assistant IT Manager', 'IT', NULL, 'AsstIT@2025!');

-- Insert Security Managers
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('SEC-M', 'Security Manager', 'Security', NULL, 'S3curity2025!'),
  ('SEC-AM', 'Assistant Security Manager', 'Security', NULL, 'AsstS3c@2025!');

-- Insert Planning Managers
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('PLN-M', 'Planning Manager', 'Planning', NULL, 'Pl@nning2025!'),
  ('PLN-AM', 'Assistant Planning Manager', 'Planning', NULL, 'AsstPl@n2025!');

-- Insert Medical Insurance & Training Manager
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('MIT-M', 'Medical Insurance & Training Manager', 'Staff Medical Insurance and Training', NULL, 'M3dical@2025!');

-- Insert Other Managers
INSERT INTO managers (id, full_name, department, section, password)
VALUES
  ('OTH-M1', 'Other Manager 1', 'Others', NULL, 'Other1@2025!'),
  ('OTH-M2', 'Other Manager 2', 'Others', NULL, 'Other2@2025!'),
  ('OTH-M3', 'Other Manager 3', 'Others', NULL, 'Other3@2025!');
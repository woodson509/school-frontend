-- Add Superadmin Role to Database
-- This script will:
-- 1. Add 'superadmin' to the allowed roles
-- 2. Create a superadmin user account

-- Step 1: Add 'superadmin' to role constraint
-- First, check if you're using ENUM or CHECK constraint

-- Option A: If using ENUM (PostgreSQL)
-- Uncomment this line if your database uses ENUM:
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'superadmin';

-- Option B: If using CHECK constraint (most common)
-- Drop and recreate the constraint to include superadmin
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('admin', 'teacher', 'student', 'agent', 'superadmin'));

-- Step 2: Create superadmin user
-- Email: superadmin@example.com
-- Password: superadmin123
INSERT INTO users (email, password, full_name, role, created_at, updated_at)
VALUES (
    'superadmin@example.com',
    crypt('superadmin123', gen_salt('bf', 10)),
    'Super Administrator',
    'superadmin',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password = crypt('superadmin123', gen_salt('bf', 10)),
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Verify the user was created
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE email = 'superadmin@example.com';

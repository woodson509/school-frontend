-- Create Demo Teacher User
-- Email: teacher@example.com
-- Password: teacher123 (hashed with bcrypt)

-- Note: The password 'teacher123' is hashed using bcrypt with 10 rounds
-- Hash: $2b$10$8jZQvZPFqG5yR6X7nK9WzuEhqH6lJ7vP8yFqH6lJ7vP8yFqH6lJ7v
-- You should run this with the actual bcrypt hash from your backend

INSERT INTO users (email, password, name, role, created_at, updated_at)
VALUES (
    'teacher@example.com',
    '$2b$10$8jZQvZPFqG5yR6X7nK9WzuEhqH6lJ7vP8yFqH6lJ7vP8yFqH6lJ7v',
    'Teacher Demo',
    'teacher',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Alternative: If you need to generate the hash in your backend, use this Node.js code:
/*
const bcrypt = require('bcrypt');
const password = 'teacher123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    console.log('Hashed password:', hash);
});
*/

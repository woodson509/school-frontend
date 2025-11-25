/**
 * Seed Demo Teacher User
 * Creates a demo teacher account for testing
 * 
 * Email: teacher@example.com
 * Password: teacher123
 */

const bcrypt = require('bcrypt');

async function seedTeacherDemo() {
    const password = 'teacher123';
    const saltRounds = 10;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log('🔐 Hashed password for teacher123:', hashedPassword);

        // SQL to insert the user
        const sql = `
      INSERT INTO users (email, password, name, role, created_at, updated_at)
      VALUES (
        'teacher@example.com',
        '${hashedPassword}',
        'Teacher Demo',
        'teacher',
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        updated_at = NOW()
      RETURNING id, email, name, role;
    `;

        console.log('\n📝 SQL Query to run:');
        console.log(sql);

        console.log('\n✅ Demo Teacher User Details:');
        console.log('   Email: teacher@example.com');
        console.log('   Password: teacher123');
        console.log('   Role: teacher');
        console.log('   Name: Teacher Demo');

        return {
            email: 'teacher@example.com',
            password: 'teacher123',
            hashedPassword,
            sql
        };

    } catch (error) {
        console.error('❌ Error creating demo teacher:', error);
        throw error;
    }
}

// If running directly
if (require.main === module) {
    seedTeacherDemo()
        .then(() => {
            console.log('\n✨ Demo teacher seed completed!');
            console.log('👉 Copy the SQL query above and run it in your database');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Failed to seed demo teacher:', error);
            process.exit(1);
        });
}

module.exports = seedTeacherDemo;

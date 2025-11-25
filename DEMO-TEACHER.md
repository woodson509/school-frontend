# Demo Teacher Account

## Credentials

- **Email**: `teacher@example.com`
- **Password**: `teacher123`
- **Role**: `teacher`
- **Name**: Teacher Demo

## Setup Options

### Option 1: Using Node.js Script (Recommended)

This will generate the bcrypt hash and SQL query for you:

```bash
node seed-teacher-demo.js
```

The script will output:
1. The bcrypt hashed password
2. The complete SQL query to run
3. Simply copy and execute the SQL query in your database

### Option 2: Using SQL Directly

Execute the SQL file in your PostgreSQL database:

```bash
psql -U your_username -d your_database -f seed-teacher-demo.sql
```

**Note**: You may need to replace the hashed password in the SQL file with a freshly generated one from your backend's bcrypt implementation.

### Option 3: Using Backend API

If your backend has a user creation endpoint, you can create the user via API:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "teacher123",
    "name": "Teacher Demo",
    "role": "teacher"
  }'
```

## Testing the Account

1. Start your frontend development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3001/login`

3. Login with:
   - Email: `teacher@example.com`
   - Password: `teacher123`

4. You should be redirected to `/dashboard` and see the **Teacher Dashboard** with the indigo/purple theme

## Features Available for Teachers

Once logged in as a teacher, you have access to:

### Teaching
- My Courses (`/courses`)
- My Classes (`/classes`)
- Schedule (`/schedule`)
- Lesson Planner (`/lesson-planner`)
- Library (`/library`)

### Content Creation
- Assignments (`/assignments`)
- Create Assignment (`/create-assignment`)
- Exams (`/exams`)
- Create Exam (`/create-exam`)
- Quiz Builder (`/quiz-builder`)
- Question Bank (`/question-bank`)

### Evaluation
- Grading (`/grading`)
- Grades (`/grades`)
- Attendance (`/attendance`)
- Reports (`/reports`)

### Students Management
- Students List (`/students`)
- Groups (`/groups`)
- Class Analytics (`/class-analytics`)
- Feedback (`/feedback`)

### Communication
- Messages (`/messages`)
- Announcements (`/announcements`)

### Other
- Portfolio (`/portfolio`)
- Help (`/help`)
- Profile (`/profile`)

## Security Note

⚠️ **This is a demo account for development only!**

- Do NOT use `teacher123` as a password in production
- Change the password immediately if deploying to a staging/production environment
- Consider using environment variables for demo credentials

## Troubleshooting

### Password doesn't work
The bcrypt hash may be incompatible. Run the Node.js script to generate a fresh hash:
```bash
node seed-teacher-demo.js
```

### User already exists
The SQL uses `ON CONFLICT ... DO UPDATE`, so running it multiple times will update the existing user.

### Can't login
1. Check that the backend is running
2. Verify the user exists in the database: `SELECT * FROM users WHERE email = 'teacher@example.com';`
3. Check that the `role` field is exactly `'teacher'` (lowercase)
4. Check browser console for any authentication errors

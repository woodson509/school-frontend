/**
 * Quick Debug Script for Teacher Login
 * 
 * Instructions:
 * 1. Open Browser Console (F12)
 * 2. Go to Application > Local Storage > http://localhost:3001
 * 3. Look at the 'user' key
 * 4. Paste this script in the console
 */

// Get user from localStorage
const userStr = localStorage.getItem('user');
console.log('📦 Raw user string from localStorage:', userStr);

if (userStr) {
    try {
        const user = JSON.parse(userStr);
        console.log('👤 Parsed user object:', user);
        console.log('📝 User role value:', user.role);
        console.log('📝 User role type:', typeof user.role);

        // Check all possible role field variations
        console.log('\n🔍 Checking possible role fields:');
        console.log('  user.role:', user.role);
        console.log('  user.Role:', user.Role);
        console.log('  user.user_role:', user.user_role);
        console.log('  user.userRole:', user.userRole);

        // Check exact comparisons
        console.log('\n✅ Role comparisons:');
        console.log('  role === "teacher":', user.role === 'teacher');
        console.log('  role === "Teacher":', user.role === 'Teacher');
        console.log('  role.toLowerCase() === "teacher":', user.role?.toLowerCase() === 'teacher');

        // Check AuthContext values
        console.log('\n🔐 Expected AuthContext values:');
        console.log('  isTeacher should be:', user.role === 'teacher');
        console.log('  isAdmin should be:', user.role === 'admin');
        console.log('  isStudent should be:', user.role === 'student');
        console.log('  isSuperAdmin should be:', user.role === 'superadmin');

    } catch (e) {
        console.error('❌ Error parsing user:', e);
    }
} else {
    console.error('❌ No user found in localStorage');
}

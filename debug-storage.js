// Script to debug localStorage and role detection
// Copy and paste this in the browser console after logging in

console.log('=== DEBUGGING STORAGE ===');

// 1. Check localStorage
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

console.log('Token exists:', !!token);
console.log('Token:', token);

console.log('\n=== USER DATA ===');
if (userStr) {
    try {
        const user = JSON.parse(userStr);
        console.log('Full user object:', user);
        console.log('Email:', user.email);
        console.log('Role (raw):', user.role);
        console.log('Role type:', typeof user.role);
        console.log('Role length:', user.role?.length);
        console.log('Role trimmed:', user.role?.trim());
        console.log('Role lowercase:', user.role?.toLowerCase());

        console.log('\n=== ROLE COMPARISONS ===');
        console.log('role === "teacher":', user.role === 'teacher');
        console.log('role === "admin":', user.role === 'admin');
        console.log('role === "student":', user.role === 'student');
        console.log('role.trim() === "teacher":', user.role?.trim() === 'teacher');
        console.log('role.toLowerCase() === "teacher":', user.role?.toLowerCase() === 'teacher');

        // Check for hidden characters
        console.log('\n=== CHARACTER ANALYSIS ===');
        if (user.role) {
            for (let i = 0; i < user.role.length; i++) {
                console.log(`Char ${i}: "${user.role[i]}" (code: ${user.role.charCodeAt(i)})`);
            }
        }
    } catch (e) {
        console.error('Error parsing user:', e);
    }
} else {
    console.log('No user in localStorage!');
}

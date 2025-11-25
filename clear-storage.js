/**
 * Clear Storage Utility Script
 * Use this to fix login issues caused by corrupted localStorage data
 * 
 * HOW TO USE:
 * 1. Open Browser Console (F12)
 * 2. Copy and paste this entire script
 * 3. Press Enter
 * 4. Try logging in again
 */

console.log('🧹 Clearing all authentication data...');

// Clear localStorage
localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('offline_exam_attempts');

// Clear sessionStorage
sessionStorage.clear();

console.log('✅ Storage cleared successfully!');
console.log('');
console.log('Next steps:');
console.log('1. Close this console');
console.log('2. Refresh the page (F5)');
console.log('3. Try logging in again');
console.log('');
console.log('If the problem persists, try:');
console.log('- Clearing browser cache (Ctrl+Shift+Delete)');
console.log('- Using incognito/private mode');

// Auto-reload to login page
setTimeout(() => {
    console.log('🔄 Redirecting to login page...');
    window.location.href = '/login';
}, 2000);

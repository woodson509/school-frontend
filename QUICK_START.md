# Quick Start Guide - Frontend

## 🚀 Get Started in 3 Minutes

### 1. Install Dependencies
```bash
cd school-frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Start Development Server
```bash
npm run dev
```

Open browser at `http://localhost:3001`

## 🔐 Demo Login

Click any quick login button on login page:
- **Admin**: admin@example.com / admin123
- **Teacher**: teacher@example.com / teacher123
- **Student**: student@example.com / student123
- **Agent**: agent@example.com / agent123

## 📱 Test PWA Features

### 1. Install as App
**Desktop:**
- Chrome: Click install icon in address bar
- Edge: Menu → Apps → Install

**Mobile:**
- iOS Safari: Share → Add to Home Screen
- Android Chrome: Menu → Add to Home Screen

### 2. Test Offline Mode
1. Open DevTools (F12)
2. Network tab → Throttling → Offline
3. Navigate and take exam
4. Answers saved to localStorage
5. Go back online → auto-sync

### 3. Test Exam System
1. Login as **Student**
2. Click "Start Exam" on any exam
3. Notice:
   - Timer starts countdown
   - Auto-save every 10 seconds
   - Navigation is locked
   - Offline support active
4. Answer questions
5. Submit before timer expires

## 🎯 Key Features to Test

### Navigation Locking (During Exam)
- Try to close tab → Warning appears
- Try to navigate away → Confirmation required
- Refresh page → Exam state restored from localStorage

### Offline Capabilities
1. Start exam online
2. Go offline (disable network)
3. Continue answering questions
4. Check localStorage for saved data
5. Go back online
6. Data syncs automatically

### Role-Based Dashboards
Each role sees different content:
- **Admin**: All courses, all exams, user management
- **Teacher**: Own courses, create exams, view attempts
- **Student**: Enrolled courses, available exams
- **Agent**: Sales dashboard, commission tracking

## 🛠️ Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📦 Project Structure

```
src/
├── components/          # Reusable components
│   └── Timer.jsx       # Exam countdown timer
├── contexts/           # React contexts
│   └── AuthContext.jsx # Auth state management
├── pages/              # Page components
│   ├── LoginPage.jsx   # Login page
│   ├── DashboardPage.jsx # Role dashboards
│   ├── CoursesPage.jsx # Course listing
│   └── ExamPage.jsx    # Exam taking
├── services/           # API services
│   └── api.js         # API calls & offline storage
├── App.jsx            # Main app with routing
└── main.jsx           # Entry point + PWA setup
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3002  // Change this
}
```

### Backend Not Responding
1. Check backend is running on port 3000
2. Verify `.env` has correct API URL
3. Check CORS settings on backend

### Service Worker Not Working
1. Ensure using HTTPS or localhost
2. Clear browser cache
3. Unregister old service workers in DevTools
4. Hard refresh (Ctrl+Shift+R)

### Exam Not Saving
1. Check localStorage in DevTools
2. Look for `offline_exam_attempts` key
3. Verify `examId` is correct
4. Check browser console for errors

## 📊 File Sizes (After Build)

```
dist/
├── index.html          ~2KB
├── assets/
│   ├── index.js       ~150KB (gzipped)
│   └── index.css      ~20KB (gzipped)
└── sw.js              ~5KB
```

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#your-color-here'
    }
  }
}
```

### Modify Exam Timer
Edit `src/components/Timer.jsx`:
- Warning thresholds (currently 5min and 1min)
- Auto-submit behavior
- Visual styling

### Add New Routes
Edit `src/App.jsx`:
```jsx
<Route path="/new-page" element={<NewPage />} />
```

## 🚀 Deploy to Production

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

## 📝 Next Steps

1. ✅ Test all features locally
2. ✅ Review role-based permissions
3. ✅ Test offline functionality
4. ✅ Try exam system end-to-end
5. ✅ Install as PWA on device
6. ✅ Customize branding/colors
7. ✅ Add your school logo
8. ✅ Deploy to production

## 💡 Tips

- Use Chrome DevTools Application tab to inspect:
  - Service Workers
  - Cache Storage
  - Local Storage
  - Manifest
  
- Test on real mobile devices for best PWA experience

- Enable "Offline" in Network tab to test offline mode

- Use Lighthouse to check PWA score and performance

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Review browser console for error messages
- Test with backend API using Postman
- Verify all environment variables are set

---

Happy coding! 🎉

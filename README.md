# School Management System - Frontend

A Progressive Web App (PWA) built with React and Vite for the School Management System. Features offline support, exam system with timer, and role-based dashboards.

## 🚀 Features

- **Progressive Web App (PWA)**: Install on any device with offline support
- **Role-Based Dashboards**: Customized views for Admin, Teacher, Student, and Agent
- **Exam System**: Timer-based exams with offline capability
- **Offline Support**: Continue working even without internet connection
- **Navigation Locking**: Prevents leaving during active exams
- **Auto-Save**: Exam answers saved every 10 seconds to localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

## 🛠️ Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
# Create .env file
VITE_API_BASE_URL=http://localhost:3000/api
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3001`

## 🏗️ Project Structure

```
school-frontend/
├── public/
│   ├── sw.js                    # Service worker for PWA
│   ├── offline.html             # Offline fallback page
│   └── manifest.json            # PWA manifest (auto-generated)
├── src/
│   ├── components/
│   │   └── Timer.jsx            # Exam countdown timer
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── pages/
│   │   ├── LoginPage.jsx        # Login page
│   │   ├── DashboardPage.jsx   # Role-based dashboards
│   │   ├── CoursesPage.jsx     # Course listing
│   │   └── ExamPage.jsx         # Exam taking page
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── vite.config.js               # Vite configuration with PWA
├── tailwind.config.js           # Tailwind CSS config
└── package.json
```

## 🎯 Key Features

### 1. PWA Support

The app works as a Progressive Web App with:
- **Offline functionality**: Cache API responses and static assets
- **Install prompt**: Add to home screen on mobile devices
- **Service worker**: Background sync and push notifications
- **Responsive**: Adapts to any screen size

### 2. Exam System

**Features:**
- ⏱️ Countdown timer with warnings at 5 minutes and 1 minute
- 🔒 Navigation locking during active exams
- 💾 Auto-save every 10 seconds
- 📴 Offline support with localStorage
- 🔄 Auto-sync when back online

**Student Flow:**
1. View available exams on dashboard
2. Click "Start Exam" to begin
3. Answer questions with auto-save
4. Submit before timer expires
5. Exam locks navigation to prevent accidental exit

### 3. Role-Based Dashboards

**Admin Dashboard:**
- View all courses and exams
- Manage users
- System-wide statistics
- Create courses and exams

**Teacher Dashboard:**
- View personal courses
- Create and manage exams
- View student attempts
- Grade submissions

**Student Dashboard:**
- View enrolled courses
- Take available exams
- Track completed exams
- View grades

**Agent Dashboard:**
- Record sales
- View commission earnings
- Track pending payments
- Sales statistics

### 4. Offline Capabilities

**What works offline:**
- View cached courses and exams
- Continue active exams
- Answer auto-saved to localStorage
- Navigate between cached pages

**What syncs when online:**
- Exam submissions
- New course data
- Updated exam information
- Dashboard statistics

## 🔐 Authentication

### Demo Accounts

The app includes quick login buttons for testing:

| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | admin@example.com      | admin123    |
| Teacher  | teacher@example.com    | teacher123  |
| Student  | student@example.com    | student123  |
| Agent    | agent@example.com      | agent123    |

### Login Flow

1. Navigate to `/login`
2. Enter credentials
3. JWT token stored in localStorage
4. Redirected to role-based dashboard
5. Token included in all API requests

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the site
2. Click install icon in address bar
3. Or: Menu → Install School LMS

### Mobile (iOS)
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"

### Mobile (Android)
1. Open in Chrome
2. Tap "Add to Home Screen" prompt
3. Or: Menu → Add to Home Screen

## 🎨 Styling

Built with **Tailwind CSS** for:
- Utility-first CSS
- Responsive design
- Custom components
- Dark mode support (optional)

### Custom Colors
```js
primary: '#2563eb'  // Blue
success: '#10b981'  // Green
warning: '#f59e0b'  // Orange
danger:  '#ef4444'  // Red
```

## 🔧 Development

### Available Scripts

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

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Feature Flags (optional)
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE=true
```

## 📦 Build & Deploy

### Production Build

```bash
npm run build
```

Output in `dist/` folder with:
- Minified JavaScript
- Optimized CSS
- Service worker
- PWA manifest
- Cached assets

### Deployment Options

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Traditional Hosting:**
1. Run `npm run build`
2. Upload `dist/` folder
3. Configure server to serve `index.html` for all routes

### Server Configuration

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Login with all roles
- [ ] Logout functionality
- [ ] Token expiration handling
- [ ] Protected route access

**Exam System:**
- [ ] Start exam
- [ ] Timer countdown
- [ ] Auto-save functionality
- [ ] Submit exam
- [ ] Navigation locking
- [ ] Offline exam continuation

**PWA:**
- [ ] Install prompt appears
- [ ] Works offline
- [ ] Service worker registers
- [ ] Cache updates properly

**Responsive:**
- [ ] Mobile view (< 768px)
- [ ] Tablet view (768px - 1024px)
- [ ] Desktop view (> 1024px)

## 🐛 Troubleshooting

### Service Worker Not Registering

1. Ensure HTTPS or localhost
2. Clear browser cache
3. Check browser console for errors
4. Verify `public/sw.js` exists

### Offline Mode Not Working

1. Check service worker registration
2. Verify cache storage in DevTools
3. Test with Network tab throttling
4. Check localStorage for saved data

### Exam Timer Issues

1. Clear localStorage
2. Check system time is correct
3. Verify API returns correct timestamps
4. Test with different browsers

### API Connection Issues

1. Verify backend is running
2. Check `VITE_API_BASE_URL` in .env
3. Check CORS configuration on backend
4. Inspect network requests in DevTools

## 📊 Performance

### Lighthouse Scores (Target)

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 90+
- **PWA**: 100

### Optimization Tips

1. **Images**: Use WebP format
2. **Code Splitting**: Implemented with lazy loading
3. **Caching**: Service worker caches assets
4. **Minification**: Automatic in production build
5. **Tree Shaking**: Vite removes unused code

## 🔒 Security

### Best Practices Implemented

- ✅ JWT tokens stored securely
- ✅ HTTPS enforced in production
- ✅ XSS protection via React
- ✅ CSRF tokens for state-changing operations
- ✅ Input validation and sanitization
- ✅ Secure service worker implementation

### Security Checklist

- [ ] Enable HTTPS
- [ ] Set strong JWT secret
- [ ] Implement rate limiting
- [ ] Add CSP headers
- [ ] Regular dependency updates
- [ ] Security audit before production

## 🚀 Future Enhancements

- [ ] Push notifications for exam reminders
- [ ] Real-time updates with WebSocket
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] File upload for assignments
- [ ] Video conferencing integration
- [ ] Advanced exam question types

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Support

For issues and questions:
- Open an issue in the repository
- Check existing documentation
- Review troubleshooting section

---

Built with ❤️ using React + Vite + Tailwind CSS

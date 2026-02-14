# SmartMind LMS - Setup & Deployment Guide

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env (VITE_API_URL should point to backend)
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)

**Required for avatar uploads:**
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Get from**: https://cloudinary.com/ (free account)

**Required for password reset emails:**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Database:**
```
MONGODB_URI=mongodb://localhost:27017/smartmind
# or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/smartmind
```

**JWT:**
```
JWT_SECRET=use_a_strong_random_string_at_least_32_chars
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=SmartMind LMS
VITE_NODE_ENV=development
```

## 📋 Checklist Before Push to Git

- [ ] `.env` files are in `.gitignore` ✓ (already configured)
- [ ] No API keys/secrets in code
- [ ] `.env.example` files exist with instructions
- [ ] All dependencies installed (`npm install`)
- [ ] No uncommitted changes to `node_modules/`
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3002
- [ ] Avatar upload working (requires Cloudinary)
- [ ] Password reset email working (optional but recommended)

## 🚀 Deployment Steps

### Step 1: Get Cloudinary Credentials

1. Go to https://cloudinary.com/
2. Sign up (free tier available)
3. Go to Dashboard → Settings → API Keys
4. Copy credentials:
   - Cloud Name
   - API Key
   - API Secret
5. Add to backend `.env`:

```bash
CLOUDINARY_CLOUD_NAME=abc123
CLOUDINARY_API_KEY=def456
CLOUDINARY_API_SECRET=ghi789
```

### Step 2: Get MongoDB Connection

**Option A: Local MongoDB**
```
MONGODB_URI=mongodb://localhost:27017/smartmind
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartmind
```

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Edit .env with your credentials
nano .env  # or your editor

# Verify configuration
echo $CLOUDINARY_CLOUD_NAME  # Should return your cloud name

# Start server
npm run dev
```

**Expected output:**
```
listening on port 5000
MongoDB connected
```

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Edit .env if needed (default should work for local dev)
nano .env

# Start dev server
npm run dev
```

**Expected output:**
```
VITE v5.x.x ready in xxx ms
Local: http://localhost:3002/
```

### Step 5: Test Features

**Test Avatar Upload:**
1. Go to http://localhost:3002/profile
2. Click avatar image
3. Select image file
4. Should see success message
5. Avatar should display

**Test Forgot Password:**
1. Go to http://localhost:3002/login
2. Click "Forgot password?"
3. Enter email
4. Should see test code (in development)
5. Enter code → Set new password
6. Should redirect to login

## 🐛 Troubleshooting

### Avatar Upload Not Working

**Check:**
1. Cloudinary credentials in backend `.env`
2. Backend is running (`npm run dev`)
3. Browser console for errors (F12)
4. Backend console for error messages

**Solution:**
```bash
# Restart backend after adding Cloudinary credentials
npm run dev
```

### "Cannot find module" errors

**Solution:**
```bash
npm install
```

### Port already in use

**Backend (port 5000):**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Frontend (port 3002):**
```bash
# Vite will auto-find next available port
npm run dev
```

### MongoDB Connection Error

**Check:**
1. MongoDB is running (`mongod` for local)
2. Connection string is correct
3. Internet connection (if using MongoDB Atlas)

## 📤 Before Pushing to GitHub

```bash
# Verify .env is ignored
cat .gitignore | grep ".env"

# Verify no secrets in code
git diff --staged | grep -i "password\|secret\|key\|token"

# Add all changes (respects .gitignore)
git add .

# Commit
git commit -m "Add avatar upload and forgot password features"

# Push
git push origin main
```

## 🔐 Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] No hardcoded API keys in source code
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] CORS is configured (CORS_ORIGIN in .env)
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured (optional)
- [ ] Input validation on all endpoints
- [ ] Password hashing with bcrypt ✓
- [ ] File upload size limits ✓ (5MB)

## 📊 Project Structure

```
SmartMind/
├── backend/
│   ├── .env (ignored in git)
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   └── ...
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── ...
│   └── middleware/
│       └── auth.js
│
├── frontend/
│   ├── .env (ignored in git)
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── pages/
│       │   ├── Profile.jsx
│       │   ├── ForgotPassword.jsx
│       │   └── ...
│       ├── context/
│       │   └── AuthContext.jsx
│       └── components/
│           ├── Navbar.jsx
│           ├── Footer.jsx
│           └── ...
│
├── .gitignore
├── README.md
└── package.json
```

## 🎯 Next Steps

1. **Set up Cloudinary** for avatar uploads
2. **Configure MongoDB** (local or Atlas)
3. **Test all features** before deployment
4. **Review security** settings
5. **Deploy to production** (Heroku, Railway, etc.)

## 📞 Support

- Cloudinary Docs: https://cloudinary.com/documentation
- MongoDB Docs: https://docs.mongodb.com/
- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/

---

**Last Updated**: February 14, 2026
**Status**: Ready for Production

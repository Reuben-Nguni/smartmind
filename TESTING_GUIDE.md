# SmartMind LMS - Testing Guide

## ✅ Pre-Testing Checklist

- [x] Backend `.env` has Cloudinary credentials
- [x] Frontend `.env` has VITE_API_URL=http://localhost:5000
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3002
- [ ] MongoDB Atlas connection working

## 🚀 Quick Start Commands

### Terminal 1 - Start Backend

```bash
cd /home/ben/Desktop/PROJECTS/SmartMind/backend
npm run dev
```

**Expected output:**
```
listening on port 5000
MongoDB connected
```

### Terminal 2 - Start Frontend

```bash
cd /home/ben/Desktop/PROJECTS/SmartMind/frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x ready in xxx ms
Local: http://localhost:3002/
```

## 🧪 Feature Testing

### 1. Avatar Upload (Critical - Your issue)

**Steps:**
1. Open http://localhost:3002/login
2. Login with test account
3. Click profile icon → "Profile"
4. Click on the avatar image
5. Select an image file (JPG, PNG, etc.)
6. Check console (F12) for logs
7. Verify avatar updates

**Success indicators:**
- ✅ Browser console shows: "Avatar upload started: { fileName: ..., fileSize: ..., fileType: ... }"
- ✅ Browser console shows: "Uploading avatar to /api/users/avatar"
- ✅ Browser console shows response with avatar URL
- ✅ Avatar image updates in the UI
- ✅ Profile page shows success message

**If it fails:**
- Open browser DevTools (F12)
- Go to Network tab
- Upload avatar again
- Check the `/api/users/avatar` request:
  - Status should be 200
  - Response should contain avatar URL from Cloudinary
  - If error: note the error message

**Backend debugging:**
```bash
# In backend terminal, look for:
# 1. File received logs from multer
# 2. Cloudinary upload confirmation
# 3. User update confirmation
```

---

### 2. Authentication Flow

#### 2a. Register

**Steps:**
1. Go to http://localhost:3002/register
2. Fill in form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: Test@123
   - Role: learner
3. Submit
4. See "Registration successful" message

**Success indicators:**
- ✅ Redirects to login page
- ✅ New user appears in database
- ✅ Status shows "pending" (admin approval needed)

#### 2b. Login

**Steps:**
1. Go to http://localhost:3002/login
2. Enter credentials
3. Submit

**Success indicators:**
- ✅ Redirects to dashboard
- ✅ Navbar shows username
- ✅ JWT token in localStorage

#### 2c. Forgot Password

**Steps:**
1. Go to http://localhost:3002/login
2. Click "Forgot password?"
3. Enter email
4. Check backend console for reset code
5. Enter code
6. Set new password
7. Login with new password

**Success indicators:**
- ✅ Step 1: Receives code message
- ✅ Step 2: Code accepted
- ✅ Step 3: Password updated
- ✅ Can login with new password

---

### 3. Notifications

**Steps:**
1. Login as learner
2. Click bell icon in navbar
3. Go to Notifications page
4. See learner-specific content

**Success indicators:**
- ✅ Learner sees: Timetable tab, Announcements tab
- ✅ Timetable shows 7 days × 10 time slots
- ✅ Announcements show mock data

**Tutor test:**
1. Login as tutor
2. Click bell icon
3. Go to Notifications
4. See "My Lessons" tab with lesson form

---

### 4. Profile Updates

**Steps:**
1. Go to Profile page
2. Click "Info" tab
3. Update name, email, phone, bio
4. Click "Save Changes"

**Success indicators:**
- ✅ Success message appears
- ✅ Changes persist after refresh
- ✅ All fields update correctly

---

### 5. Change Password

**Steps:**
1. Go to Profile page
2. Click "Change Password" tab
3. Enter:
   - Current password
   - New password
   - Confirm password
4. Click "Change Password"

**Success indicators:**
- ✅ Success message
- ✅ Can login with new password
- ✅ Old password doesn't work

---

### 6. Navigation & Routing

**Test all pages load:**
- [ ] Home: http://localhost:3002/
- [ ] Courses: http://localhost:3002/courses
- [ ] About: http://localhost:3002/about
- [ ] Services: http://localhost:3002/services
- [ ] Contact: http://localhost:3002/contact
- [ ] Login: http://localhost:3002/login
- [ ] Register: http://localhost:3002/register
- [ ] Forgot Password: http://localhost:3002/forgot-password
- [ ] Profile: http://localhost:3002/profile
- [ ] Learner Dashboard: http://localhost:3002/learner-dashboard
- [ ] Tutor Dashboard: http://localhost:3002/tutor-dashboard
- [ ] Admin Dashboard: http://localhost:3002/admin-dashboard

**All pages should have:**
- ✅ Navbar at top
- ✅ Footer at bottom (not on error pages)
- ✅ Proper styling

---

## 🔍 Debugging Commands

### Check Backend Status

```bash
# Check if running
curl http://localhost:5000/

# Should return:
# {"message":"SmartMind LMS API is running"}
```

### Check Frontend Build

```bash
# Frontend should be on port 3002
curl http://localhost:3002/

# Should return HTML content
```

### View Backend Logs

```bash
# In backend terminal, you should see:
# - POST requests to /api/users/avatar
# - MongoDB operations
# - Any errors
```

### View Frontend Logs

```bash
# In browser console (F12):
# - Avatar upload logs
# - API call logs
# - Component render logs
```

---

## 📊 API Endpoint Testing

### Use this curl command to test avatar upload manually:

```bash
# Get auth token first
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartmind.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Upload avatar
curl -X POST http://localhost:5000/api/users/avatar \
  -H "Authorization: Bearer $TOKEN" \
  -F "avatar=@/path/to/image.jpg"

# Should return:
# {"message":"Avatar updated successfully","avatar":"https://cloudinary.url/...","user":{...}}
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "No file uploaded" error

**Cause:** Frontend not sending file correctly

**Check:**
```javascript
// Profile.jsx should have:
headers: { 'Content-Type': 'multipart/form-data' }
// And FormData should have:
formData.append('avatar', file)
```

**Solution:** ✅ Already fixed in code

---

### Issue 2: Cloudinary upload fails

**Symptoms:**
- Error: "Unauthorized"
- Error: "Invalid credentials"

**Check:**
```bash
# Verify .env has credentials
cat backend/.env | grep CLOUDINARY

# Should show:
# CLOUDINARY_CLOUD_NAME=dbzuqcdpf
# CLOUDINARY_API_KEY=285233952944587
# CLOUDINARY_API_SECRET=hfCxVGmCl1j6lt37u5u38TOTHZ4
```

**Solution:** Restart backend after .env changes

---

### Issue 3: CORS errors

**Symptom:** 
```
Access to XMLHttpRequest at 'http://localhost:5000' blocked by CORS
```

**Solution:**
```bash
# Backend has CORS enabled
# Should work automatically
```

---

### Issue 4: Port already in use

**Symptom:**
```
Error: listen EADDRINUSE :::5000
```

**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3002
lsof -ti:3002 | xargs kill -9

# Then restart
```

---

## 📋 Full Test Sequence

**Time: ~15 minutes**

1. ✅ Start backend (2 min)
2. ✅ Start frontend (1 min)
3. ✅ Test registration (1 min)
4. ✅ Test login (1 min)
5. ✅ Test avatar upload (3 min) ← Your focus
6. ✅ Test profile update (1 min)
7. ✅ Test forgot password (2 min)
8. ✅ Test notifications (1 min)
9. ✅ Test all page navigation (2 min)

---

## 🎯 Priority Testing

**Do these first:**
1. Backend status: `curl http://localhost:5000/`
2. Frontend loads: Visit http://localhost:3002/
3. Avatar upload: Profile page → upload image ← YOUR ISSUE
4. Verify console logs appear

**If avatar upload works:**
- Proceed to test other features
- Ready for git push

**If avatar upload fails:**
- Check browser console (F12)
- Check backend console
- Verify .env Cloudinary credentials
- Restart backend

---

## ✨ Final Verification Before Push

```bash
# 1. Check .env files exist and have credentials
[ -f backend/.env ] && echo "✅ backend/.env exists"
[ -f frontend/.env ] && echo "✅ frontend/.env exists"

# 2. Check .gitignore excludes .env
grep ".env" .gitignore && echo "✅ .env is in .gitignore"

# 3. Test avatar upload works (manual test)

# 4. All features work (use test sequence above)

# 5. Commit and push
git add .
git commit -m "Feature complete: avatar upload, forgot password, notifications"
git push origin main
```

---

**Last Updated:** February 14, 2026
**Status:** Ready for Testing

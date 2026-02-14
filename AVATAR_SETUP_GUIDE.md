# Avatar Upload - Cloudinary Setup Guide

## Error: "Error uploading avatar"

### Solution Steps:

#### 1. **Ensure Cloudinary Credentials in .env**

Check `/backend/.env` has these variables:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 2. **Get Cloudinary Credentials**

1. Go to https://cloudinary.com/
2. Sign up (free account available)
3. Go to Dashboard/Settings
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Paste into `.env` file

#### 3. **Restart Backend Server**

After updating `.env`:
```bash
cd backend
npm run dev
```

#### 4. **Verify Dependencies**

Ensure these packages are installed:
```bash
cd backend
npm install cloudinary multer multer-storage-cloudinary
```

#### 5. **Check Network Tab**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try uploading avatar
4. Check POST to `/api/users/avatar`
5. Look for:
   - Status: 200 (success) or 400/500 (error)
   - Response message

#### 6. **Server Logs**

Check backend console for errors:
```
[Error] Avatar upload: ...
```

### Common Issues:

#### Issue: "No Cloudinary credentials"
**Solution**: Verify `.env` variables are set correctly

#### Issue: "File type not allowed"
**Solution**: Only image files (jpg, png, gif, webp) allowed. Max 5MB.

#### Issue: "Network error"
**Solution**: Check backend is running on port 5000

#### Issue: "Cloudinary API error"
**Solution**: Verify API key and secret are correct

### Testing Upload:

1. Go to Profile page (`/profile`)
2. Click avatar image
3. Select image file
4. Check for success message
5. Avatar should display immediately

### Fallback: Text Avatar

If Cloudinary fails, system uses initials as avatar:
- First letter of name
- Circular background with color
- No upload needed

### Production Deployment:

1. Add Cloudinary credentials to production `.env`
2. Keep `.env` file in production server
3. Never commit `.env` to git
4. Use environment variables in hosting platform

### File Upload Limits:

- Max file size: 5MB
- Allowed formats: JPG, PNG, GIF, WebP
- Auto-resized: 300x300px
- Auto-cropped: Face-focused

### API Endpoint:

**POST** `/api/users/avatar`
- Authentication: Required (JWT token)
- Content-Type: multipart/form-data
- Field: `avatar` (file)

**Response:**
```json
{
  "message": "Avatar updated successfully",
  "avatar": "https://cloudinary.com/...",
  "user": { ... }
}
```

### Debugging Steps:

1. **Check Console Errors**:
   - Browser: Press F12 → Console tab
   - Backend: Check npm run dev output

2. **Verify Token**:
   - Must be logged in
   - JWT token must be valid
   - Token sent in Authorization header

3. **Test with cURL** (alternative):
```bash
curl -X POST http://localhost:5000/api/users/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@/path/to/image.jpg"
```

4. **Check Cloudinary Dashboard**:
   - Log in to cloudinary.com
   - Check "Media Library"
   - Look in "smartmind/avatars" folder

### Need Help?

Check these files:
- `/backend/routes/users.js` - Avatar endpoint
- `/frontend/src/pages/Profile.jsx` - Upload form
- `/backend/config/cloudinary.js` - Cloudinary config
- `/backend/.env` - Credentials (NEVER commit)

---

**Status**: Avatar upload should work after credentials are set
**Test**: Upload an image in Profile page
**Next**: Verify in Cloudinary dashboard

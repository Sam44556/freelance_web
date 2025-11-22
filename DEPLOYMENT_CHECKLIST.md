# Deployment Checklist for Render

## ✅ Code Changes (Already Done)
- [x] Updated frontend `.env` to use `REACT_APP_BACKEND_URL`
- [x] Updated `AppContext.jsx` to read `REACT_APP_BACKEND_URL`
- [x] Updated `JobDetails.jsx` to read `REACT_APP_BACKEND_URL`
- [x] Backend CORS configured to accept all origins
- [x] Backend reads PORT from environment variables

## 🚀 Render Deployment Steps

### Backend Service
1. **Verify Environment Variables** in Render Dashboard:
   - `PORT` - (Render sets this automatically, but verify it exists)
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key

2. **Verify Build & Start Commands**:
   - Build Command: `npm install`
   - Start Command: `npm start` or `node server.js`

3. **Check Backend URL**:
   - Your backend URL: `https://freelance-web-d78w.onrender.com`
   - Test it: Visit `https://freelance-web-d78w.onrender.com/api/health`
   - Should return: `{"ok":true}`

### Frontend Service
1. **Set Environment Variable** in Render Dashboard:
   - Key: `REACT_APP_BACKEND_URL`
   - Value: `https://freelance-web-d78w.onrender.com`

2. **Verify Build & Start Commands**:
   - Build Command: `npm install && npm run build`
   - Start Command: `serve -s build` (or Render's default static site serving)

3. **Important**: After adding the environment variable, you MUST:
   - Trigger a manual redeploy OR
   - Push a new commit to trigger automatic redeploy

## 🧪 Testing After Deployment

1. Open your frontend URL in browser
2. Open browser DevTools (F12) → Network tab
3. Try to login or fetch data
4. Check if API calls are going to `https://freelance-web-d78w.onrender.com/api/...`
5. If you see errors, check:
   - Response status codes (404, 500, CORS errors)
   - Request URLs (should not be localhost)

## 🔍 Common Issues

### Issue: Frontend still calling localhost
**Solution**: Environment variable not set in Render. Add `REACT_APP_BACKEND_URL` and redeploy.

### Issue: CORS errors
**Solution**: Your backend already has `origin: true`, so this should work. If not, explicitly allow your frontend domain.

### Issue: 404 on API routes
**Solution**: Check that backend is running and routes are registered correctly.

### Issue: Environment variables not working
**Solution**: After adding env vars in Render, you MUST redeploy for them to take effect.

## 📝 Next Steps

1. Go to Render Dashboard
2. Add `REACT_APP_BACKEND_URL` to frontend service
3. Manually trigger a redeploy of the frontend
4. Test the application
5. Check browser console for any errors

---

**Note**: Changes to `.env` files in your local repo do NOT affect Render deployment. You must set environment variables in Render's dashboard.

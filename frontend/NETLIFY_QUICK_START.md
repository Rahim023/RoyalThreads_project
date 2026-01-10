# 🚀 Quick Netlify Deployment Checklist

## Pre-Deployment ✅

- [x] All hardcoded API URLs replaced with environment variables
- [x] Vite build configuration optimized
- [x] Netlify configuration (netlify.toml) set up
- [x] Environment files (.env.example, .env.production) created
- [x] No build errors found
- [x] SPA routing configured

---

## Deployment Steps

### Step 1: Prepare Your Backend
```bash
# Make sure your backend is:
✓ Running successfully
✓ Accessible from the internet (not localhost)
✓ CORS configured to allow your Netlify domain
```

### Step 2: Deploy to Netlify

**Option A - Easiest (Recommended):**
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Netlify auto-detects:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

**Option B - CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Step 3: Add Environment Variable (CRITICAL!)
1. Go to your Netlify site dashboard
2. Settings → Build & deploy → Environment
3. Add variable:
   ```
   VITE_API_BASE=https://your-backend-url.com
   ```
4. **Redeploy** your site after adding the variable

### Step 4: Verify Deployment
1. Visit your Netlify site
2. Open DevTools (F12) → Console
3. Navigate to different pages
4. Check that API calls succeed (no 404s)
5. Test features: Add to cart, wishlist, checkout

---

## Common Issues & Fixes

### ❌ "Cannot find localhost:5000"
**Solution:** You forgot to add `VITE_API_BASE` in Netlify settings
→ Add it now in Site Settings → Build & deploy → Environment

### ❌ "Page refreshes show 404"
**Solution:** Already fixed! netlify.toml redirects all routes to index.html
→ This should work automatically

### ❌ "API calls fail with CORS error"
**Solution:** Backend CORS settings need to allow your domain
→ Update your backend's CORS configuration

### ❌ "Build fails"
**Solution:** Check the Netlify build logs
→ Go to Deploys tab and click the failed deploy to see the error

---

## What Your Backend Needs

Add this to your backend (Node.js example):
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-netlify-domain.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

---

## Files Modified

| Count | Type | Status |
|-------|------|--------|
| 13 | Page Components | ✅ Updated |
| 1 | Context Files | ✅ Updated |
| 2 | Component Files | ✅ Updated |
| 3 | Config Files | ✅ Created |
| 1 | Build Config | ✅ Created |
| 2 | Documentation | ✅ Created |

**Total: 22 files updated/created**

---

## Final Checklist

Before hitting "Deploy":

- [ ] Backend is running and accessible
- [ ] Backend CORS allows your Netlify domain
- [ ] You have your backend API URL ready (e.g., https://api.example.com)
- [ ] GitHub repository is connected to Netlify
- [ ] Ready to add `VITE_API_BASE` environment variable

---

## After Deployment

- [ ] Site loads without errors
- [ ] Navigation works (routes don't 404)
- [ ] API calls succeed (check Network tab)
- [ ] Forms work (cart, checkout, login)
- [ ] No "localhost" references in console

---

## Support

📖 Read the full guide: [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md)
📋 See all changes: [DEPLOYMENT_FIXES_SUMMARY.md](./DEPLOYMENT_FIXES_SUMMARY.md)

---

**Your frontend is ready! 🎉**

The hard part is done. Now just connect to Netlify and add one environment variable!

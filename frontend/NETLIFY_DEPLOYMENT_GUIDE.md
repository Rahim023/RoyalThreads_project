# Netlify Deployment Guide

## Setup Instructions

Your frontend is now ready for Netlify deployment! Follow these steps:

### 1. **Environment Variables Configuration**

The frontend now uses the `VITE_API_BASE` environment variable to configure your backend API URL.

#### For Local Development:
```bash
# Your .env.local file already has this configured
VITE_API_BASE=http://localhost:5000
```

#### For Netlify Production:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Build & deploy** → **Environment**
3. Click **Edit variables**
4. Add the following environment variable:
   ```
   Key: VITE_API_BASE
   Value: https://your-backend-api-url.com (your actual backend URL)
   ```

### 2. **Deploy to Netlify**

#### Option A: Using Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### Option B: Connect GitHub Repository
1. Push your code to GitHub
2. Go to Netlify and click **New site from Git**
3. Select your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables (see step 1 above)
6. Click **Deploy site**

#### Option C: Manual Deployment
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### 3. **Verify the Build**

The netlify.toml file is configured with:
- ✅ SPA redirects (all routes redirect to index.html)
- ✅ Build command and publish directory
- ✅ Cache control headers for optimal performance
- ✅ Asset caching (31 days for bundled assets)

### 4. **Common Issues & Solutions**

**Issue: 404 errors on page refresh**
- ✅ Already fixed! The netlify.toml redirects all routes to index.html

**Issue: API calls fail with "localhost:5000"**
- ✅ Already fixed! All hardcoded URLs now use the `VITE_API_BASE` environment variable
- Make sure you've added the environment variable in Netlify's settings

**Issue: Environment variable not being used**
- Make sure the variable name is exactly `VITE_API_BASE`
- Rebuild your site after adding environment variables
- Vite prefixes with `VITE_` by default for security

### 5. **Backend Requirements**

Your backend needs to:
1. Handle CORS requests from your Netlify domain
2. Be publicly accessible from the internet
3. Update CORS settings if needed:
   ```javascript
   // Example for Node.js/Express
   const cors = require('cors');
   app.use(cors({
     origin: ['https://your-netlify-domain.netlify.app', 'http://localhost:3000'],
     credentials: true
   }));
   ```

### 6. **Environment Variable Format**

The format expected is:
```
VITE_API_BASE=https://your-backend-domain.com
```

**Not:**
```
VITE_API_BASE=https://your-backend-domain.com/api  ❌
```

The `/api` part is added automatically in your code.

### 7. **Post-Deployment Checklist**

- [ ] Environment variable `VITE_API_BASE` is set in Netlify
- [ ] Backend server is running and accessible
- [ ] Backend CORS allows your Netlify domain
- [ ] Site builds successfully (check Deploys tab)
- [ ] No 404 errors on page refresh
- [ ] API calls are successful (check browser console)

---

## Need Help?

- Check the **Deploys** tab in Netlify for build logs
- Open browser DevTools (F12) and check the **Network** tab for API calls
- Verify the `VITE_API_BASE` value is correct in the Netlify environment variables
- Make sure your backend is running and accessible from the internet

Happy deploying! 🚀

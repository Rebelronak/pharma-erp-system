# Railway.app Deployment Guide

## ✅ Code Fixed - Ready to Deploy!

All TypeScript errors fixed:
- ✅ Button imports added (patients, sales, medical pages)
- ✅ Settings page router fixed
- ✅ Database changed to PostgreSQL
- ✅ API routes schema mismatches fixed
- ✅ Seed file cleaned up

## 🚀 Railway Deployment Steps

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → Sign up with GitHub
3. Authorize Railway to access your repositories

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository (or create new one first)
4. Railway will auto-detect it's a Next.js app

### Step 3: Add PostgreSQL Database
1. In your project dashboard, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway automatically creates database and sets DATABASE_URL

### Step 4: Configure Environment Variables
Railway should auto-set DATABASE_URL, but add these too:

```env
DATABASE_URL=(already set by Railway)
NEXTAUTH_SECRET=generate-random-32-char-string-here
NEXTAUTH_URL=https://your-app-name.up.railway.app
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
Run in your terminal:
```bash
openssl rand -base64 32
```
Or use: https://generate-secret.vercel.app

### Step 5: Deploy Settings
Railway auto-configures, but verify:

**Build Command:** 
```bash
prisma generate && prisma migrate deploy && npm run build
```

**Start Command:**
```bash
npm start
```

### Step 6: Run Database Migration
After first deployment, go to your app's settings:
1. Click on your web service
2. Go to "Settings" tab
3. Add custom start command:
```bash
npx prisma migrate deploy && npm start
```

### Step 7: Seed Database (Optional)
Connect to Railway's PostgreSQL and run:
```bash
npx tsx prisma/seed-railway.ts
```

Or manually create admin user in Railway's database dashboard.

## 📋 Pre-Deployment Checklist

Before deploying, verify locally:

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Check for TypeScript errors
npm run build
```

If build succeeds locally, it will work on Railway!

## 🔧 Troubleshooting

### Build Fails
- Check Railway build logs
- Ensure all dependencies in package.json
- Verify prisma generate runs successfully

### App Crashes on Start
- Check "Deployments" tab → View logs
- Usually database connection issue
- Verify DATABASE_URL is set correctly

### Database Connection Error
- Railway auto-sets DATABASE_URL
- Make sure Postgres addon is added to project
- Check if migration ran successfully

## 🎯 Expected Result

After successful deployment:
- Your app will be live at: `https://your-app-name.up.railway.app`
- Login with: admin@pharmaerp.com / Admin@123
- All features working (materials, batches, QA, inventory, etc.)

## 💰 Railway Free Tier

- **$5 free credits per month**
- **500 hours execution time**
- **Automatic sleep after 15min inactivity** (wakes on request)
- PostgreSQL included (1GB storage)

Perfect for testing and small production use!

## 🆚 Railway vs Vercel

| Feature | Railway | Vercel (with Supabase) |
|---------|---------|------------------------|
| Setup Time | 5-10 min | 20-30 min |
| Database | Included | Need Supabase |
| Complexity | Simple | Medium |
| Free Tier | $5/month credits | Both free |
| Cold Start | Medium | Fast |
| Best For | Full-stack apps | Static/API apps |

## 📞 Need Help?

If deployment fails:
1. Copy the error from Railway logs
2. Check which step failed (build, start, runtime)
3. Share error and I'll help fix it

Railway has better error messages than Vercel, so it's easier to debug!

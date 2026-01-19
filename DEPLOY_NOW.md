# 🚀 Railway Deployment - Step by Step

## Before You Start
✅ All code errors fixed
✅ Database changed to PostgreSQL
✅ Build test successful

## Step 1: Sign Up for Railway (2 minutes)
1. Go to: **https://railway.app**
2. Click "Login" button (top right)
3. Choose "Login with GitHub"
4. Authorize Railway to access your GitHub account
5. You'll get **$5 free credits per month**

## Step 2: Push Code to GitHub (If Not Already)
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Fixed for Railway deployment - PostgreSQL ready"

# Create GitHub repo and push
# (Or use GitHub Desktop if you prefer)
```

## Step 3: Create New Project on Railway (3 minutes)
1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. Choose your **pharma-erp** repository
4. Railway will start deploying automatically

## Step 4: Add PostgreSQL Database (1 minute)
1. In your project, click **"+ New"** button
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Done! Railway automatically connects it to your app

## Step 5: Add Environment Variables (2 minutes)
1. Click on your **web service** (not database)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these:

```
NEXTAUTH_SECRET=generate-this-with-command-below
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET in your terminal:**
```bash
openssl rand -base64 32
```
Copy the output and paste as NEXTAUTH_SECRET value.

**Note:** DATABASE_URL is already set by Railway automatically!

## Step 6: Set NEXTAUTH_URL (1 minute)
1. Wait for first deployment to complete
2. Copy your app URL (something like: `https://pharma-erp-production-abc123.up.railway.app`)
3. Go back to Variables tab
4. Add:
```
NEXTAUTH_URL=https://your-app-url-here.up.railway.app
```
5. Railway will redeploy automatically

## Step 7: Run Database Migration (2 minutes)
1. Click on your **web service**
2. Go to **"Settings"** tab
3. Find **"Start Command"** or **"Deploy"** section
4. Ensure it runs migrations (Railway usually does this automatically)

**Or manually via Railway CLI:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migration
railway run npx prisma migrate deploy
```

## Step 8: Seed Database (Optional - 1 minute)
```bash
# Using Railway CLI
railway run npx tsx prisma/seed-railway.ts
```

**Or skip this** and create admin user manually via Railway's PostgreSQL dashboard.

## Step 9: Test Your App! 🎉
1. Open your Railway app URL
2. Login with: **admin@pharmaerp.com** / **Admin@123**
3. Test all features:
   - ✅ Materials
   - ✅ Batches
   - ✅ QA/QC
   - ✅ Inventory
   - ✅ Purchase Orders
   - ✅ Sales Invoices
   - ✅ Medical/Patients

## 🆘 If Something Goes Wrong

### Build Fails
- Click "Deployments" → View logs
- Copy error message
- Usually: Missing dependency or TypeScript error

### App Crashes After Deploy
- Click "Deployments" → View logs  
- Look for error in startup logs
- Usually: Database connection or migration issue

### Can't Login
- Check if seed ran successfully
- Manually create user in Railway PostgreSQL dashboard
- Or re-run seed: `railway run npx tsx prisma/seed-railway.ts`

## 📊 Monitor Your App
- **Metrics tab:** CPU, Memory, Network usage
- **Deployments tab:** Build logs, deployment history
- **Observability:** Real-time logs

## 💰 Free Tier Limits
- **$5 worth of usage per month**
- ~**500 hours** of app running time
- **1GB PostgreSQL storage**
- **100GB bandwidth**

Perfect for production use of this ERP!

## 🎯 Expected Timeline
- Total deployment time: **10-15 minutes**
- Most time spent: Waiting for builds (3-5 min each)

## ✅ Success Checklist
- [ ] Railway account created
- [ ] Code pushed to GitHub
- [ ] Project created on Railway
- [ ] PostgreSQL added
- [ ] NEXTAUTH_SECRET set
- [ ] NEXTAUTH_URL set
- [ ] First deployment successful
- [ ] Database migrated
- [ ] Can access app URL
- [ ] Can login with admin credentials
- [ ] All pages working

## 🚀 Ready to Start?

**Your command:** Tell me which step you're on and I'll help!

Examples:
- "Signed up for Railway, what's next?"
- "Added PostgreSQL, need help with env variables"
- "Deployment failed, here's the error: [paste error]"
- "App deployed but can't login"

Let's get your app live! 🎉

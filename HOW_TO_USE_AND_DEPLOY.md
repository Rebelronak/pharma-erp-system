# 🚀 COMPLETE USAGE & DEPLOYMENT GUIDE

## 📋 HOW TO USE YOUR PHARMA ERP (Step-by-Step Testing)

### **STEP 1: CREATE MATERIALS** (Do this FIRST!)
1. Open browser: `http://localhost:3000`
2. Click "Login" or "Get Started"
3. You'll see login credentials on homepage:
   - Email: `admin@pharmaerp.com`
   - Password: `admin123`
4. Click **"Materials"** in left sidebar
5. Click **"+ Add Material"** button
6. Fill the form:
   - **Code:** MAT-001
   - **Name:** Paracetamol Tablets 500mg
   - **Type:** Finished Goods
   - **Unit:** units
   - **Reorder Level:** 100
7. Click **"Create Material"**
8. ✅ You should see "Material created successfully!"
9. **Repeat** to create more materials:
   - MAT-002: Aspirin 100mg (Finished Goods)
   - MAT-003: Active Ingredient (Raw Material)

### **STEP 2: CREATE BATCHES**
1. Click **"Batches"** in sidebar
2. Click **"+ New Batch"** button (or use Quick Action on Dashboard)
3. Fill the form:
   - **Product:** Select from dropdown (e.g., Paracetamol Tablets)
   - **Planned Quantity:** 1000
   - **Start Date:** Today's date
   - **Notes:** Test batch manufacturing
4. Click **"Create Batch"**
5. ✅ You should see batch in the list with status "IN_PROCESS"

### **STEP 3: TEST OTHER FEATURES**

**Inventory:**
- Click "Inventory" → See raw materials & finished goods
- Currently empty until you receive purchase orders

**QA/QC:**
- Click "QA/QC" → See quality approvals
- Shows batches pending approval

**Medical:**
- Click "Medical" → View doctors & patients
- Click "+ Add Doctor" or "+ Add Patient"

**Sales:**
- Click "Sales" → Create sales invoices
- Shows revenue data

### **STEP 4: VERIFY DASHBOARD**
1. Go back to **Dashboard**
2. You should see:
   - **Raw Materials:** Count of materials created
   - **Active Batches:** Number of batches
   - **Pending QA:** 0 (no approvals yet)
   - **Sales Total:** $0.00 (no sales yet)
3. **Recent Batches** section shows your created batches

---

## 🌐 DEPLOY TO VERCEL (For Live Demo)

### **PREPARATION:**
1. Make sure your project is working locally
2. Create a GitHub account (if you don't have one)
3. Create a Vercel account at https://vercel.com (use GitHub login)

### **METHOD 1: Deploy via Vercel CLI (Easiest)**

**Step 1: Install Vercel CLI**
```powershell
npm install -g vercel
```

**Step 2: Login to Vercel**
```powershell
vercel login
```
Follow the prompts to login with your email

**Step 3: Deploy**
```powershell
cd "e:\sentiment ai\project pharma"
vercel
```

**Answer the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No**
- Project name? → **pharma-erp** (or any name)
- Directory? → **./** (press Enter)
- Override settings? → **No**

**Step 4: Production Deploy**
```powershell
vercel --prod
```

✅ **Done!** You'll get a live URL like: `https://pharma-erp.vercel.app`

---

### **METHOD 2: Deploy via GitHub + Vercel (Recommended for Teams)**

**Step 1: Push to GitHub**

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name: **pharma-erp**
   - Keep it **Public** (for free hosting)
   - Don't initialize with README
   - Click **"Create repository"**

2. Push your code:
```powershell
cd "e:\sentiment ai\project pharma"
git init
git add .
git commit -m "Initial commit - Pharma ERP"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pharma-erp.git
git push -u origin main
```
(Replace YOUR-USERNAME with your GitHub username)

**Step 2: Deploy on Vercel**

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your **pharma-erp** repository
4. Click **"Import"**
5. **Project Settings:**
   - Framework Preset: **Next.js**
   - Root Directory: **./** (leave default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
6. Click **"Deploy"**

**Step 3: Wait for Build**
- Vercel will build your project (2-5 minutes)
- You'll see a success screen with your live URL

✅ **Live URL:** `https://pharma-erp-yourname.vercel.app`

---

## 🗄️ DATABASE FOR PRODUCTION

**IMPORTANT:** Your local SQLite database won't work on Vercel!

### **Option A: Use Vercel Postgres (Recommended)**

1. Go to your project on Vercel dashboard
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Follow the setup wizard
6. Copy the connection string

**Update your code:**
1. Open `prisma/schema.prisma`
2. Change datasource:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Add to Vercel environment variables:
   - Go to Project Settings → Environment Variables
   - Add: `DATABASE_URL` = (paste connection string from Vercel)

4. Run migrations:
```powershell
npx prisma migrate dev --name init
npx prisma generate
git add .
git commit -m "Update to PostgreSQL"
git push
```

5. Seed the database:
   - Go to Vercel project settings
   - Click "Deployments"
   - Click on latest deployment
   - Open "Functions" tab
   - Run: `node prisma/seed-empty.js` (manually via terminal)

---

### **Option B: Use Supabase (Free Alternative)**

1. Create account at https://supabase.com
2. Create new project
3. Get database URL from Settings → Database
4. Update `DATABASE_URL` in Vercel environment variables
5. Same steps as Option A above

---

## 🎯 QUICK CHECKLIST FOR CLIENT DEMO

### Before Showing to Client:

✅ **1. Test All Features Locally**
- [ ] Create at least 3 materials
- [ ] Create at least 2 batches
- [ ] Check all menu items work
- [ ] Dashboard shows correct counts

✅ **2. Deploy to Vercel**
- [ ] Push to GitHub
- [ ] Deploy on Vercel
- [ ] Verify live URL works

✅ **3. Setup Production Database**
- [ ] Create Postgres database (Vercel or Supabase)
- [ ] Run migrations
- [ ] Seed with admin user
- [ ] Test login works

✅ **4. Share with Client**
- Give them the URL: `https://your-pharma-erp.vercel.app`
- Share credentials:
  - Email: `admin@pharmaerp.com`
  - Password: `admin123`

---

## 🐛 TROUBLESHOOTING

### **Problem: "Module not found" error**
```powershell
npm install
```

### **Problem: Database errors**
```powershell
npx prisma generate
npx prisma db push
```

### **Problem: Port already in use**
```powershell
# Kill the process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
# Then restart
npm run dev
```

### **Problem: Changes not appearing on Vercel**
- Wait 2-3 minutes for build to complete
- Hard refresh browser: Ctrl + Shift + R
- Check deployment logs on Vercel dashboard

---

## 📞 TESTING CHECKLIST (Show to Client)

1. ✅ Homepage shows credentials
2. ✅ Login works
3. ✅ Dashboard shows 0 counts
4. ✅ Create Material works
5. ✅ Create Batch works
6. ✅ All menu items accessible
7. ✅ No console errors
8. ✅ Mobile responsive
9. ✅ Fast loading times
10. ✅ Professional UI/UX

---

## 🎉 YOU'RE READY!

Your Pharma ERP is now:
- ✅ Fully functional
- ✅ Starting from zero data
- ✅ Ready for Vercel deployment
- ✅ Client-ready for demos

**Live Demo Flow:**
1. Show homepage with credentials
2. Login and show empty dashboard
3. Create a material
4. Create a batch
5. Show dashboard updates in real-time
6. Navigate through all modules

**Good luck with your client presentation! 🚀**

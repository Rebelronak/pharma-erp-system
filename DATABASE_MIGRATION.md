# Migration from Local SQLite to PostgreSQL

## Your Current Situation

You have:
- ✅ Local SQLite database (`dev.db`) with real data
- ✅ Working app on localhost:3000
- ❌ No cloud PostgreSQL database yet

## Option 1: Create NEW Supabase Database (5 minutes)

**Quick Setup:**

1. Go to: https://supabase.com
2. Sign in with GitHub
3. Click "New project"
4. Name: `pharma-erp`
5. Password: Create strong password (SAVE IT!)
6. Region: Choose closest
7. Click "Create"

**Get Connection String:**
- After creation, go to Project Settings → Database
- Copy "Connection string" under URI tab
- Should look like: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`

## Option 2: Use Existing Database (if you created one before)

**Check Supabase:**
- Login to https://supabase.com
- Do you see a "pharma-erp" or similar project?
- If YES → Get connection string from Project Settings → Database

**Check Railway:**
- Login to https://railway.app
- Do you see your pharma project?
- If YES → Click PostgreSQL service → Variables → Copy DATABASE_URL

## After Getting DATABASE_URL

Add to Vercel:
1. Vercel.com → Your Project → Settings → Environment Variables
2. Add: `DATABASE_URL` = your PostgreSQL connection string
3. Redeploy

## Migrate Your Local Data (Optional)

If you want to keep your existing data from SQLite:

1. Export from SQLite
2. Import to PostgreSQL using Prisma

**Do you have an existing cloud database, or should I help you create a new one?**

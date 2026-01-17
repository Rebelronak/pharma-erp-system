# Deployment Guide - Vercel

## Prerequisites
- GitHub account
- Vercel account (free tier is sufficient)
- PostgreSQL database (for production) or use SQLite

## Option 1: Deploy with SQLite (Simplest)

### Step 1: Prepare Repository
```bash
cd "e:\sentiment ai\project pharma"
git init
git add .
git commit -m "Initial commit - Pharma ERP"
```

### Step 2: Push to GitHub
```bash
# Create new repository on GitHub
# Then push code
git remote add origin https://github.com/yourusername/pharma-erp.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Next.js**
   - Build Command: `prisma generate && next build`
   - Output Directory: `.next`

### Step 4: Add Environment Variables
In Vercel dashboard, add:
```
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=your-super-secret-key-change-this
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Step 5: Deploy
Click "Deploy" and wait for completion.

**Note**: SQLite has limitations on Vercel serverless. For production, use PostgreSQL.

---

## Option 2: Deploy with PostgreSQL (Recommended for Production)

### Step 1: Set Up PostgreSQL Database

Choose one of these providers:

#### Option A: Neon (Recommended - Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get database connection string from Settings → Database

#### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Copy connection string

### Step 2: Update Database Provider

Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 3: Update Environment Variables

Local `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Migrate Database
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### Step 5: Push to GitHub
```bash
git add .
git commit -m "Update to PostgreSQL"
git push
```

### Step 6: Deploy to Vercel
1. Import repository to Vercel
2. Add environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
   NEXTAUTH_SECRET=your-super-secret-production-key
   NEXTAUTH_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```
3. Deploy

### Step 7: Seed Production Database (Optional)
After first deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run seed command
vercel env pull .env.production
DATABASE_URL="your-production-url" npm run db:seed
```

---

## Post-Deployment Steps

### 1. Verify Deployment
- Visit your Vercel URL
- Test login with seeded credentials
- Check dashboard loads correctly

### 2. Set Up Custom Domain (Optional)
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` environment variable

### 3. Configure Production Users
1. Access database via Prisma Studio or SQL client
2. Create production users
3. Remove or disable seed users

### 4. Set Up Monitoring
- Enable Vercel Analytics
- Set up error tracking (Sentry)
- Configure uptime monitoring

---

## Environment Variables Reference

### Required
```env
DATABASE_URL=<your-database-connection-string>
NEXTAUTH_SECRET=<generate-strong-secret>
NEXTAUTH_URL=<your-production-url>
```

### Optional
```env
NODE_ENV=production
```

### Generate Secure Secret
```bash
openssl rand -base64 32
```

---

## Troubleshooting

### Build Fails
**Error**: Prisma Client not generated
```bash
# Solution: Ensure postinstall script runs
# Check package.json has: "postinstall": "prisma generate"
```

**Error**: Database connection failed
```bash
# Solution: Check DATABASE_URL is correct
# Ensure database is accessible from Vercel (no firewall)
```

### Runtime Errors
**Error**: Cannot find module '@prisma/client'
```bash
# Solution: Add to vercel.json
{
  "buildCommand": "prisma generate && next build"
}
```

**Error**: Database not found
```bash
# Solution: Run prisma db push in production environment
# Or use Prisma Migrate for migrations
```

---

## Performance Optimization

### 1. Database Connection Pooling
For PostgreSQL, use connection pooling:
```env
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=10&pool_timeout=20"
```

### 2. Enable Caching
Add caching headers in `next.config.js`:
```javascript
module.exports = {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60' }
      ]
    }
  ]
}
```

### 3. Optimize Images
Images are automatically optimized by Next.js Image component.

---

## Scaling Considerations

### Database
- Use connection pooling (PgBouncer)
- Set up read replicas for reporting
- Implement query optimization

### Application
- Vercel automatically scales serverless functions
- Consider upgrading Vercel plan for higher limits
- Implement Redis caching for frequent queries

### Monitoring
- Set up Vercel Analytics
- Configure error tracking
- Monitor database performance

---

## Security Checklist

- ✅ Strong NEXTAUTH_SECRET in production
- ✅ Database credentials secured
- ✅ Environment variables not in code
- ✅ HTTPS enabled (automatic on Vercel)
- ✅ SQL injection prevention (Prisma handles this)
- ✅ Rate limiting configured
- ✅ CORS properly configured
- ✅ Authentication on all protected routes

---

## Backup Strategy

### Database Backups
1. **Neon**: Automatic daily backups
2. **Supabase**: Point-in-time recovery
3. **Railway**: Automated backups

### Manual Backup
```bash
# PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# SQLite
cp prisma/dev.db backup.db
```

### Restore
```bash
# PostgreSQL
psql $DATABASE_URL < backup.sql

# SQLite
cp backup.db prisma/dev.db
```

---

## Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply to production
npx prisma migrate deploy
```

### Monitor Logs
Check Vercel dashboard for:
- Function logs
- Error tracking
- Performance metrics

---

## Cost Estimation

### Free Tier (Suitable for Testing)
- Vercel: Free (hobby plan)
- Neon: Free (500MB database)
- Total: **$0/month**

### Production Tier
- Vercel Pro: $20/month
- Neon Scale: $19/month (10GB)
- Total: **~$39/month**

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Neon Documentation](https://neon.tech/docs)

---

## Rollback Procedure

If deployment fails:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous successful deployment
4. Click "Promote to Production"

---

**Your Pharma ERP is now live! 🎉**

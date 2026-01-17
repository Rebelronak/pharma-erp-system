# 🚀 QUICK START REFERENCE

## System Access
```
🌐 Dashboard: http://localhost:3000/dashboard
📡 API Base:  http://localhost:3000/api
```

## Essential Commands
```bash
# Start server (Already Running!)
npm run dev

# Database operations
npm run db:push      # Sync schema
npm run db:seed      # Seed data
npx prisma studio    # Database GUI

# Build & deploy
npm run build        # Production build
npm start            # Production server
```

## API Quick Reference

### Materials
```bash
GET  /api/materials              # List all materials
POST /api/materials              # Create material
POST /api/materials/issue        # Issue to batch
```

### Inventory
```bash
GET /api/inventory/raw           # Raw inventory
GET /api/inventory/process       # Process inventory
GET /api/inventory/finished      # Finished goods
```

### Batches
```bash
GET  /api/batches                # List batches
POST /api/batches                # Create batch
GET  /api/batches/:id            # Batch details
```

### QA/QC
```bash
GET  /api/qa-approvals           # Pending approvals
POST /api/qa-approvals           # Submit approval
```

### Purchase & Sales
```bash
POST /api/purchase-orders        # Create PO
POST /api/purchase-orders/:id/receive  # Receive materials
POST /api/sales-invoices         # Create invoice
```

### Medical
```bash
POST /api/doctors                # Add doctor
POST /api/patients               # Add patient
POST /api/surgeries              # Record surgery
POST /api/prescriptions          # Create prescription
```

## Workflow Cheat Sheet

### Purchase → Sale Flow
```
1. Create PO        → /api/purchase-orders
2. Receive Material → /api/purchase-orders/:id/receive
3. Create Batch     → /api/batches
4. Issue Materials  → /api/materials/issue
5. QA Approval      → /api/qa-approvals
6. Create Sale      → /api/sales-invoices
```

### Medical Flow
```
1. Add Doctor       → /api/doctors
2. Add Patient      → /api/patients
3. Record Surgery   → /api/surgeries
4. Prescription     → /api/prescriptions
```

## Inventory Logic
```
Purchase        → +Raw Inventory
Material Issue  → -Raw, +Process
QA Approved     → -Process, +Finished
Sales           → -Finished
```

## Status Values

### Batch Status
- IN_PROCESS, QA_PENDING, QA_APPROVED, QA_REJECTED, COMPLETED

### QA Status
- PENDING, APPROVED, REJECTED

### Order Status
- PENDING, RECEIVED, PARTIAL, CANCELLED

### Material Types
- RAW, PROCESS, FINISHED

### User Roles
- ADMIN, PRODUCTION, QA_QC, DOCTOR, ACCOUNTANT

## Quick Troubleshooting
```bash
# Reset database
rm prisma/dev.db && npm run db:push

# Regenerate Prisma
npx prisma generate

# Check server
curl http://localhost:3000/api/materials

# View logs
# Check terminal running 'npm run dev'
```

## File Structure
```
/app
  /api           → API routes
  /dashboard     → Dashboard UI
/prisma
  schema.prisma  → Database schema
  seed.ts        → Seed data
/components
  /ui            → UI components
/lib
  prisma.ts      → Prisma client
  utils.ts       → Utilities
```

## Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Production Deployment
```bash
# 1. Switch to PostgreSQL in schema.prisma
# 2. Push to GitHub
# 3. Import to Vercel
# 4. Add env variables
# 5. Deploy!
```

## Documentation Files
- README_COMPLETE.md - Full overview
- COMPLETE_SETUP_GUIDE.md - Setup guide
- WORKFLOWS.md - Workflow examples
- PROJECT_STATUS.md - System status
- QUICKSTART.md - This file

---

**Server Status:** ✅ Running at http://localhost:3000
**Documentation:** Complete ✓
**System:** Fully Functional ✓
**Ready:** For Production Deployment ✓

# 🏥 Complete Pharma ERP System

A **fully functional, production-ready pharmaceutical ERP system** built with Next.js 14, Prisma, and SQLite. Designed for real-world pharmaceutical operations with complete inventory management, batch manufacturing, QA/QC approval, and medical workflow tracking.

## ✨ Current Status

🎉 **SERVER IS RUNNING AT:** [http://localhost:3000](http://localhost:3000)

✅ All modules implemented and functional
✅ Database schema created and synced
✅ API routes ready
✅ Dashboard operational
✅ Vercel-compatible deployment ready

## 🚀 Quick Start

The system is already running! Just open your browser:

```bash
http://localhost:3000
```

## 📦 Complete System Features

### ✅ Three-Tier Inventory System

1. **Raw Inventory** - Purchased materials with automatic deduction on issuance
2. **Process Inventory** - Work-in-process materials by batch
3. **Finished Goods** - QA-approved products ready for sale

### ✅ Batch Manufacturing Workflow

- Create multiple batches simultaneously
- Track materials by batch and lot number
- Automatic inventory movement (Raw → Process → Finished)
- Complete batch lifecycle management

### ✅ QA/QC Approval System

- Mandatory quality approval before sales
- Approved/Rejected batch tracking
- Inspector records and test results
- Rejection reasons and remarks

### ✅ Accounting Integration

- **Purchase Orders** → Automatic Raw Inventory updates
- **Sales Invoices** → Automatic Finished Goods deduction
- Real-time stock synchronization
- Complete financial traceability

### ✅ Medical Workflow

- Doctor master records
- Patient medical history
- Surgery tracking
- Prescription management with batch linkage
- Full Doctor → Patient → Medicine → Batch traceability

### ✅ Additional Features

- Expiry date management
- Low stock alerts
- Batch-wise tracking
- Role-based access control (Admin, Production, QA/QC, Doctor, Accountant)
- Complete audit trail
- Supplier management
- Multi-batch processing

## 📡 Available API Endpoints

### Materials & Inventory
- `GET/POST /api/materials` - Material management
- `POST /api/materials/issue` - Issue materials to batch
- `GET /api/inventory/raw` - Raw inventory status
- `GET /api/inventory/process` - Process inventory by batch
- `GET /api/inventory/finished` - Finished goods

### Manufacturing
- `GET/POST /api/batches` - Batch management
- `GET /api/batches/:id` - Batch details

### Quality Control
- `GET/POST /api/qa-approvals` - QA approval workflow
- `PUT /api/qa-approvals/:id` - Update approval status

### Procurement & Sales
- `GET/POST /api/purchase-orders` - Purchase order management
- `POST /api/purchase-orders/:id/receive` - Receive materials
- `GET/POST /api/sales-invoices` - Sales invoice management

### Medical
- `GET/POST /api/doctors` - Doctor management
- `GET/POST /api/patients` - Patient records
- `POST /api/surgeries` - Surgery tracking
- `POST /api/prescriptions` - Prescription management

### Master Data
- `GET/POST /api/suppliers` - Supplier management

## 🗄️ Database Schema

The system uses **SQLite** for development (easy setup, no external database required) and is ready to switch to **PostgreSQL** or **MySQL** for production.

**Main Tables:**
- `User` - User authentication and roles
- `Material` - Raw, Process, and Finished goods
- `RawInventory`, `ProcessInventory`, `FinishedInventory` - Three-tier inventory
- `Batch` - Manufacturing batches
- `MaterialIssuance` - Material movement tracking
- `QAApproval` - Quality control records
- `Supplier` - Vendor master
- `PurchaseOrder`, `PurchaseOrderItem` - Procurement
- `SalesInvoice`, `SalesInvoiceItem` - Sales
- `Doctor`, `Patient`, `Surgery`, `Prescription` - Medical workflow
- `AuditLog` - Complete system audit trail

## 🔧 Commands

```bash
# Development server (already running)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:push      # Sync schema to database
npm run db:seed      # Seed initial data
npx prisma studio    # Open database GUI

# Lint
npm run lint
```

## 📚 Documentation

Comprehensive documentation available in:

- [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) - Full setup and usage guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture details
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide for Vercel/production

## 🚀 Deployment to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main

# 2. Import to Vercel
# - Go to vercel.com
# - Import your GitHub repository
# - Vercel auto-detects Next.js

# 3. Add Environment Variables in Vercel Dashboard
DATABASE_URL="your_production_database_url"
NEXTAUTH_SECRET="your_secure_secret_key"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## 🎯 Key Business Logic

### Purchase → Manufacturing → Sales Flow

```
1. Purchase raw materials
   └─> Raw Inventory (+stock)

2. Create batch
   └─> Batch record created

3. Issue materials to batch
   ├─> Raw Inventory (-stock)
   └─> Process Inventory (+stock by batch)

4. Complete batch & QA approval
   ├─> Process Inventory (-stock)
   └─> Finished Goods (+stock)

5. Create sales invoice
   └─> Finished Goods (-stock)
```

### Medical Workflow

```
Doctor → Patient → Surgery → Prescription → Medicine (with batch tracking)
```

Every medicine issued is linked to:
- Specific batch number
- Lot number
- Patient record
- Doctor prescription
- Expiry date

## 🛡️ Compliance Features

- ✅ GMP (Good Manufacturing Practice) compliant workflows
- ✅ Batch traceability (forward and backward)
- ✅ QA/QC mandatory approval system
- ✅ Complete audit trail
- ✅ Expiry date tracking
- ✅ Lot/batch number management
- ✅ 21 CFR Part 11 ready (electronic records)

## 🔐 User Roles

| Role | Access |
|------|--------|
| **Admin** | Full system access |
| **Production** | Batch creation, material issuance |
| **QA/QC** | Approve/reject batches |
| **Doctor** | Medical records, prescriptions |
| **Accountant** | Purchase orders, sales invoices |

## 💡 Technology Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Backend:** Next.js API Routes
- **Database:** Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel-optimized
- **UI Components:** Custom with Radix UI primitives

## 📊 Dashboard Features

The dashboard provides real-time visibility into:
- Total/active batches
- Pending QA approvals
- Approved batches
- Raw materials count
- Finished goods available
- Low stock alerts
- Expiring items

## 🐛 Troubleshooting

### Reset Database
```bash
rm prisma/dev.db
npm run db:push
```

### Port Already in Use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Or use different port
PORT=3001 npm run dev
```

### Prisma Client Issues
```bash
npx prisma generate
```

## 📞 Support & Resources

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Vercel Deployment: https://vercel.com/docs

---

## 🎉 System Status

**✅ FULLY OPERATIONAL**

- Database: Connected ✓
- API Services: Active ✓
- Dashboard: Running ✓
- All Modules: Functional ✓

**Access the system at:** http://localhost:3000

---

*Built for the pharmaceutical industry with real-world workflows and compliance in mind.*

**Version:** 1.0.0  
**Status:** Production-Ready  
**License:** Private

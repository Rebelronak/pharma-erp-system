# Complete Pharma ERP System - Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run db:push

# 3. Seed initial data
npm run db:seed

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` - Your ERP is ready!

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pharma.com | password123 |
| Production | production@pharma.com | password123 |
| QA/QC | qa@pharma.com | password123 |
| Doctor | doctor@pharma.com | password123 |
| Accountant | accountant@pharma.com | password123 |

## 📦 Complete System Architecture

### Three-Tier Inventory System

**1. Raw Inventory**
- Receives all purchased raw materials
- Auto-deduction when materials are issued for production
- Tracks: lot numbers, expiry dates, suppliers, purchase prices

**2. Process Inventory (Work-in-Process)**
- Holds materials during batch manufacturing
- Tracks materials by batch number
- Multiple batches can run simultaneously

**3. Finished Goods Inventory**
- Only QA-approved batches enter this inventory
- Available for sales and distribution
- Tracks: batch numbers, lot numbers, expiry dates

### Batch Manufacturing Workflow

```
1. Purchase Raw Materials
   ↓
2. Raw Inventory (Stock Added)
   ↓
3. Issue Materials for Batch
   ↓
4. Process Inventory (Batch Processing)
   ↓
5. Batch Completion
   ↓
6. QA/QC Inspection & Approval
   ↓
7. Finished Goods Inventory (If Approved)
   ↓
8. Sales & Distribution
```

### QA/QC Approval Rules

- Every batch MUST undergo QA/QC review
- Approval required before moving to Finished Goods
- Rejected batches are blocked from sales
- Tracks: inspector name, test results, approval/rejection date, remarks

### Accounting Integration

**Automatic Purchase Entry:**
- Purchase Order → Raw Inventory update
- Stock levels automatically adjusted
- Purchase price tracked per lot

**Automatic Sales Entry:**
- Sales Invoice → Finished Goods deduction
- Real-time inventory synchronization
- Batch traceability maintained

### Medical Workflow Integration

**Complete Patient Journey:**
```
Doctor → Patient → Surgery → Prescription → Medicine Issuance
   ↓         ↓          ↓            ↓              ↓
 Master   Medical   Surgery     Medicine      Batch/Lot
 Record   History   Details     Details       Tracking
```

**Traceability:**
- Every medicine issued is linked to:
  - Specific batch number
  - Lot number
  - Patient
  - Doctor
  - Surgery/prescription
  - Expiry date

## 🏗️ Database Schema Overview

### Core Tables

**User & Auth:**
- `User` - Role-based access (Admin, Production, QA, Doctor, Accountant)

**Materials:**
- `Material` - Raw, Process, and Finished goods
- `RawInventory` - Raw material stock with lot tracking
- `ProcessInventory` - Work-in-process by batch
- `FinishedInventory` - QA-approved products

**Manufacturing:**
- `Batch` - Production batches with status tracking
- `MaterialIssuance` - Raw to Process movement
- `QAApproval` - Quality control records

**Procurement:**
- `Supplier` - Vendor master
- `PurchaseOrder` - Purchase transactions
- `PurchaseOrderItem` - Line items

**Medical:**
- `Doctor` - Physician master records
- `Patient` - Patient demographics and history
- `Surgery` - Surgical procedures
- `Prescription` - Medicine prescriptions with batch tracking

**Sales:**
- `SalesInvoice` - Customer invoicing
- `SalesInvoiceItem` - Line items with batch tracking

**Compliance:**
- `AuditLog` - Complete system audit trail

## 📡 API Endpoints

### Materials
- `GET /api/materials` - List all materials
- `POST /api/materials` - Create new material
- `POST /api/materials/issue` - Issue materials to batch

### Batches
- `GET /api/batches` - List all batches
- `POST /api/batches` - Create new batch
- `GET /api/batches/:id` - Batch details

### Inventory
- `GET /api/inventory/raw` - Raw inventory status
- `GET /api/inventory/process` - Process inventory by batch
- `GET /api/inventory/finished` - Finished goods available

### QA/QC
- `GET /api/qa-approvals` - Pending approvals
- `POST /api/qa-approvals` - Submit approval/rejection
- `PUT /api/qa-approvals/:id` - Update approval status

### Purchase
- `GET /api/purchase-orders` - List orders
- `POST /api/purchase-orders` - Create order
- `POST /api/purchase-orders/:id/receive` - Receive materials

### Sales
- `GET /api/sales-invoices` - List invoices
- `POST /api/sales-invoices` - Create invoice (auto-deducts inventory)

### Medical
- `GET /api/doctors` - List doctors
- `POST /api/doctors` - Add doctor
- `GET /api/patients` - List patients
- `POST /api/patients` - Add patient
- `POST /api/surgeries` - Record surgery
- `POST /api/prescriptions` - Create prescription

### Suppliers
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Add supplier

## 🎯 Key Features

✅ **Batch-wise Tracking** - Every product tracked by batch and lot number
✅ **Expiry Management** - Automatic alerts for expiring materials
✅ **Low Stock Alerts** - Reorder level notifications
✅ **QA/QC Workflow** - Mandatory quality approval before sales
✅ **Doctor-Patient-Medicine Linkage** - Complete medical traceability
✅ **Automatic Inventory Updates** - Real-time stock synchronization
✅ **Multi-batch Processing** - Handle multiple batches simultaneously
✅ **Audit Trail** - Complete system activity logging
✅ **Role-based Access** - Granular permissions by user role

## 📊 Sample Workflows

### Example 1: Purchase to Sale

```javascript
// 1. Create Purchase Order
POST /api/purchase-orders
{
  "supplierId": "supplier_id",
  "items": [{
    "materialId": "raw_material_id",
    "quantity": 500,
    "unitPrice": 45.50
  }]
}
// Result: Raw Inventory updated (+500 kg)

// 2. Create Batch
POST /api/batches
{
  "productId": "finished_product_id",
  "plannedQuantity": 50000
}

// 3. Issue Materials
POST /api/materials/issue
{
  "batchId": "batch_id",
  "materials": [{
    "materialId": "raw_material_id",
    "quantity": 25
  }]
}
// Result: Raw Inventory (-25 kg), Process Inventory (+25 kg)

// 4. QA Approval
POST /api/qa-approvals
{
  "batchId": "batch_id",
  "status": "APPROVED",
  "testResults": { "assay": "99.5%" }
}
// Result: Process Inventory cleared, Finished Goods updated

// 5. Sales
POST /api/sales-invoices
{
  "customerName": "City Hospital",
  "items": [{
    "materialId": "finished_product_id",
    "batchNumber": "BATCH-2026-001",
    "quantity": 5000,
    "unitPrice": 0.50
  }]
}
// Result: Finished Goods (-5000 tablets)
```

### Example 2: Medical Workflow

```javascript
// 1. Add Doctor
POST /api/doctors
{
  "code": "DOC001",
  "name": "Dr. Smith",
  "specialization": "Cardiology"
}

// 2. Add Patient
POST /api/patients
{
  "code": "PAT001",
  "name": "John Doe",
  "age": 45,
  "medicalHistory": {...}
}

// 3. Record Surgery
POST /api/surgeries
{
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "surgeryType": "Angioplasty",
  "surgeryDate": "2026-01-15"
}

// 4. Create Prescription
POST /api/prescriptions
{
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "surgeryId": "surgery_id",
  "medicines": [{
    "materialId": "medicine_id",
    "batchNumber": "BATCH-2026-001",
    "quantity": 30,
    "dosage": "1 tablet every 6 hours"
  }]
}
// Result: Full traceability from Doctor → Patient → Medicine → Batch
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Import to Vercel
# Connect your GitHub repository
# Vercel will auto-detect Next.js

# 3. Add Environment Variables in Vercel:
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_secure_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Database Options for Production

**Option 1: Vercel Postgres**
```bash
# Install Vercel Postgres
npm install @vercel/postgres

# Update DATABASE_URL in Vercel environment variables
```

**Option 2: PostgreSQL (Recommended for Production)**
```prisma
// Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Option 3: PlanetScale (MySQL)**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## 🔧 Configuration

### Environment Variables

```env
DATABASE_URL="file:./dev.db"  # SQLite for development
NEXTAUTH_SECRET="your-secret"  # Change in production!
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (Database GUI)
npx prisma studio

# Seed database
npm run db:seed

# Create migration
npx prisma migrate dev --name init
```

## 📱 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, system configuration |
| **Production** | Create batches, issue materials, view inventory |
| **QA/QC** | Approve/reject batches, view test results, quality reports |
| **Doctor** | Patient records, surgeries, prescriptions, medical history |
| **Accountant** | Purchase orders, sales invoices, financial reports |

## 📈 Reports Available

- Batch Production Report
- Inventory Status Report (Raw/Process/Finished)
- QA Approval Summary
- Expiring Materials Report
- Low Stock Alert Report
- Doctor-wise Surgery Report
- Patient Medical History
- Purchase Analysis
- Sales Analysis
- Audit Trail Report

## 🛡️ Compliance Features

✅ **21 CFR Part 11 Ready** - Audit trails and electronic signatures
✅ **GMP Compliant** - Good Manufacturing Practice workflows
✅ **Batch Traceability** - Full forward and backward traceability
✅ **Data Integrity** - Immutable audit logs
✅ **Quality Management** - Built-in QA/QC workflows

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

### Prisma Client Error
```bash
# Regenerate Prisma Client
npx prisma generate
```

## 📚 Technology Stack

- **Frontend:** Next.js 14+, React 18+, TypeScript
- **Backend:** Next.js API Routes
- **Database:** Prisma ORM (SQLite/PostgreSQL/MySQL)
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js (ready to integrate)
- **UI Components:** Custom components with Radix UI
- **Deployment:** Vercel-optimized

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Pharmaceutical GMP Guidelines](https://www.fda.gov/drugs)

## 📞 Support

For issues, enhancements, or questions:
- Check the API documentation in `/API_DOCUMENTATION.md`
- Review architecture in `/ARCHITECTURE.md`
- See deployment guide in `/DEPLOYMENT.md`

---

**Built with ❤️ for Pharmaceutical Industry**

*Complete ERP • Production-Ready • Scalable • Compliant*

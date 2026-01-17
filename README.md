# Pharma ERP System - Complete Pharmaceutical Management

A comprehensive, production-ready ERP system for pharmaceutical manufacturing, inventory management, batch processing, QA/QC approval, accounting integration, and complete doctor-patient medical workflows.

---

**Copyright © 2026 [Your Name]. All rights reserved.**

## 🚀 Features

### Core Modules

1. **Inventory Management**
   - Raw Materials Inventory
   - Process Inventory (Work-in-Process)
   - Finished Goods Inventory
   - Automatic stock updates
   - Low stock & expiry alerts
   - Batch-wise tracking

2. **Batch Manufacturing**
   - Create multiple batches simultaneously
   - Raw material issuance from inventory
   - Process inventory tracking
   - Batch-wise material consumption
   - Complete traceability

3. **QA/QC Approval System**
   - Batch inspection & approval workflow
   - Test results documentation
   - Approval/Rejection with reasons
   - Automatic inventory movement on approval
   - Inspector tracking

4. **Purchase Management**
   - Purchase order creation
   - Supplier management
   - Automatic raw inventory updates
   - Receipt processing
   - Cost tracking

5. **Sales & Distribution**
   - Sales invoice generation
   - Customer management
   - Automatic finished goods deduction
   - Batch traceability in sales

6. **Doctor & Medical Workflow**
   - Doctor profiles & credentials
   - Patient records management
   - Prescription management
   - Surgery tracking with medicine usage
   - Complete medical history
   - Medicine-to-batch traceability

7. **Accounting Integration**
   - Purchase ledger
   - Sales ledger
   - Inventory valuation
   - Automatic financial updates

8. **Compliance & Audit**
   - Complete audit trails
   - Role-based access control
   - Compliance reports
   - Activity logging

## 🏗️ System Architecture

```
pharma-erp/
├── app/
│   ├── api/
│   │   ├── materials/          # Material & inventory APIs
│   │   ├── batches/            # Batch manufacturing APIs
│   │   ├── qa-approvals/       # QA/QC APIs
│   │   ├── purchase-orders/    # Purchase APIs
│   │   ├── sales-invoices/     # Sales APIs
│   │   ├── prescriptions/      # Medical prescription APIs
│   │   ├── patients/           # Patient management APIs
│   │   └── surgeries/          # Surgery tracking APIs
│   ├── dashboard/              # Dashboard UI
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── prisma.ts              # Database client
│   ├── utils.ts               # Helper functions
│   └── auth.ts                # Authentication utilities
├── prisma/
│   └── schema.prisma          # Database schema
└── README.md
```

## 📊 Database Schema

### Core Entities

- **Users** - System users with role-based access
- **Materials** - Raw, Process, and Finished materials
- **RawInventory** - Raw materials storage
- **ProcessInventory** - Work-in-process batch-wise
- **FinishedGoodsInventory** - QA-approved products
- **Batches** - Manufacturing batches
- **QAApprovals** - Quality control records
- **PurchaseOrders** - Material procurement
- **SalesInvoices** - Product sales
- **Suppliers** - Vendor management
- **Doctors** - Medical practitioners
- **Patients** - Patient records
- **Prescriptions** - Medical prescriptions
- **Surgeries** - Surgery records with medicine tracking
- **AuditLogs** - Complete system audit trail

## 🔄 End-to-End Workflow

### Purchase to Sale Flow

1. **Purchase Raw Materials**
   ```
   POST /api/purchase-orders
   → Creates PO
   → Status: PENDING
   ```

2. **Receive Materials**
   ```
   POST /api/purchase-orders/{id}/receive
   → Updates PO status to RECEIVED
   → Adds to Raw Inventory
   ```

3. **Create Manufacturing Batch**
   ```
   POST /api/batches
   → Creates batch
   → Status: IN_PROCESS
   ```

4. **Issue Materials to Batch**
   ```
   POST /api/materials/issue
   → Deducts from Raw Inventory
   → Adds to Process Inventory
   → Links to Batch
   ```

5. **QA/QC Approval**
   ```
   POST /api/qa-approvals
   → Inspects batch
   → If APPROVED:
     - Moves from Process to Finished Goods
     - Batch status: COMPLETED
   → If REJECTED:
     - Batch status: QA_REJECTED
     - Blocked from sales
   ```

6. **Create Sales Invoice**
   ```
   POST /api/sales-invoices
   → Creates invoice
   → Deducts from Finished Goods Inventory
   → Links batch to customer
   ```

### Medical Workflow

1. **Register Patient**
   ```
   POST /api/patients
   → Creates patient record
   ```

2. **Create Prescription**
   ```
   POST /api/prescriptions
   → Doctor prescribes medicines
   → Links to patient
   → Tracks medicine batches
   ```

3. **Record Surgery**
   ```
   POST /api/surgeries
   → Records surgery details
   → Tracks medicines used
   → Links batch numbers
   → Complete traceability
   ```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **UI**: Tailwind CSS + shadcn/ui
- **Authentication**: NextAuth.js
- **Deployment**: Vercel-ready

## 📦 Installation

1. Clone the repository
```bash
cd "e:\sentiment ai\project pharma"
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pharma_erp"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize database
```bash
npx prisma generate
npx prisma db push
```

5. (Optional) Seed database with sample data
```bash
npx prisma db seed
```

6. Run development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment to Vercel

1. Push code to GitHub

2. Import project in Vercel

3. Add environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

4. Deploy!

## 🔐 User Roles & Permissions

- **ADMIN** - Full system access
- **PRODUCTION_MANAGER** - Batch creation, material issuance
- **QA_QC_INSPECTOR** - Quality approval/rejection
- **ACCOUNTANT** - Purchase & sales management
- **DOCTOR** - Medical records, prescriptions, surgeries
- **INVENTORY_MANAGER** - Inventory monitoring
- **SALES_MANAGER** - Sales operations

## 📈 API Endpoints

### Materials & Inventory
- `GET /api/materials` - List all materials
- `POST /api/materials` - Create material
- `POST /api/materials/issue` - Issue material to batch

### Batch Manufacturing
- `GET /api/batches` - List all batches
- `POST /api/batches` - Create new batch

### QA/QC
- `GET /api/qa-approvals` - List QA approvals
- `POST /api/qa-approvals` - Approve/Reject batch

### Purchase
- `GET /api/purchase-orders` - List purchase orders
- `POST /api/purchase-orders` - Create purchase order
- `POST /api/purchase-orders/{id}/receive` - Receive materials

### Sales
- `GET /api/sales-invoices` - List sales invoices
- `POST /api/sales-invoices` - Create sales invoice

### Medical
- `GET /api/patients` - List patients
- `POST /api/patients` - Register patient
- `GET /api/prescriptions` - List prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/surgeries` - List surgeries
- `POST /api/surgeries` - Record surgery

## 🔍 Business Rules

1. **Raw materials can only be purchased** - They cannot be manufactured
2. **Materials must be issued to batches** - Automatically deducted from raw inventory
3. **Batches require QA approval** - Cannot move to finished goods without approval
4. **Only approved batches can be sold** - Rejected batches are blocked
5. **Inventory is automatically synchronized** - No manual adjustments needed
6. **Complete audit trail** - All actions are logged with user, timestamp, and changes
7. **Batch traceability** - From raw materials through to customer/patient

## 📝 Sample Data Flow

```
RAW MATERIAL PURCHASE
└─> Raw Inventory (+1000 units)
    └─> Issue to Batch (-500 units)
        └─> Process Inventory (+500 units, Batch #123)
            └─> QA Approval
                └─> Finished Goods Inventory (+500 units, Batch #123)
                    └─> Sales Invoice (-100 units)
                        └─> Customer/Patient Record
                            └─> Complete Traceability
```

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📄 License

Proprietary - All rights reserved

## 🤝 Support

For support and queries, contact the development team.

---

**Built with ❤️ for Pharmaceutical Industry**

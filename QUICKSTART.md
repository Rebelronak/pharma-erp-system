# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd "e:\sentiment ai\project pharma"
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Prisma ORM
- Tailwind CSS
- shadcn/ui components
- Authentication libraries

### 3. Set Up Database
```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed with sample data (optional but recommended)
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Default Login Credentials (After Seeding)

### Admin User
- Email: `admin@pharmaerp.com`
- Password: `Admin@123`
- Role: Full system access

### QA Inspector
- Email: `qa@pharmaerp.com`
- Password: `QA@123`
- Role: Quality control and approvals

### Doctor
- Email: `doctor@pharmaerp.com`
- Password: `Doctor@123`
- Role: Medical records and prescriptions

## Quick Test Workflow

### 1. Purchase Raw Materials
1. Go to Dashboard → Purchase
2. Create new purchase order
3. Add materials (e.g., Paracetamol API)
4. Submit order
5. Receive materials (adds to Raw Inventory)

### 2. Create Manufacturing Batch
1. Go to Dashboard → Batches
2. Create new batch
3. Select product (e.g., Paracetamol 500mg Tablets)
4. Set quantity and dates
5. Add required materials

### 3. Issue Materials to Batch
1. Open batch details
2. Issue materials from raw inventory
3. Materials automatically deducted from Raw Inventory
4. Added to Process Inventory under batch

### 4. QA/QC Approval
1. Login as QA Inspector
2. Go to Dashboard → QA/QC
3. Select batch for inspection
4. Enter test results
5. Approve or Reject
   - **If Approved**: Batch moves to Finished Goods
   - **If Rejected**: Batch blocked from sales

### 5. Create Sales Invoice
1. Go to Dashboard → Sales
2. Create new invoice
3. Add customer details
4. Select products from Finished Goods
5. System automatically deducts inventory
6. Batch traceability maintained

### 6. Medical Workflow
1. Login as Doctor
2. Register patient
3. Create prescription
4. Link medicines to batches
5. Complete traceability from patient → medicine → batch

## Project Structure
```
pharma-erp/
├── app/
│   ├── api/              # Backend API routes
│   ├── dashboard/        # Dashboard pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── ui/               # Reusable components
├── lib/
│   ├── prisma.ts        # Database client
│   ├── utils.ts         # Helper functions
│   └── auth.ts          # Authentication
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data
└── README.md            # Documentation
```

## Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run db:push     # Push schema to database
npm run db:seed     # Seed sample data
npm run db:studio   # Open Prisma Studio (database GUI)
```

## Database Management

### View Database in GUI
```bash
npm run db:studio
```
Opens Prisma Studio at [http://localhost:5555](http://localhost:5555)

### Reset Database
```bash
# Delete database file
rm prisma/dev.db

# Recreate and seed
npx prisma db push
npm run db:seed
```

## Environment Variables

The `.env` file contains:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="pharma-erp-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

**Important**: Change `NEXTAUTH_SECRET` in production!

## Common Issues & Solutions

### Issue: Prisma Client not generated
```bash
npx prisma generate
```

### Issue: Database out of sync
```bash
npx prisma db push
```

### Issue: Port 3000 already in use
```bash
# Change port
npm run dev -- -p 3001
```

### Issue: Module not found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## Next Steps

1. ✅ Explore the dashboard
2. ✅ Test the complete workflow
3. ✅ Review API documentation (API_DOCUMENTATION.md)
4. ✅ Check architecture details (ARCHITECTURE.md)
5. ✅ Customize for your needs
6. ✅ Deploy to Vercel (see DEPLOYMENT.md)

## Getting Help

- Read [README.md](README.md) for comprehensive documentation
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design

## Features to Explore

- **Inventory Management**: Raw, Process, and Finished Goods tracking
- **Batch Manufacturing**: Multi-batch processing with material tracking
- **QA/QC System**: Approval workflow with automatic inventory movement
- **Purchase Orders**: Supplier management and procurement
- **Sales Invoices**: Customer orders with automatic stock deduction
- **Medical Records**: Patient management, prescriptions, surgeries
- **Audit Logs**: Complete system activity tracking
- **Stock Alerts**: Low stock and expiry notifications
- **Batch Traceability**: From raw material to customer/patient

## Support

For questions or issues, refer to the documentation files or contact your development team.

---

**Happy ERP-ing! 🚀**

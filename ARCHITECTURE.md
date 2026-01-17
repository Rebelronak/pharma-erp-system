# Architecture Documentation

## System Overview

The Pharma ERP is a full-stack web application built on Next.js 14 with a comprehensive PostgreSQL database backend managed through Prisma ORM.

## Architecture Layers

### 1. Presentation Layer (Frontend)
- **Technology**: React 18, Next.js 14 App Router
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Hooks, Server Components
- **Key Components**:
  - Dashboard with real-time stats
  - Inventory management interface
  - Batch manufacturing workflow
  - QA/QC approval interface
  - Medical records management

### 2. API Layer (Backend)
- **Technology**: Next.js API Routes
- **Architecture**: RESTful API design
- **Authentication**: NextAuth.js with JWT
- **Validation**: Zod schemas
- **Key Routes**:
  - `/api/materials` - Material CRUD
  - `/api/batches` - Batch operations
  - `/api/qa-approvals` - QA workflow
  - `/api/purchase-orders` - Procurement
  - `/api/sales-invoices` - Sales
  - `/api/prescriptions` - Medical prescriptions
  - `/api/patients` - Patient management
  - `/api/surgeries` - Surgery tracking

### 3. Business Logic Layer
- **Inventory Management**:
  - Automatic stock updates
  - Multi-tier inventory (Raw, Process, Finished)
  - Alert system for low stock and expiry
  
- **Batch Processing**:
  - Material issuance workflow
  - Batch status management
  - QA approval integration
  
- **Accounting Integration**:
  - Purchase order to inventory
  - Sales invoice to stock deduction
  - Financial reconciliation

### 4. Data Layer
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Schema Design**: Normalized relational model
- **Key Entities**: 25+ tables with relationships

## Data Flow Architecture

### Purchase Flow
```
User → API Route → Business Logic → Database Transaction
                     ↓
              [Create PO]
                     ↓
              [Receive Materials]
                     ↓
              [Update Raw Inventory]
                     ↓
              [Create Audit Log]
```

### Manufacturing Flow
```
[Raw Inventory] → [Material Issue] → [Process Inventory]
                        ↓
                   [Batch #123]
                        ↓
                   [QA Approval]
                        ↓
              [Finished Goods Inventory]
```

### Sales Flow
```
[Finished Goods] → [Create Invoice] → [Stock Deduction]
                         ↓
                   [Customer Record]
                         ↓
                   [Batch Traceability]
```

## Database Design Principles

1. **Normalization**: 3NF compliance
2. **Referential Integrity**: Foreign key constraints
3. **Audit Trail**: All changes logged
4. **Soft Deletes**: isActive flags instead of hard deletes
5. **Timestamps**: createdAt, updatedAt on all entities

## Security Architecture

1. **Authentication**: Session-based with JWT
2. **Authorization**: Role-based access control (RBAC)
3. **API Security**: Request validation, rate limiting
4. **Data Protection**: Encrypted sensitive fields
5. **Audit Logging**: Complete activity tracking

## Deployment Architecture

### Development
- Local PostgreSQL database
- Next.js dev server
- Hot module replacement

### Production (Vercel)
- Vercel Edge Network
- PostgreSQL (Supabase/Neon/Railway)
- Environment variables for secrets
- CDN for static assets
- Automatic SSL

## Scalability Considerations

1. **Database**:
   - Indexed frequently queried columns
   - Connection pooling
   - Read replicas for reporting

2. **API**:
   - Stateless design
   - Horizontal scaling on Vercel
   - Caching strategies

3. **Performance**:
   - Server-side rendering
   - API route optimization
   - Database query optimization

## Integration Points

1. **External Systems**:
   - Accounting software (future)
   - Lab equipment (future)
   - Regulatory reporting (future)

2. **APIs**:
   - RESTful endpoints
   - JSON data format
   - Standard HTTP methods

## Monitoring & Logging

1. **Application Logs**:
   - Error tracking
   - Performance metrics
   - User activity

2. **Audit Logs**:
   - User actions
   - Data changes
   - Compliance tracking

## Backup & Recovery

1. **Database Backups**:
   - Daily automated backups
   - Point-in-time recovery
   - Backup retention policy

2. **Disaster Recovery**:
   - Geographic redundancy
   - Failover procedures
   - Recovery time objectives

## Technology Decisions

| Aspect | Technology | Rationale |
|--------|-----------|-----------|
| Frontend | Next.js 14 | Server components, performance, SEO |
| Database | PostgreSQL | Reliability, ACID compliance, complex queries |
| ORM | Prisma | Type safety, migrations, developer experience |
| UI | Tailwind + shadcn | Rapid development, consistency, accessibility |
| Deployment | Vercel | Seamless Next.js integration, edge network |
| Auth | NextAuth.js | Industry standard, flexible, secure |

## Future Enhancements

1. Real-time notifications
2. Advanced analytics dashboard
3. Mobile application
4. Barcode/QR scanning
5. API for third-party integrations
6. Multi-tenant support
7. Advanced reporting engine

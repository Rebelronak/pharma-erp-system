# API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.vercel.app/api
```

## Authentication
All API endpoints (except public routes) require authentication via JWT token.

```http
Authorization: Bearer <token>
```

---

## Materials API

### Get All Materials
```http
GET /api/materials
GET /api/materials?type=RAW
```

**Response:**
```json
[
  {
    "id": "cm123abc",
    "code": "MAT-001",
    "name": "Paracetamol",
    "type": "RAW",
    "description": "Active pharmaceutical ingredient",
    "unitOfMeasure": "kg",
    "reorderLevel": 100,
    "standardCost": 50.00,
    "isActive": true,
    "createdAt": "2026-01-15T10:00:00Z"
  }
]
```

### Create Material
```http
POST /api/materials
Content-Type: application/json

{
  "code": "MAT-001",
  "name": "Paracetamol",
  "type": "RAW",
  "description": "Active ingredient",
  "unitOfMeasure": "kg",
  "reorderLevel": 100,
  "standardCost": 50.00
}
```

### Issue Material to Batch
```http
POST /api/materials/issue
Content-Type: application/json

{
  "batchId": "batch123",
  "materialId": "mat123",
  "quantity": 500,
  "issuedById": "user123"
}
```

---

## Batches API

### Get All Batches
```http
GET /api/batches
```

**Response:**
```json
[
  {
    "id": "batch123",
    "batchNumber": "BATCH-202601-A1B2C3",
    "productId": "prod123",
    "plannedQuantity": 10000,
    "actualQuantity": 9850,
    "status": "QA_APPROVED",
    "startDate": "2026-01-10T08:00:00Z",
    "completionDate": "2026-01-14T16:00:00Z",
    "expiryDate": "2028-01-10T00:00:00Z",
    "product": {
      "name": "Paracetamol 500mg Tablets"
    },
    "materials": [...],
    "qaApprovals": [...]
  }
]
```

### Create Batch
```http
POST /api/batches
Content-Type: application/json

{
  "productId": "prod123",
  "plannedQuantity": 10000,
  "startDate": "2026-01-15",
  "expiryDate": "2028-01-15",
  "createdById": "user123",
  "notes": "Standard batch",
  "materials": [
    {
      "materialId": "mat123",
      "requiredQuantity": 5000
    }
  ]
}
```

---

## QA Approvals API

### Get All QA Approvals
```http
GET /api/qa-approvals
```

### Create QA Approval
```http
POST /api/qa-approvals
Content-Type: application/json

{
  "batchId": "batch123",
  "inspectorId": "user123",
  "status": "APPROVED",
  "testResults": "All tests passed. pH: 7.0, Purity: 99.5%",
  "remarks": "Batch meets all quality standards"
}
```

**For Rejection:**
```json
{
  "batchId": "batch123",
  "inspectorId": "user123",
  "status": "REJECTED",
  "testResults": "Failed purity test",
  "remarks": "Below acceptable standards",
  "rejectionReason": "Purity only 95%, required 99%"
}
```

**Business Logic:**
- Status `APPROVED`: Moves batch from Process → Finished Goods
- Status `REJECTED`: Blocks batch, prevents sales
- Automatic inventory updates on approval

---

## Purchase Orders API

### Get All Purchase Orders
```http
GET /api/purchase-orders
```

### Create Purchase Order
```http
POST /api/purchase-orders
Content-Type: application/json

{
  "supplierId": "sup123",
  "expectedDate": "2026-01-20",
  "createdById": "user123",
  "notes": "Urgent order",
  "items": [
    {
      "materialId": "mat123",
      "quantity": 1000,
      "unitPrice": 50.00
    }
  ]
}
```

**Auto-calculated:** `totalAmount`

### Receive Purchase Order
```http
POST /api/purchase-orders/{id}/receive
Content-Type: application/json

{
  "batchNumbers": {
    "item1": "BATCH-SUP-001"
  },
  "lotNumbers": {
    "item1": "LOT-2026-001"
  },
  "expiryDates": {
    "item1": "2027-12-31"
  }
}
```

**Business Logic:**
- Updates PO status to `RECEIVED`
- Adds all items to Raw Inventory
- Records batch/lot/expiry information

---

## Sales Invoices API

### Get All Sales Invoices
```http
GET /api/sales-invoices
```

### Create Sales Invoice
```http
POST /api/sales-invoices
Content-Type: application/json

{
  "customerName": "ABC Hospital",
  "customerEmail": "purchase@abchospital.com",
  "customerPhone": "+1234567890",
  "customerAddress": "123 Medical St",
  "dueDate": "2026-02-15",
  "taxRate": 10,
  "createdById": "user123",
  "items": [
    {
      "materialId": "mat123",
      "batchNumber": "BATCH-202601-A1B2C3",
      "quantity": 500,
      "unitPrice": 2.50
    }
  ]
}
```

**Auto-calculated:**
- `totalAmount`
- `taxAmount`
- `grandTotal`

**Business Logic:**
- Validates finished goods inventory availability
- Deducts stock automatically
- Links batch numbers for traceability

---

## Patients API

### Get All Patients
```http
GET /api/patients
```

### Create Patient
```http
POST /api/patients
Content-Type: application/json

{
  "name": "John Doe",
  "dateOfBirth": "1985-05-15",
  "gender": "Male",
  "phone": "+1234567890",
  "email": "john@example.com",
  "address": "456 Patient Ave",
  "bloodGroup": "O+",
  "allergies": "Penicillin",
  "medicalHistory": "Hypertension, Diabetes"
}
```

**Auto-generated:** `patientNumber` (e.g., PT-A1B2C3D4)

---

## Prescriptions API

### Get All Prescriptions
```http
GET /api/prescriptions
```

### Create Prescription
```http
POST /api/prescriptions
Content-Type: application/json

{
  "patientId": "patient123",
  "doctorId": "doctor123",
  "diagnosis": "Upper respiratory infection",
  "notes": "Follow up in 7 days",
  "medicines": [
    {
      "medicineName": "Amoxicillin 500mg",
      "dosage": "500mg",
      "frequency": "Three times daily",
      "duration": "7 days",
      "quantity": 21,
      "instructions": "Take with food"
    }
  ]
}
```

**Auto-generated:** `prescriptionNumber` (e.g., RX-2026-A1B2C3)

---

## Surgeries API

### Get All Surgeries
```http
GET /api/surgeries
```

### Create Surgery Record
```http
POST /api/surgeries
Content-Type: application/json

{
  "patientId": "patient123",
  "doctorId": "doctor123",
  "surgeryType": "Appendectomy",
  "surgeryDate": "2026-01-15T09:00:00Z",
  "duration": 120,
  "outcome": "Successful",
  "complications": "None",
  "notes": "Routine procedure",
  "medicinesUsed": [
    {
      "medicineName": "Propofol",
      "batchNumber": "BATCH-202601-PROP01",
      "quantity": 200,
      "unitOfMeasure": "ml",
      "administeredAt": "2026-01-15T09:15:00Z"
    }
  ]
}
```

**Auto-generated:** `surgeryNumber`

**Key Feature:** Tracks exact batch numbers of medicines used in surgery for complete traceability.

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "Validation errors..."
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limiting

- **Development**: No limits
- **Production**: 100 requests per minute per IP

---

## Pagination (Future)

```http
GET /api/batches?page=1&limit=20
```

---

## Filtering (Future)

```http
GET /api/batches?status=QA_APPROVED&startDate=2026-01-01
```

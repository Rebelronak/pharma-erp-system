# 🎯 End-to-End Workflow Examples

## Complete Business Workflows for Pharma ERP

This document demonstrates complete real-world workflows from purchase to medical usage.

---

## 📦 Workflow 1: Purchase → Manufacturing → QA → Sales

### Step 1: Create Purchase Order

```http
POST /api/purchase-orders
Content-Type: application/json

{
  "supplierId": "supplier_123",
  "orderDate": "2026-01-16",
  "expectedDate": "2026-01-20",
  "notes": "Monthly raw material order",
  "items": [
    {
      "materialId": "mat_acetaminophen",
      "quantity": 500,
      "unitPrice": 45.50
    },
    {
      "materialId": "mat_lactose",
      "quantity": 1000,
      "unitPrice": 12.75
    }
  ]
}
```

**Result:**
- Purchase order created with status "PENDING"
- PO Number: PO-2026-001

### Step 2: Receive Materials

```http
POST /api/purchase-orders/PO-2026-001/receive
Content-Type: application/json

{
  "receivedDate": "2026-01-18",
  "items": [
    {
      "materialId": "mat_acetaminophen",
      "receivedQuantity": 500,
      "lotNumber": "LOT-ACE-2026-002",
      "expiryDate": "2027-12-31"
    },
    {
      "materialId": "mat_lactose",
      "receivedQuantity": 1000,
      "lotNumber": "LOT-LAC-2026-002",
      "expiryDate": "2028-06-30"
    }
  ]
}
```

**Result:**
- ✅ Raw Inventory updated:
  - Acetaminophen: +500 kg (LOT-ACE-2026-002)
  - Lactose: +1000 kg (LOT-LAC-2026-002)
- Purchase Order status: "RECEIVED"

### Step 3: Create Manufacturing Batch

```http
POST /api/batches
Content-Type: application/json

{
  "productId": "mat_paracetamol_500mg",
  "plannedQuantity": 100000,
  "startDate": "2026-01-20",
  "notes": "Batch for hospital orders"
}
```

**Result:**
- Batch created: BATCH-2026-003
- Status: IN_PROCESS
- Process Inventory record created

### Step 4: Issue Raw Materials to Batch

```http
POST /api/materials/issue
Content-Type: application/json

{
  "batchId": "BATCH-2026-003",
  "issuedBy": "Production Manager",
  "materials": [
    {
      "materialId": "mat_acetaminophen",
      "quantity": 50,
      "lotNumber": "LOT-ACE-2026-002"
    },
    {
      "materialId": "mat_lactose",
      "quantity": 40,
      "lotNumber": "LOT-LAC-2026-002"
    }
  ]
}
```

**Result:**
- ✅ Raw Inventory deducted:
  - Acetaminophen: -50 kg (now 450 kg)
  - Lactose: -40 kg (now 960 kg)
- ✅ Process Inventory updated for BATCH-2026-003

### Step 5: Complete Manufacturing & Submit for QA

```http
PATCH /api/batches/BATCH-2026-003
Content-Type: application/json

{
  "status": "QA_PENDING",
  "actualQuantity": 99500,
  "completionDate": "2026-01-22"
}
```

**Result:**
- Batch status changed to "QA_PENDING"
- QA Approval record auto-created with status "PENDING"

### Step 6: QA Inspection & Approval

```http
POST /api/qa-approvals
Content-Type: application/json

{
  "batchId": "BATCH-2026-003",
  "inspectorId": "user_qa_inspector",
  "status": "APPROVED",
  "inspectionDate": "2026-01-23",
  "approvalDate": "2026-01-23",
  "testResults": {
    "weight": "Pass - 501mg avg",
    "hardness": "Pass - 8.2 kg/cm²",
    "friability": "Pass - 0.3%",
    "dissolution": "Pass - 95% in 30 min",
    "assay": "99.8%",
    "uniformity": "Pass"
  },
  "remarks": "All quality parameters within specification limits. Batch approved for release."
}
```

**Result:**
- ✅ QA Approval status: APPROVED
- ✅ Batch status changed to "QA_APPROVED"
- ✅ Process Inventory cleared for BATCH-2026-003
- ✅ Finished Goods Inventory updated:
  - Paracetamol 500mg: +99,500 tablets
  - Lot: LOT-FIN-2026-003
  - Expiry: 2028-01-31

### Step 7: Create Sales Invoice

```http
POST /api/sales-invoices
Content-Type: application/json

{
  "customerName": "City General Hospital",
  "customerPhone": "+1-555-3001",
  "customerAddress": "123 Hospital Ave, Boston, MA",
  "invoiceDate": "2026-01-25",
  "notes": "Bulk order for hospital pharmacy",
  "items": [
    {
      "materialId": "mat_paracetamol_500mg",
      "batchNumber": "BATCH-2026-003",
      "quantity": 10000,
      "unitPrice": 0.50
    }
  ]
}
```

**Result:**
- ✅ Sales Invoice created: INV-2026-002
- ✅ Total Amount: $5,000
- ✅ Finished Goods Inventory deducted:
  - Paracetamol 500mg: -10,000 tablets (89,500 remaining)

---

## 🏥 Workflow 2: Medical - Doctor → Patient → Surgery → Prescription

### Step 1: Register Doctor

```http
POST /api/doctors
Content-Type: application/json

{
  "code": "DOC003",
  "name": "Dr. Emily Chen",
  "specialization": "Neurosurgery",
  "phone": "+1-555-1003",
  "email": "dr.chen@hospital.com",
  "licenseNumber": "MED-12347"
}
```

**Result:**
- Doctor profile created
- Doctor ID: DOC003

### Step 2: Register Patient

```http
POST /api/patients
Content-Type: application/json

{
  "code": "PAT003",
  "name": "Robert Johnson",
  "age": 52,
  "gender": "Male",
  "phone": "+1-555-2003",
  "email": "robert.j@email.com",
  "address": "456 Elm Street, Boston, MA",
  "medicalHistory": {
    "allergies": ["Aspirin", "NSAIDs"],
    "chronicConditions": ["Diabetes Type 2", "Hypertension"],
    "previousSurgeries": ["Appendectomy 2015"],
    "currentMedications": ["Metformin", "Lisinopril"]
  }
}
```

**Result:**
- Patient registered
- Patient ID: PAT003
- Medical history recorded

### Step 3: Record Surgery

```http
POST /api/surgeries
Content-Type: application/json

{
  "patientId": "PAT003",
  "doctorId": "DOC003",
  "surgeryType": "Lumbar Spinal Fusion",
  "surgeryDate": "2026-01-26T09:00:00Z",
  "notes": "L4-L5 fusion due to severe disc herniation",
  "outcome": "Successful - Patient stable post-op"
}
```

**Result:**
- Surgery recorded: SUR-2026-002
- Surgery details linked to patient and doctor

### Step 4: Create Post-Op Prescription

```http
POST /api/prescriptions
Content-Type: application/json

{
  "patientId": "PAT003",
  "doctorId": "DOC003",
  "surgeryId": "SUR-2026-002",
  "prescriptionDate": "2026-01-26",
  "diagnosis": "Post-operative pain management - spinal fusion",
  "medicines": [
    {
      "materialId": "mat_paracetamol_500mg",
      "batchNumber": "BATCH-2026-003",
      "quantity": 60,
      "dosage": "500mg (1 tablet)",
      "frequency": "Every 6 hours",
      "instructions": "Take with food. Maximum 4 tablets per day."
    },
    {
      "materialId": "mat_gabapentin_300mg",
      "batchNumber": "BATCH-2026-004",
      "quantity": 90,
      "dosage": "300mg (1 capsule)",
      "frequency": "Three times daily",
      "instructions": "Take with meals. Do not stop abruptly."
    }
  ],
  "instructions": "Follow up in 2 weeks. Physical therapy recommended after 6 weeks."
}
```

**Result:**
- Prescription created: PRE-2026-002
- Complete linkage:
  - Doctor: Dr. Emily Chen
  - Patient: Robert Johnson
  - Surgery: SUR-2026-002
  - Medicines: Linked to specific batches
  - Full traceability: Doctor → Patient → Surgery → Medicine → Batch

**Automatic Inventory Impact:**
- Paracetamol 500mg (BATCH-2026-003): -60 tablets
- Gabapentin 300mg (BATCH-2026-004): -90 capsules

---

## 🔄 Workflow 3: Batch Rejection & Rework

### Step 1: Submit Batch for QA

```http
PATCH /api/batches/BATCH-2026-005
Content-Type: application/json

{
  "status": "QA_PENDING",
  "actualQuantity": 48200,
  "completionDate": "2026-01-28"
}
```

### Step 2: QA Rejection

```http
POST /api/qa-approvals
Content-Type: application/json

{
  "batchId": "BATCH-2026-005",
  "inspectorId": "user_qa_inspector",
  "status": "REJECTED",
  "inspectionDate": "2026-01-29",
  "rejectionReason": "Dissolution test failure - only 82% dissolved in 30 minutes (spec: >90%)",
  "testResults": {
    "weight": "Pass",
    "hardness": "Pass",
    "friability": "Pass",
    "dissolution": "FAIL - 82%",
    "assay": "99.2%"
  },
  "remarks": "Batch rejected due to dissolution failure. Rework required - recommend re-granulation."
}
```

**Result:**
- ✅ QA Approval status: REJECTED
- ✅ Batch status: QA_REJECTED
- ✅ Batch blocked from Finished Goods
- ✅ Process Inventory remains unchanged
- ✅ Cannot be sold or distributed
- ✅ Rejection logged with reason and test results

---

## 📊 Workflow 4: Inventory Alerts & Reordering

### Low Stock Alert Trigger

When Raw Inventory falls below reorder level:

```json
{
  "alert": {
    "type": "LOW_STOCK",
    "materialCode": "RAW001",
    "materialName": "Acetaminophen API",
    "currentQuantity": 85,
    "reorderLevel": 100,
    "message": "Acetaminophen API stock below reorder level",
    "suggestedOrderQuantity": 500
  }
}
```

### Expiry Alert Trigger

30 days before expiry:

```json
{
  "alert": {
    "type": "NEAR_EXPIRY",
    "materialCode": "RAW002",
    "lotNumber": "LOT-LAC-2024-001",
    "quantity": 150,
    "expiryDate": "2026-02-28",
    "daysUntilExpiry": 13,
    "message": "Lactose lot LOT-LAC-2024-001 expiring in 13 days"
  }
}
```

---

## 🔍 Traceability Example

### Forward Traceability: Raw Material → Finished Product

**Query:** "Where did LOT-ACE-2026-002 end up?"

```
LOT-ACE-2026-002 (Acetaminophen, 500 kg)
│
├─> BATCH-2026-003 (50 kg used)
│   ├─> QA Approved: 2026-01-23
│   ├─> Finished Goods: LOT-FIN-2026-003
│   │
│   └─> Sales:
│       ├─> INV-2026-002: City General Hospital (10,000 tablets)
│       └─> Remaining in stock: 89,500 tablets
│
├─> BATCH-2026-006 (75 kg used)
│   └─> Status: IN_PROCESS
│
└─> Remaining in Raw Inventory: 375 kg
```

### Backward Traceability: Medicine → Source

**Query:** "Where did the medicine prescribed to Patient PAT003 come from?"

```
Prescription: PRE-2026-002 (Patient: Robert Johnson)
│
└─> Paracetamol 500mg, 60 tablets
    │
    └─> Batch: BATCH-2026-003
        ├─> QA Approved: 2026-01-23 by QA Inspector
        ├─> Manufactured: 2026-01-20 to 2026-01-22
        ├─> Lot Number: LOT-FIN-2026-003
        ├─> Expiry: 2028-01-31
        │
        └─> Raw Materials Used:
            ├─> Acetaminophen API
            │   ├─> Lot: LOT-ACE-2026-002
            │   ├─> Supplier: MedChem Supplies Inc
            │   └─> Purchase Order: PO-2026-001
            │
            └─> Lactose Monohydrate
                ├─> Lot: LOT-LAC-2026-002
                ├─> Supplier: MedChem Supplies Inc
                └─> Purchase Order: PO-2026-001
```

---

## 📈 Reports & Analytics

### Batch Production Report

```
Period: January 2026

Total Batches Created: 6
├─> In Process: 2
├─> QA Pending: 1
├─> QA Approved: 2
└─> QA Rejected: 1

Production Efficiency: 95.2%
QA Approval Rate: 66.7%
Average Batch Cycle Time: 3.5 days
```

### Inventory Valuation Report

```
As of: 2026-01-30

Raw Inventory Value: $45,250
Process Inventory Value: $12,800
Finished Goods Value: $98,500
──────────────────────────────
Total Inventory: $156,550
```

### Doctor Performance Report

```
Dr. Emily Chen (Neurosurgery)
Period: January 2026

Surgeries Performed: 8
Prescriptions Issued: 12
Patients Treated: 15
Average Surgery Duration: 3.2 hours
Success Rate: 100%
```

---

## ✅ Compliance Checklist

- [x] Batch traceability maintained
- [x] QA approval mandatory before sales
- [x] Expiry dates tracked
- [x] Lot numbers recorded
- [x] Supplier information captured
- [x] Patient-medicine linkage established
- [x] Audit trail complete
- [x] Rejection reasons documented
- [x] Real-time inventory sync
- [x] Doctor-patient records linked

---

**System Version:** 1.0.0  
**Last Updated:** January 16, 2026  
**Status:** Production-Ready ✅

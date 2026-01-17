import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function generateBatchNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `BATCH-${year}${month}-${random}`
}

export function generatePONumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `PO-${year}${month}-${random}`
}

export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `INV-${year}${month}-${random}`
}

export function generatePatientNumber(): string {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `PT-${random}`
}

export function generatePrescriptionNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `RX-${year}-${random}`
}

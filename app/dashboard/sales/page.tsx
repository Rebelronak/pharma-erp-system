'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function SalesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    totalAmount: '',
    notes: ''
  })

  const loadInvoices = () => {
    fetch('/api/sales-invoices')
      .then(r => r.json())
      .then(data => {
        setInvoices(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/sales-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalAmount: parseFloat(formData.totalAmount),
          userId: 'f974f33c-b9b3-4a7e-b395-7a6a7619f610'
        })
      })
      if (res.ok) {
        alert('Sales invoice created!')
        setShowForm(false)
        setFormData({ customerName: '', invoiceDate: new Date().toISOString().split('T')[0], totalAmount: '', notes: '' })
        loadInvoices()
      } else {
        alert('Failed to create invoice')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating invoice')
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold">Sales Invoices</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ New Invoice'}
        </button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create Sales Invoice</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Customer Name</Label>
              <Input value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} required />
            </div>
            <div>
              <Label>Invoice Date</Label>
              <Input type="date" value={formData.invoiceDate} onChange={e => setFormData({...formData, invoiceDate: e.target.value})} required />
            </div>
            <div>
              <Label>Total Amount</Label>
              <Input type="number" step="0.01" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value})} required />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>
            <Button type="submit">Create Invoice</Button>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Invoice Number</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">
                    No sales invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{invoice.invoiceNumber}</td>
                    <td className="p-3">{invoice.customerName}</td>
                    <td className="p-3">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                    <td className="p-3">${invoice.totalAmount.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

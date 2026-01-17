'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function PurchasePage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    supplierId: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    totalAmount: '',
    notes: ''
  })

  const loadData = () => {
    Promise.all([
      fetch('/api/purchase-orders').then(r => r.json()),
      fetch('/api/suppliers').then(r => r.json())
    ]).then(([ordersData, suppliersData]) => {
      setOrders(ordersData)
      setSuppliers(suppliersData)
      setLoading(false)
      if (suppliersData.length > 0) {
        setFormData(prev => ({...prev, supplierId: suppliersData[0].id}))
      }
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalAmount: parseFloat(formData.totalAmount),
          userId: 'f974f33c-b9b3-4a7e-b395-7a6a7619f610'
        })
      })
      if (res.ok) {
        alert('Purchase order created!')
        setShowForm(false)
        setFormData({ supplierId: suppliers[0]?.id || '', orderDate: new Date().toISOString().split('T')[0], expectedDelivery: '', totalAmount: '', notes: '' })
        loadData()
      } else {
        alert('Failed to create purchase order')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating purchase order')
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
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ New Purchase Order'}
        </button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create Purchase Order</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Supplier</Label>
              <select
                value={formData.supplierId}
                onChange={e => setFormData({...formData, supplierId: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                {suppliers.map((sup: any) => (
                  <option key={sup.id} value={sup.id}>{sup.code} - {sup.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Order Date</Label>
              <Input type="date" value={formData.orderDate} onChange={e => setFormData({...formData, orderDate: e.target.value})} required />
            </div>
            <div>
              <Label>Expected Delivery</Label>
              <Input type="date" value={formData.expectedDelivery} onChange={e => setFormData({...formData, expectedDelivery: e.target.value})} />
            </div>
            <div>
              <Label>Total Amount</Label>
              <Input type="number" step="0.01" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value})} required />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>
            <Button type="submit">Create Order</Button>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">PO Number</th>
                <th className="text-left p-3">Supplier</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">
                    No purchase orders found
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{order.orderNumber}</td>
                    <td className="p-3">{order.supplierId}</td>
                    <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="p-3">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'RECEIVED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
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

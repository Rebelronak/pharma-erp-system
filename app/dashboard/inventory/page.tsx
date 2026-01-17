'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function InventoryPage() {
  const router = useRouter()
  const [rawInventory, setRawInventory] = useState([])
  const [finishedInventory, setFinishedInventory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/inventory/raw').then(r => r.json()),
      fetch('/api/inventory/finished').then(r => r.json())
    ]).then(([raw, finished]) => {
      setRawInventory(raw)
      setFinishedInventory(finished)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
      </div>

      {/* Raw Inventory */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Raw Materials Inventory</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Material</th>
                <th className="text-left p-3">Total Quantity</th>
                <th className="text-left p-3">Lots</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rawInventory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-gray-500">
                    No raw materials in inventory
                  </td>
                </tr>
              ) : (
                rawInventory.map((item: any, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.material?.name || 'Unknown'}</td>
                    <td className="p-3">{item.totalQuantity} {item.material?.unit}</td>
                    <td className="p-3">{item.lots?.length || 0} lot(s)</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        In Stock
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Finished Goods */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Finished Goods Inventory</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Total Quantity</th>
                <th className="text-left p-3">Batches</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {finishedInventory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-gray-500">
                    No finished goods in inventory
                  </td>
                </tr>
              ) : (
                finishedInventory.map((item: any, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.material?.name || 'Unknown'}</td>
                    <td className="p-3">{item.totalQuantity} {item.material?.unit}</td>
                    <td className="p-3">{item.batches?.length || 0} batch(es)</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Available
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

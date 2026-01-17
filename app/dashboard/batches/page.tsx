'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function BatchesPage() {
  const router = useRouter()
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/batches')
      .then(r => r.json())
      .then(data => {
        setBatches(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

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
          <h1 className="text-3xl font-bold">Batches</h1>
        </div>
        <a href="/dashboard/batches/new">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            + New Batch
          </button>
        </a>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Batch Number</th>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Quantity</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Start Date</th>
              </tr>
            </thead>
            <tbody>
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">
                    No batches found. Create your first batch!
                  </td>
                </tr>
              ) : (
                batches.map((batch: any) => (
                  <tr key={batch.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{batch.batchNumber}</td>
                    <td className="p-3">{batch.productId}</td>
                    <td className="p-3">{batch.plannedQuantity}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        batch.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        batch.status === 'IN_PROCESS' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(batch.startDate).toLocaleDateString()}</td>
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

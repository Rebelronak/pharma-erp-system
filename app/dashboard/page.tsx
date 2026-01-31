"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Box,
  Activity,
  Stethoscope
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [stats, setStats] = useState({
    materials: 0,
    batches: 0,
    pendingQA: 0,
    sales: 0
  })
  const [batches, setBatches] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/materials').then(r => r.json()),
      fetch('/api/batches').then(r => r.json()),
      fetch('/api/qa-approvals').then(r => r.json()),
      fetch('/api/sales-invoices').then(r => r.json())
    ]).then(([materialsData, batchData, qa, sales]) => {
      const materials = Array.isArray(materialsData) ? materialsData : []
      const batchesArr = Array.isArray(batchData) ? batchData : []
      const qaData = Array.isArray(qa) ? qa : []
      const salesData = Array.isArray(sales) ? sales : []
      setStats({
        materials: materials.length || 0,
        batches: batchesArr.length || 0,
        pendingQA: qaData.filter((q: any) => q.status === 'PENDING').length || 0,
        sales: salesData.reduce((sum: number, s: any) => sum + (s.totalAmount || 0), 0)
      })
      setBatches(batchesArr.slice(0, 4))
    }).catch(err => {
      console.error('Error fetching dashboard data:', err)
      setStats({ materials: 0, batches: 0, pendingQA: 0, sales: 0 })
      setBatches([])
    })
  }, [])

  return (
    <div>
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome to PharmaERP Management System</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin User</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Materials"
            value={stats.materials.toString()}
            change=""
            trend="up"
            icon={<Box className="h-6 w-6 text-blue-600" />}
          />
          <StatCard
            title="Active Batches"
            value={stats.batches.toString()}
            change=""
            trend="up"
            icon={<Activity className="h-6 w-6 text-green-600" />}
          />
          <StatCard
            title="Pending QA"
            value={stats.pendingQA.toString()}
            change=""
            trend="up"
            icon={<Clock className="h-6 w-6 text-orange-600" />}
          />
          <StatCard
            title="Sales Total"
            value={`$${stats.sales.toFixed(2)}`}
            change=""
            trend="up"
            icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Batches</CardTitle>
              <CardDescription>Latest manufacturing batches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batches.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No batches yet</p>
                ) : (
                  batches.map((batch: any) => (
                    <BatchItem 
                      key={batch.id}
                      batchNumber={batch.batchNumber} 
                      status={batch.status} 
                      product={batch.productId} 
                    />
                  ))
                )}
              </div>
              <Link href="/dashboard/batches">
                <Button variant="outline" className="w-full mt-4">
                  View All Batches
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>Low stock and expiry warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-gray-500 py-8">No alerts at this time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/batches/new" className="w-full">
                <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 transition">
                  <Activity className="mr-2 h-4 w-4" />
                  New Batch
                </button>
              </Link>
              <Link href="/dashboard/materials" className="w-full">
                <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 transition">
                  <Box className="mr-2 h-4 w-4" />
                  Add Material
                </button>
              </Link>
              <Link href="/dashboard/medical" className="w-full">
                <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 transition">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Add Doctor
                </button>
              </Link>
              <Link href="/dashboard/patients" className="w-full">
                <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 transition">
                  Add Patient
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, trend, icon }: {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BatchItem({ batchNumber, status, product }: {
  batchNumber: string
  status: string
  product: string
}) {
  const statusColors: Record<string, string> = {
    'In Process': 'bg-blue-100 text-blue-800',
    'Ready for QA': 'bg-yellow-100 text-yellow-800',
    'QA Approved': 'bg-green-100 text-green-800',
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <p className="font-medium">{batchNumber}</p>
        <p className="text-sm text-gray-600">{product}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    </div>
  )
}

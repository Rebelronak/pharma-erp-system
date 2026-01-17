"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  Activity, 
  Users, 
  Stethoscope,
  Settings,
  LogOut,
  Menu,
  X,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Box,
  Warehouse
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState({
    materials: 0,
    batches: 0,
    pendingQA: 0,
    sales: 0
  })
  const [batches, setBatches] = useState([])

  useEffect(() => {
    // Fetch real data from APIs
    Promise.all([
      fetch('/api/materials').then(r => r.json()),
      fetch('/api/batches').then(r => r.json()),
      fetch('/api/qa-approvals').then(r => r.json()),
      fetch('/api/sales-invoices').then(r => r.json())
    ]).then(([materialsData, batchData, qa, sales]) => {
      setStats({
        materials: materialsData.length || 0,
        batches: batchData.length || 0,
        pendingQA: qa.filter((q: any) => q.status === 'PENDING').length || 0,
        sales: sales.reduce((sum: number, s: any) => sum + (s.totalAmount || 0), 0)
      })
      setBatches(batchData.slice(0, 4))
    }).catch(err => console.error('Error fetching dashboard data:', err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} z-50`}>
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && <h2 className="font-bold text-xl text-blue-600">PharmaERP</h2>}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" href="/dashboard" active sidebarOpen={sidebarOpen} />
          <NavItem icon={<Box />} label="Materials" href="/dashboard/materials" sidebarOpen={sidebarOpen} />
          <NavItem icon={<Warehouse />} label="Inventory" href="/dashboard/inventory" sidebarOpen={sidebarOpen} />
          <NavItem icon={<Activity />} label="Batches" href="/dashboard/batches" sidebarOpen={sidebarOpen} />
          <NavItem icon={<CheckCircle2 />} label="QA/QC" href="/dashboard/qa-qc" sidebarOpen={sidebarOpen} />
          <NavItem icon={<ShoppingCart />} label="Purchase" href="/dashboard/purchase" sidebarOpen={sidebarOpen} />
          <NavItem icon={<FileText />} label="Sales" href="/dashboard/sales" sidebarOpen={sidebarOpen} />
          <NavItem icon={<Stethoscope />} label="Medical" href="/dashboard/medical" sidebarOpen={sidebarOpen} />
          <NavItem icon={<Users />} label="Patients" href="/dashboard/patients" sidebarOpen={sidebarOpen} />
          <NavItem icon={<Settings />} label="Settings" href="/dashboard/settings" sidebarOpen={sidebarOpen} />
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <Button variant="ghost" className="w-full justify-start" size={sidebarOpen ? "default" : "icon"}>
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
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

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
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

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Batches */}
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

            {/* Stock Alerts */}
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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="/dashboard/batches/new" className="w-full">
                  <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 transition">
                    <Activity className="mr-2 h-4 w-4" />
                    New Batch
                  </button>
                </a>
                <a href="/dashboard/materials" className="w-full">
                  <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 transition">
                    <Box className="mr-2 h-4 w-4" />
                    Add Material
                  </button>
                </a>
                <a href="/dashboard/medical" className="w-full">
                  <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 transition">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Add Doctor
                  </button>
                </a>
                <a href="/dashboard/patients" className="w-full">
                  <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 transition">
                    <Users className="mr-2 h-4 w-4" />
                    Add Patient
                  </button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, href, active, sidebarOpen }: { 
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  sidebarOpen: boolean
}) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
      }`}>
        {icon}
        {sidebarOpen && <span className="font-medium">{label}</span>}
      </div>
    </Link>
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  )
}

function AlertItem({ type, message, severity }: {
  type: string
  message: string
  severity: 'warning' | 'error'
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${
      severity === 'error' ? 'bg-red-50' : 'bg-yellow-50'
    }`}>
      <AlertCircle className={`h-5 w-5 ${
        severity === 'error' ? 'text-red-600' : 'text-yellow-600'
      }`} />
      <p className={`text-sm ${
        severity === 'error' ? 'text-red-800' : 'text-yellow-800'
      }`}>{message}</p>
    </div>
  )
}

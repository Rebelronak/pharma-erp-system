'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  Activity, 
  Users, 
  Stethoscope,
  Settings,
  LogOut,
  Menu,
  X,
  Box,
  Warehouse,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

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
          <NavItem icon={<LayoutDashboard />} label="Dashboard" href="/dashboard" active={pathname === '/dashboard'} sidebarOpen={sidebarOpen} />
          <NavItem icon={<Box />} label="Materials" href="/dashboard/materials" active={pathname === '/dashboard/materials'} sidebarOpen={sidebarOpen} />
          <NavItem icon={<Warehouse />} label="Inventory" href="/dashboard/inventory" active={pathname === '/dashboard/inventory'} sidebarOpen={sidebarOpen} />
          <NavItem icon={<Activity />} label="Batches" href="/dashboard/batches" active={pathname?.startsWith('/dashboard/batches')} sidebarOpen={sidebarOpen} />
          <NavItem icon={<CheckCircle2 />} label="QA/QC" href="/dashboard/qa-qc" active={pathname === '/dashboard/qa-qc'} sidebarOpen={sidebarOpen} />
          <NavItem icon={<ShoppingCart />} label="Purchase" href="/dashboard/purchase" active={pathname === '/dashboard/purchase'} sidebarOpen={sidebarOpen} />
          <NavItem icon={<FileText />} label="Sales" href="/dashboard/sales" active={pathname === '/dashboard/sales'} sidebarOpen={sidebarOpen} />
          <NavItem icon={<Stethoscope />} label="Medical" href="/dashboard/medical" active={pathname === '/dashboard/medical'} sidebarOpen={sidebarOpen} />
          <NavItem icon={<Users />} label="Patients" href="/dashboard/patients" active={pathname === '/dashboard/patients'} sidebarOpen={sidebarOpen} />
          <NavItem icon={<Settings />} label="Settings" href="/dashboard/settings" active={pathname === '/dashboard/settings'} sidebarOpen={sidebarOpen} />
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
        {children}
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

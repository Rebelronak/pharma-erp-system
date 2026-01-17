'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">System Configuration</h2>
          <div className="space-y-4">
            <div>
              <Label>Company Name</Label>
              <Input defaultValue="Pharma ERP" />
            </div>
            <div>
              <Label>System Email</Label>
              <Input type="email" defaultValue="admin@pharmaerp.com" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">Manage user accounts and permissions</p>
          <Button>Manage Users</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Database</h2>
          <p className="text-gray-600 mb-4">Database backup and maintenance</p>
          <div className="flex gap-4">
            <Button variant="outline">Backup Database</Button>
            <Button variant="outline">View Logs</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">System Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span className="font-medium">SQLite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Environment:</span>
              <span className="font-medium">Development</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

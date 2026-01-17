'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function QAQCPage() {
  const router = useRouter()
  const [approvals, setApprovals] = useState([])
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [adminUserId, setAdminUserId] = useState('')
  const [formData, setFormData] = useState({
    batchId: '',
    status: 'APPROVED',
    testResults: '',
    remarks: ''
  })

  const loadData = () => {
    Promise.all([
      fetch('/api/qa-approvals').then(r => r.json()),
      fetch('/api/batches').then(r => r.json())
    ]).then(([approvalsData, batchesData]) => {
      setApprovals(approvalsData)
      
      // Filter out batches that already have QA approvals
      const approvedBatchIds = approvalsData.map((a: any) => a.batchId)
      const availableBatches = batchesData.filter(
        (b: any) => !approvedBatchIds.includes(b.id)
      )
      
      setBatches(availableBatches)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
    // Get admin user ID
    fetch('/api/users/me')
      .then(r => r.ok ? r.json() : { id: 'admin-user-id' })
      .then(user => setAdminUserId(user.id))
      .catch(() => setAdminUserId('admin-user-id'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get the admin user from database first
    try {
      const usersResponse = await fetch('/api/users')
      let inspectorId = adminUserId
      
      if (usersResponse.ok) {
        const users = await usersResponse.json()
        const adminUser = users.find((u: any) => u.role === 'ADMIN')
        if (adminUser) {
          inspectorId = adminUser.id
        }
      }
      
      const response = await fetch('/api/qa-approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          inspectorId,
          inspectionDate: new Date().toISOString()
        })
      })
      
      if (response.ok) {
        alert('QA Approval created successfully!')
        setShowForm(false)
        setFormData({ batchId: '', status: 'APPROVED', testResults: '', remarks: '' })
        loadData()
      } else {
        const error = await response.json()
        alert('Error: ' + (error.error || 'Failed to create approval'))
        console.error('QA Error:', error)
      }
    } catch (error) {
      alert('Error creating approval: ' + error)
      console.error(error)
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
          <h1 className="text-3xl font-bold">QA/QC Approvals</h1>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add QA Approval'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Create QA Approval</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="batchId">Batch</Label>
              {batches.length === 0 ? (
                <div className="p-3 bg-yellow-50 rounded border">
                  <p className="text-sm text-gray-600">
                    No batches available for QA approval. 
                    {approvals.length > 0 ? ' All batches have been reviewed.' : ' Create a batch first.'}
                  </p>
                </div>
              ) : (
                <select
                  id="batchId"
                  className="w-full border rounded p-2"
                  value={formData.batchId}
                  onChange={(e) => setFormData({...formData, batchId: e.target.value})}
                  required
                >
                  <option value="">Select batch...</option>
                  {batches.map((batch: any) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchNumber} - {batch.plannedQuantity} units ({batch.status})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <Label htmlFor="status">Approval Status</Label>
              <select
                id="status"
                className="w-full border rounded p-2"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
            <div>
              <Label htmlFor="testResults">Test Results</Label>
              <Input
                id="testResults"
                value={formData.testResults}
                onChange={(e) => setFormData({...formData, testResults: e.target.value})}
                placeholder="Quality test results..."
              />
            </div>
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <textarea
                id="remarks"
                className="w-full border rounded p-2"
                rows={3}
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                placeholder="Additional notes..."
              />
            </div>
            <Button type="submit" className="w-full">Create QA Approval</Button>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Batch ID</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Inspector</th>
                <th className="text-left p-3">Inspection Date</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">
                    No QA approvals found
                  </td>
                </tr>
              ) : (
                approvals.map((approval: any) => (
                  <tr key={approval.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{approval.batchId}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        approval.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        approval.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {approval.status}
                      </span>
                    </td>
                    <td className="p-3">{approval.inspectorId}</td>
                    <td className="p-3">{new Date(approval.inspectionDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      {approval.status === 'PENDING' && (
                        <Button size="sm">Review</Button>
                      )}
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

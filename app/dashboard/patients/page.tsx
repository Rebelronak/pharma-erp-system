'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ code: '', name: '', age: '', gender: 'MALE', phone: '', address: '' })

  const loadPatients = () => {
    fetch('/api/patients')
      .then(r => r.json())
      .then(data => {
        setPatients(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, age: parseInt(formData.age) })
      })
      if (res.ok) {
        alert('Patient added!')
        setShowForm(false)
        setFormData({ code: '', name: '', age: '', gender: 'MALE', phone: '', address: '' })
        loadPatients()
      } else {
        alert('Failed to add patient')
      }
    } catch (err) {
      console.error(err)
      alert('Error adding patient')
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
          <h1 className="text-3xl font-bold">Patients</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Patient'}
        </button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Patient Code</Label>
                <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
              </div>
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <Label>Age</Label>
                <Input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} required />
              </div>
              <div>
                <Label>Gender</Label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-2 border rounded">
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
            <Button type="submit">Add Patient</Button>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Patient Code</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Age</th>
                <th className="text-left p-3">Gender</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Address</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-500">
                    No patients registered
                  </td>
                </tr>
              ) : (
                patients.map((patient: any) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{patient.code}</td>
                    <td className="p-3">{patient.name}</td>
                    <td className="p-3">{patient.age}</td>
                    <td className="p-3">{patient.gender}</td>
                    <td className="p-3">{patient.phone || '-'}</td>
                    <td className="p-3 text-sm text-gray-600">{patient.address || '-'}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Patients</h3>
          <p className="text-3xl font-bold">{patients.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">New This Month</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Active Cases</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Scheduled Visits</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
      </div>
    </div>
  )
}

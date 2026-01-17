'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function MaterialsPage() {
  const router = useRouter()
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'RAW',
    unit: 'kg',
    reorderLevel: '100'
  })

  useEffect(() => {
    loadMaterials()
  }, [])

  const loadMaterials = () => {
    fetch('/api/materials')
      .then(r => r.json())
      .then(data => {
        setMaterials(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          reorderLevel: Number(formData.reorderLevel)
        })
      })
      if (response.ok) {
        alert('Material created successfully!')
        setShowForm(false)
        setFormData({ code: '', name: '', type: 'RAW', unit: 'kg', reorderLevel: '100' })
        loadMaterials()
      } else {
        const error = await response.json()
        alert('Error: ' + (error.error || 'Failed to create material'))
      }
    } catch (error) {
      alert('Error creating material')
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
          <h1 className="text-3xl font-bold">Materials</h1>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Material'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Create New Material</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="e.g., MAT-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Paracetamol 500mg"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="w-full border rounded p-2"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="RAW">Raw Material</option>
                <option value="PROCESS">Process Material</option>
                <option value="FINISHED">Finished Goods</option>
              </select>
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="e.g., kg, units, liters"
                required
              />
            </div>
            <div>
              <Label htmlFor="reorderLevel">Reorder Level</Label>
              <Input
                id="reorderLevel"
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})}
                required
              />
            </div>
            <Button type="submit" className="w-full">Create Material</Button>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Unit</th>
                <th className="text-left p-3">Reorder Level</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
                    No materials found
                  </td>
                </tr>
              ) : (
                materials.map((material: any) => (
                  <tr key={material.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{material.code}</td>
                    <td className="p-3">{material.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        material.type === 'RAW' ? 'bg-blue-100 text-blue-800' :
                        material.type === 'FINISHED' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {material.type}
                      </span>
                    </td>
                    <td className="p-3">{material.unit}</td>
                    <td className="p-3">{material.reorderLevel}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Active
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

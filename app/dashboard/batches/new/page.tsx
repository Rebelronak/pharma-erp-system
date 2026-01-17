'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NewBatchPage() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(false)
  const [materialsLoading, setMaterialsLoading] = useState(true)
  const [formData, setFormData] = useState({
    productId: '',
    plannedQuantity: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  useEffect(() => {
    setMaterialsLoading(true)
    fetch('/api/materials')
      .then(r => r.json())
      .then(data => {
        console.log('All materials:', data)
        setMaterials(data)
        setMaterialsLoading(false)
      })
      .catch(err => {
        console.error('Error loading materials:', err)
        setMaterialsLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submitted with data:', formData)
    
    if (!formData.productId) {
      alert('Please select a product')
      return
    }
    
    if (!formData.plannedQuantity || Number(formData.plannedQuantity) <= 0) {
      alert('Please enter a valid quantity')
      return
    }
    
    setLoading(true)
    
    try {
      const payload = {
        productId: formData.productId,
        plannedQuantity: Number(formData.plannedQuantity),
        startDate: formData.startDate,
        notes: formData.notes || ''
      }
      
      console.log('Sending payload:', payload)
      
      const response = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      console.log('Response status:', response.status)
      
      const result = await response.json()
      console.log('Response data:', result)
      
      if (response.ok) {
        alert('Batch created successfully!')
        window.location.href = '/dashboard/batches'
      } else {
        alert('Error: ' + (result.error || JSON.stringify(result)))
        console.error('Server error:', result)
        setLoading(false)
      }
    } catch (error) {
      alert('Network error: ' + error)
      console.error('Fetch error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Batch</h1>

      <Card className="p-6 max-w-2xl">
        {materialsLoading ? (
          <div className="text-center py-8">Loading materials...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="productId">Product / Material</Label>
              {materials.length === 0 ? (
                <div className="border rounded p-4 bg-yellow-50">
                  <p className="text-sm text-gray-700 font-medium mb-2">⚠️ No materials found.</p>
                  <p className="text-sm text-gray-600 mb-3">You need to create a material first.</p>
                  <Link href="/dashboard/materials" className="text-blue-600 text-sm font-medium underline">
                    → Go to Materials page to create one
                  </Link>
                </div>
              ) : (
                <select
                  id="productId"
                  className="w-full border rounded p-2 bg-white"
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                  required
                  disabled={loading}
                >
                  <option value="">Select product...</option>
                  {materials.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.code}) - {m.type}
                    </option>
                  ))}
                </select>
              )}
            </div>

          <div>
            <Label htmlFor="plannedQuantity">Planned Quantity</Label>
            <Input
              id="plannedQuantity"
              type="number"
              value={formData.plannedQuantity}
              onChange={(e) => setFormData({...formData, plannedQuantity: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="w-full border rounded p-2"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || materials.length === 0}>
              {loading ? 'Creating...' : 'Create Batch'}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
        )}
      </Card>
    </div>
  )
}

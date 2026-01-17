'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function MedicalPage() {
  const router = useRouter()
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDoctorForm, setShowDoctorForm] = useState(false)
  const [showPatientForm, setShowPatientForm] = useState(false)
  const [doctorForm, setDoctorForm] = useState({ code: '', name: '', specialization: '', phone: '', email: '' })
  const [patientForm, setPatientForm] = useState({ code: '', name: '', age: '', gender: 'MALE', phone: '', address: '' })

  const loadData = () => {
    Promise.all([
      fetch('/api/doctors').then(r => r.json()),
      fetch('/api/patients').then(r => r.json())
    ]).then(([docs, pats]) => {
      setDoctors(docs)
      setPatients(pats)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDoctorSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorForm)
      })
      if (res.ok) {
        alert('Doctor added!')
        setShowDoctorForm(false)
        setDoctorForm({ code: '', name: '', specialization: '', phone: '', email: '' })
        loadData()
      } else {
        alert('Failed to add doctor')
      }
    } catch (err) {
      console.error(err)
      alert('Error adding doctor')
    }
  }

  const handlePatientSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...patientForm, age: parseInt(patientForm.age) })
      })
      if (res.ok) {
        alert('Patient added!')
        setShowPatientForm(false)
        setPatientForm({ code: '', name: '', age: '', gender: 'MALE', phone: '', address: '' })
        loadData()
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
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold">Medical Management</h1>
      </div>

      {/* Doctors Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Doctors</h2>
          <button
            onClick={() => setShowDoctorForm(!showDoctorForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showDoctorForm ? 'Cancel' : '+ Add Doctor'}
          </button>
        </div>
        
        {showDoctorForm && (
          <form onSubmit={handleDoctorSubmit} className="mb-4 p-4 bg-gray-50 rounded space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Code</Label>
                <Input value={doctorForm.code} onChange={e => setDoctorForm({...doctorForm, code: e.target.value})} required />
              </div>
              <div>
                <Label>Name</Label>
                <Input value={doctorForm.name} onChange={e => setDoctorForm({...doctorForm, name: e.target.value})} required />
              </div>
              <div>
                <Label>Specialization</Label>
                <Input value={doctorForm.specialization} onChange={e => setDoctorForm({...doctorForm, specialization: e.target.value})} required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={doctorForm.phone} onChange={e => setDoctorForm({...doctorForm, phone: e.target.value})} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={doctorForm.email} onChange={e => setDoctorForm({...doctorForm, email: e.target.value})} />
              </div>
            </div>
            <Button type="submit">Add Doctor</Button>
          </form>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Specialization</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">
                    No doctors registered
                  </td>
                </tr>
              ) : (
                doctors.map((doctor: any) => (
                  <tr key={doctor.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{doctor.code}</td>
                    <td className="p-3">{doctor.name}</td>
                    <td className="p-3">{doctor.specialization}</td>
                    <td className="p-3">{doctor.phone || '-'}</td>
                    <td className="p-3">{doctor.email || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Patients Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Patients</h2>
          <button
            onClick={() => setShowPatientForm(!showPatientForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showPatientForm ? 'Cancel' : '+ Add Patient'}
          </button>
        </div>
        
        {showPatientForm && (
          <form onSubmit={handlePatientSubmit} className="mb-4 p-4 bg-gray-50 rounded space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Code</Label>
                <Input value={patientForm.code} onChange={e => setPatientForm({...patientForm, code: e.target.value})} required />
              </div>
              <div>
                <Label>Name</Label>
                <Input value={patientForm.name} onChange={e => setPatientForm({...patientForm, name: e.target.value})} required />
              </div>
              <div>
                <Label>Age</Label>
                <Input type="number" value={patientForm.age} onChange={e => setPatientForm({...patientForm, age: e.target.value})} required />
              </div>
              <div>
                <Label>Gender</Label>
                <select value={patientForm.gender} onChange={e => setPatientForm({...patientForm, gender: e.target.value})} className="w-full p-2 border rounded">
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={patientForm.phone} onChange={e => setPatientForm({...patientForm, phone: e.target.value})} />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={patientForm.address} onChange={e => setPatientForm({...patientForm, address: e.target.value})} />
              </div>
            </div>
            <Button type="submit">Add Patient</Button>
          </form>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Age</th>
                <th className="text-left p-3">Gender</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
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
                    <td className="p-3">
                      <Button size="sm" variant="outline">View</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Doctors</h3>
          <p className="text-3xl font-bold">{doctors.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Patients</h3>
          <p className="text-3xl font-bold">{patients.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Active Cases</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
      </div>
    </div>
  )
}

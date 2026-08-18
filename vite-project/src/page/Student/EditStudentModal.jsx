import { useState } from "react"
import Btn from "../../components/ui/Btn"
import Input from "../../components/ui/Input"
import Modal from "../../components/ui/Modal"
import Select from "../../components/ui/Select"
import editStudentSchema from "../../schemas/editStudent.schema.js"

const BRANCHES = [
  { id: 'b1', name: 'Downtown Campus', city: 'New York', studentCount: 142, activeCount: 128, manager: 'Sarah Chen', status: 'active' },
  { id: 'b2', name: 'Westside Center', city: 'Los Angeles', studentCount: 98, activeCount: 84, manager: 'Marcus Rivera', status: 'active' },
  { id: 'b3', name: 'Northgate Branch', city: 'Chicago', studentCount: 67, activeCount: 61, manager: 'Priya Patel', status: 'active' },
  { id: 'b4', name: 'Eastpark Hub', city: 'Houston', studentCount: 54, activeCount: 39, manager: 'James O\'Brien', status: 'active' },
  { id: 'b5', name: 'Southside Studio', city: 'Phoenix', studentCount: 33, activeCount: 20, manager: 'Aisha Williams', status: 'inactive' },
  { id: 'b6', name: 'Harbor View', city: 'Seattle', studentCount: 78, activeCount: 71, manager: 'Tom Nakamura', status: 'active' },
]

export default function EditStudentModal({ student, onClose, onSave, apiLoading }) {
  const [form, setForm] = useState({ ...student })
  const [errors, setErrors] = useState({})

  const set = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSave = () => {
    const result = editStudentSchema.safeParse({
      ...form,
      age: Number(form.age),
    })

    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0]
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    const branch = BRANCHES.find(b => b.id === result.data.branchId)

    setErrors({})
    onSave({
      ...student,
      name: result.data.name,
      email: result.data.email,
      age: result.data.age,
      course: result.data.course || 'General',
      status: result.data.status,
      paymentStatus: result.data.paymentStatus,
      branchId: result.data.branchId,
      branch: branch?.name || student.branch,
      avatar: result.data.name
        .split(' ')
        .map(w => w[0])
        .join('').slice(0, 2)
        .toUpperCase(),
    })
  }

  return (
    <Modal title="Edit Student" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Full Name *</label>
            <Input value={form.name} onChange={set('name')} className="w-full" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Age *</label>
            <Input value={String(form.age)} type="number" onChange={set('age')} className="w-full" />
            {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Email *</label>
          <Input value={form.email} onChange={set('email')} className="w-full" />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Course</label>
          <Input
            placeholder="Full-Stack Development"
            value={form.course || ''}
            onChange={set('course')}
            className="w-full"
          />
          {errors.course && <p className="text-xs text-red-400 mt-1">{errors.course}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Status *</label>
          <Select
            value={form.status}
            onChange={set('status')}
            options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]}
            className="w-full"
          />
          {errors.status && <p className="text-xs text-red-400 mt-1">{errors.status}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Payment Status *</label>
          <Select
            value={form.paymentStatus}
            onChange={set('paymentStatus')}
            options={[{ label: 'Paid', value: 'paid' }, { label: 'Pending', value: 'pending' }, { label: 'Overdue', value: 'overdue' }]}
            className="w-full"
          />
          {errors.paymentStatus && <p className="text-xs text-red-400 mt-1">{errors.paymentStatus}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Branch *</label>
          <Select
            value={form.branchId}
            onChange={set('branchId')}
            options={BRANCHES.map(b => ({ label: b.name, value: b.id }))}
            className="w-full"
          />
          {errors.branchId && <p className="text-xs text-red-400 mt-1">{errors.branchId}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn disabled={apiLoading} loading={apiLoading} variant="primary" onClick={handleSave}>Save Changes</Btn>
        </div>
      </div>
    </Modal>
  )
}

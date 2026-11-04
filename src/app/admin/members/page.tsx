'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, Plus, Edit, Trash2, LogOut, Dumbbell, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { format, differenceInDays } from 'date-fns'

export default function MembersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [members, setMembers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    phone: '',
    address: '',
    planType: '1 Month',
    feePaid: 0,
    image: null as File | null
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMembers()
    }
  }, [status])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Failed to fetch members:', error)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('code', formData.code)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('planType', formData.planType)
      formDataToSend.append('feePaid', formData.feePaid.toString())
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      const response = await fetch('/api/admin/members', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        setShowAddModal(false)
        setFormData({
          name: '',
          code: '',
          phone: '',
          address: '',
          planType: '1 Month',
          feePaid: 0,
          image: null
        })
        fetchMembers()
      }
    } catch (error) {
      console.error('Failed to add member:', error)
    }
  }

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('code', formData.code)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('planType', formData.planType)
      formDataToSend.append('feePaid', formData.feePaid.toString())
      formDataToSend.append('keepExistingImage', (!formData.image).toString())
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      const response = await fetch(`/api/admin/members/${editingMember._id}`, {
        method: 'PUT',
        body: formDataToSend
      })

      if (response.ok) {
        setEditingMember(null)
        setFormData({
          name: '',
          code: '',
          phone: '',
          address: '',
          planType: '1 Month',
          feePaid: 0,
          image: null
        })
        fetchMembers()
      }
    } catch (error) {
      console.error('Failed to update member:', error)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Failed to delete member:', error)
    }
  }

  const handleExtendMembership = async (member: any) => {
    const newExpiryDate = new Date(member.expiryDate)
    newExpiryDate.setMonth(newExpiryDate.getMonth() + 1)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', member.name)
      formDataToSend.append('code', member.code)
      formDataToSend.append('phone', member.phone)
      formDataToSend.append('address', member.address)
      formDataToSend.append('planType', member.planType)
      formDataToSend.append('feePaid', member.feePaid.toString())
      formDataToSend.append('expiryDate', newExpiryDate.toISOString())
      formDataToSend.append('keepExistingImage', 'true')

      const response = await fetch(`/api/admin/members/${member._id}`, {
        method: 'PUT',
        body: formDataToSend
      })

      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Failed to extend membership:', error)
    }
  }

  const getMembershipStatus = (expiryDate: any) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const daysLeft = differenceInDays(expiry, now)

    if (daysLeft < 0) {
      return { label: 'Expired', color: 'bg-red-500/10 text-red-500' }
    } else if (daysLeft <= 7) {
      return { label: `Expiring Soon (${daysLeft} days)`, color: 'bg-yellow-500/10 text-yellow-500' }
    } else {
      return { label: `${daysLeft} Days Left`, color: 'bg-green-500/10 text-green-500' }
    }
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="bg-[#171717] border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-[#f59e0b]" />
              <span className="text-2xl font-bold">THE LIONS</span>
              <span className="text-gray-500 ml-2">| Members</span>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#171717] border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors pb-2"
            >
              Home
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-gray-400 hover:text-white transition-colors pb-2"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/attendance"
              className="text-gray-400 hover:text-white transition-colors pb-2"
            >
              Attendance
            </Link>
            <Link
              href="/admin/members"
              className="text-[#f59e0b] font-semibold border-b-2 border-[#f59e0b] pb-2"
            >
              Members
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Member Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-[#f59e0b] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#d97706] transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Member</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#171717] p-4 rounded-xl border border-[#333] mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or code..."
              className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b] transition-colors"
            />
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-[#171717] rounded-xl border border-[#333] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f0f0f]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No members found
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const status = getMembershipStatus(member.expiryDate)
                    return (
                      <tr key={member._id} className="hover:bg-[#0f0f0f]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.name}
                                className="h-10 w-10 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-[#333] flex items-center justify-center mr-3">
                                <span className="text-gray-400 text-sm font-medium">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.address}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {member.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {member.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {member.planType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleExtendMembership(member)}
                              className="text-[#f59e0b] hover:text-[#d97706] transition-colors"
                              title="Extend Membership"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingMember(member)
                                setFormData({
                                  name: member.name,
                                  code: member.code,
                                  phone: member.phone,
                                  address: member.address,
                                  planType: member.planType,
                                  feePaid: member.feePaid,
                                  image: null
                                })
                              }}
                              className="text-gray-400 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member._id)}
                              className="text-red-500 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#171717] rounded-xl border border-[#333] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Code (e.g., TL-101)</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Plan Type</label>
                <select
                  value={formData.planType}
                  onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                >
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fee Paid</label>
                <input
                  type="number"
                  value={formData.feePaid}
                  onChange={(e) => setFormData({ ...formData, feePaid: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-[#333] text-white py-2 rounded-lg hover:bg-[#444] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#f59e0b] text-black py-2 rounded-lg hover:bg-[#d97706] transition-colors"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#171717] rounded-xl border border-[#333] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Member</h2>
            <form onSubmit={handleEditMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Plan Type</label>
                <select
                  value={formData.planType}
                  onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                >
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                />
                {editingMember.image && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current: {editingMember.image}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fee Paid</label>
                <input
                  type="number"
                  value={formData.feePaid}
                  onChange={(e) => setFormData({ ...formData, feePaid: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="flex-1 bg-[#333] text-white py-2 rounded-lg hover:bg-[#444] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#f59e0b] text-black py-2 rounded-lg hover:bg-[#d97706] transition-colors"
                >
                  Update Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

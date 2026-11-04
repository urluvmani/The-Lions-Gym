'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, CheckCircle, Clock, LogOut, Dumbbell, X } from 'lucide-react'
import Link from 'next/link'

export default function AttendancePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchCode, setSearchCode] = useState('')
  const [attendance, setAttendance] = useState<any[]>([])
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [latestAttendance, setLatestAttendance] = useState<any | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTodayAttendance()
    }
  }, [status])

  const fetchTodayAttendance = async () => {
    try {
      const response = await fetch('/api/admin/attendance/today')
      if (response.ok) {
        const data = await response.json()
        setAttendance(data)
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    }
  }

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchCode.trim()) return

    try {
      const response = await fetch('/api/admin/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: searchCode.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        let message = `${data.member.name} marked present!`
        if (data.membershipWarning) {
          message += ` (${data.membershipWarning})`
        }
        setNotification({ type: 'success', message })
        setSearchCode('')
        fetchTodayAttendance()

        // Fetch member details for popup
        const membersResponse = await fetch('/api/admin/members')
        if (membersResponse.ok) {
          const members = await membersResponse.json()
          const member = members.find((m: any) => m.code === data.member.code)
          if (member) {
            setLatestAttendance({
              ...member,
              checkInTime: new Date().toLocaleTimeString()
            })
          }
        }
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to mark attendance' })
      }

      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

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
              <span className="text-gray-500 ml-2">| Attendance</span>
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
              href="/admin/dashboard"
              className="text-gray-400 hover:text-white transition-colors pb-2"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/attendance"
              className="text-[#f59e0b] font-semibold border-b-2 border-[#f59e0b] pb-2"
            >
              Attendance
            </Link>
            <Link
              href="/admin/members"
              className="text-gray-400 hover:text-white transition-colors pb-2"
            >
              Members
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-500/10 border border-green-500 text-green-500'
                : 'bg-red-500/10 border border-red-500 text-red-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Latest Attendance Popup */}
        {latestAttendance && (
          <div className="fixed left-0 top-0 h-full w-1/3 bg-[#171717] border-r border-[#333] p-6 overflow-y-auto z-50 animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setLatestAttendance(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-[#f59e0b]">Latest Check-in</h2>
              <div className="space-y-6">
                {latestAttendance.image ? (
                  <img
                    src={latestAttendance.image}
                    alt={latestAttendance.name}
                    className="w-full h-64 object-cover rounded-xl border-2 border-[#f59e0b]"
                  />
                ) : (
                  <div className="w-full h-64 bg-[#0f0f0f] rounded-xl border-2 border-[#f59e0b] flex items-center justify-center">
                    <span className="text-6xl font-bold text-[#f59e0b]">
                      {latestAttendance.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="bg-[#0f0f0f] p-6 rounded-xl border border-[#333]">
                  <h3 className="text-3xl font-bold text-white mb-2">{latestAttendance.name}</h3>
                  <p className="text-xl text-[#f59e0b] font-semibold mb-4">{latestAttendance.code}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white">{latestAttendance.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plan:</span>
                      <span className="text-white">{latestAttendance.planType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Check-in:</span>
                      <span className="text-green-500 font-bold">{latestAttendance.checkInTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expiry:</span>
                      <span className="text-white">{new Date(latestAttendance.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500 p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <span className="text-xl font-bold text-green-500">Attendance Marked Successfully!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Scan/Search */}
        <div className="bg-[#171717] p-6 rounded-xl border border-[#333] mb-8">
          <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
          <form onSubmit={handleMarkAttendance} className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter member code (e.g., TL-101)"
                className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#f59e0b] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-[#f59e0b] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#d97706] transition-colors"
            >
              Mark Present
            </button>
          </form>
        </div>

        {/* Today's Attendance */}
        <div className="bg-[#171717] rounded-xl border border-[#333] overflow-hidden">
          <div className="p-6 border-b border-[#333]">
            <h2 className="text-xl font-bold">Today's Attendance</h2>
            <p className="text-gray-400 text-sm mt-1">{attendance.length} members checked in today</p>
          </div>
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
                    Check-in Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Membership Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Attendance Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No attendance recorded today
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr key={record.id} className="hover:bg-[#0f0f0f]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {record.memberImage ? (
                            <img
                              src={record.memberImage}
                              alt={record.memberName}
                              className="h-10 w-10 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[#333] flex items-center justify-center mr-3">
                              <span className="text-gray-400 text-sm font-medium">
                                {record.memberName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium">{record.memberName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {record.memberCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(record.checkIn).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.statusColor}`}>
                          {record.membershipStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                          Present
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

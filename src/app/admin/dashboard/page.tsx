'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Dumbbell, Users, Calendar, DollarSign, LogOut, UserPlus, Clock, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalMembers: 0,
    todayAttendance: 0,
    expiringMembers: 0,
    monthlyRevenue: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
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
              <span className="text-gray-500 ml-2">| Admin Dashboard</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
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
              className="text-[#f59e0b] font-semibold border-b-2 border-[#f59e0b] pb-2"
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
              className="text-gray-400 hover:text-white transition-colors pb-2"
            >
              Members
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <button
            onClick={fetchStats}
            className="flex items-center space-x-2 bg-[#333] text-white px-4 py-2 rounded-lg hover:bg-[#444] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#171717] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-[#f59e0b]" />
              <span className="text-gray-500 text-sm">Total Members</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalMembers}</div>
          </div>

          <div className="bg-[#171717] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-[#f59e0b]" />
              <span className="text-gray-500 text-sm">Today's Attendance</span>
            </div>
            <div className="text-3xl font-bold">{stats.todayAttendance}</div>
          </div>

          <div className="bg-[#171717] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-[#f59e0b]" />
              <span className="text-gray-500 text-sm">Expiring (7 Days)</span>
            </div>
            <div className="text-3xl font-bold">{stats.expiringMembers}</div>
          </div>

          <div className="bg-[#171717] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">Monthly Revenue</span>
            </div>
            <div className="text-3xl font-bold">{stats.monthlyRevenue.toLocaleString()}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/attendance"
            className="bg-[#171717] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-[#f59e0b]/10 p-3 rounded-lg group-hover:bg-[#f59e0b]/20 transition-colors">
                <Clock className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Mark Attendance</h3>
                <p className="text-gray-400 text-sm">Quick-scan or search members</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/members"
            className="bg-[#171717] p-6 rounded-xl border border-[#333] hover:border-[#f59e0b] transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-[#f59e0b]/10 p-3 rounded-lg group-hover:bg-[#f59e0b]/20 transition-colors">
                <UserPlus className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Manage Members</h3>
                <p className="text-gray-400 text-sm">Add, edit, or remove members</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}

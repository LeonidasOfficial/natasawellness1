'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaDollarSign, FaArrowLeft, FaCalendarAlt, FaChartBar, FaDownload, FaFilter } from 'react-icons/fa'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'
import servicesData from '@/data/services.json'

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
  status: string
  message?: string
}

interface RevenueByService {
  service: string
  count: number
  revenue: number
}

export default function ReportsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  const [filterStatus, setFilterStatus] = useState('all')

  // Stats
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [revenueByService, setRevenueByService] = useState<RevenueByService[]>([])

  useEffect(() => {
    checkAuth()
    fetchBookings()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [bookings, dateRange, filterStatus])

  useEffect(() => {
    calculateStats()
  }, [filteredBookings])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/verify')
      const data = await res.json()
      if (!data.authenticated) {
        router.push('/admin/login')
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch bookings')
      toast.error('Failed to load bookings')
    }
  }

  const applyFilters = () => {
    let filtered = [...bookings]

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus)
    }

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(b => b.date >= dateRange.start)
    }
    if (dateRange.end) {
      filtered = filtered.filter(b => b.date <= dateRange.end)
    }

    setFilteredBookings(filtered)
  }

  const calculateStats = () => {
    // Calculate total bookings
    setTotalBookings(filteredBookings.length)

    // Calculate revenue
    let revenue = 0
    const serviceRevenue: Record<string, RevenueByService> = {}

    filteredBookings.forEach(booking => {
      const service = servicesData.find(s => s.name === booking.service)
      const price = service?.price || 0

      revenue += price

      if (!serviceRevenue[booking.service]) {
        serviceRevenue[booking.service] = {
          service: booking.service,
          count: 0,
          revenue: 0
        }
      }

      serviceRevenue[booking.service].count++
      serviceRevenue[booking.service].revenue += price
    })

    setTotalRevenue(revenue)
    setRevenueByService(Object.values(serviceRevenue).sort((a, b) => b.revenue - a.revenue))
  }

  const exportToCSV = () => {
    // Prepare CSV content
    const headers = ['Date', 'Time', 'Customer', 'Email', 'Phone', 'Service', 'Price', 'Status']
    const rows = filteredBookings.map(booking => {
      const service = servicesData.find(s => s.name === booking.service)
      return [
        booking.date,
        booking.time,
        booking.name,
        booking.email,
        booking.phone,
        booking.service,
        service?.price || 0,
        booking.status
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `revenue-report-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Report exported successfully!')
  }

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-dark text-white shadow-lg">
        <div className="container-custom py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-dark p-3 rounded-full"
              >
                <FaArrowLeft className="text-xl" />
              </motion.button>
            </Link>
            <div className="flex items-center gap-3">
              <FaDollarSign className="text-4xl text-primary" />
              <h1 className="font-playfair text-3xl font-bold">Revenue Reports</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <FaFilter className="text-primary" />
            Filter Reports
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="bg-primary text-dark px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-dark hover:text-primary transition-colors"
            >
              <FaDownload /> Export to CSV
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm uppercase font-semibold mb-2">Total Revenue</p>
                <h2 className="text-5xl font-bold">${totalRevenue.toLocaleString()}</h2>
                <p className="text-white/80 text-sm mt-2">From {totalBookings} bookings</p>
              </div>
              <FaDollarSign className="text-7xl text-white/20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm uppercase font-semibold mb-2">Total Bookings</p>
                <h2 className="text-5xl font-bold">{totalBookings}</h2>
                <p className="text-white/80 text-sm mt-2">In selected period</p>
              </div>
              <FaCalendarAlt className="text-7xl text-white/20" />
            </div>
          </motion.div>
        </div>

        {/* Revenue by Service */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
            <FaChartBar className="text-primary" />
            Revenue by Service
          </h3>

          <div className="space-y-4">
            {revenueByService.map((item, index) => {
              const percentage = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0
              return (
                <motion.div
                  key={item.service}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-semibold text-dark">{item.service}</h4>
                      <p className="text-sm text-gray-600">{item.count} bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">${item.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 * index }}
                      className="bg-primary h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              )
            })}

            {revenueByService.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No data available for the selected filters</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Detailed Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mt-8"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-dark">Detailed Breakdown</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking, index) => {
                  const service = servicesData.find(s => s.name === booking.service)
                  return (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.service}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">${service?.price || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No bookings found for the selected filters</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}


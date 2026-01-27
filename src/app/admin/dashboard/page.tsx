'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaCalendarAlt, FaUsers, FaDollarSign, FaStar, FaSignOutAlt, FaCut, FaChartLine, FaListAlt, FaArrowRight, FaGlobe, FaImage, FaPercent } from 'react-icons/fa'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import RevenueChart from '@/components/admin/RevenueChart'
// import BookingStatsChart from '@/components/admin/BookingStatsChart' // Removed - booking management deleted
import ServicePopularityChart from '@/components/admin/ServicePopularityChart'

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    checkAuth()
  }, [])

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Logged out successfully')
      router.push('/admin/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  // Sample analytics data (booking management removed)
  const revenueData = [
    { date: '2025-10-14', revenue: 4500 },
    { date: '2025-10-15', revenue: 5200 },
    { date: '2025-10-16', revenue: 3800 },
    { date: '2025-10-17', revenue: 6100 },
    { date: '2025-10-18', revenue: 5500 },
  ]

  const servicePopularityData = [
    { service: 'Tretman Lica', bookings: 35 },
    { service: 'Manikir', bookings: 42 },
    { service: 'Pedikir', bookings: 38 },
    { service: 'Podizanje Trepavica', bookings: 28 },
    { service: 'Epilacija', bookings: 22 },
  ]

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-dark text-white shadow-lg">
        <div className="container-custom py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCut className="text-4xl text-primary" />
            <h1 className="font-playfair text-3xl font-bold">Salone Admin</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-primary text-dark px-6 py-3 rounded-full font-semibold hover:bg-white transition-colors">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="container-custom py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: FaUsers, label: 'Total Clients', value: '999+', color: 'bg-blue-500' },
            { icon: FaDollarSign, label: 'Monthly Revenue', value: '$15,000', color: 'bg-green-500' },
            { icon: FaStar, label: 'Avg Rating', value: '5.0', color: 'bg-primary' }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-dark mt-2">{stat.value}</h3>
                </div>
                <div className={`${stat.color} w-14 h-14 rounded-full flex items-center justify-center`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/admin/pricelist">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-6 shadow-lg cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-dark rounded-lg flex items-center justify-center mb-4">
                    <FaListAlt className="text-primary text-xl" />
                  </div>
                  <h3 className="font-bold text-xl text-dark mb-2">Upravljanje Celovnikom</h3>
                  <p className="text-dark/80 text-sm">Uredite kategorije, tretmane i cene</p>
                </div>
                <FaArrowRight className="text-dark text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/images">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-xl p-6 shadow-lg cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <FaImage className="text-white text-xl" />
                  </div>
                  <h3 className="font-bold text-xl text-white mb-2">Image Management</h3>
                  <p className="text-white/80 text-sm">Upload and replace website images</p>
                </div>
                <FaArrowRight className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/promotions">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-6 shadow-lg cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <FaPercent className="text-white text-xl" />
                  </div>
                  <h3 className="font-bold text-xl text-white mb-2">Promotions</h3>
                  <p className="text-white/80 text-sm">Edit promotional section & featured services</p>
                </div>
                <FaArrowRight className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/translations">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 shadow-lg cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <FaGlobe className="text-white text-xl" />
                  </div>
                  <h3 className="font-bold text-xl text-white mb-2">Translations</h3>
                  <p className="text-white/80 text-sm">Manage multilingual content</p>
                </div>
                <FaArrowRight className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </Link>

          {/* Calendar removed - booking management deleted */}

          <Link href="/admin/reports">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 shadow-lg cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <FaDollarSign className="text-white text-xl" />
                  </div>
                  <h3 className="font-bold text-xl text-white mb-2">Revenue Reports</h3>
                  <p className="text-white/90 text-sm">View financial reports</p>
                </div>
                <FaArrowRight className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-playfair text-3xl font-bold text-dark mb-8 flex items-center gap-3"
          >
            <FaChartLine className="text-primary" />
            Business Analytics
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RevenueChart data={revenueData} />
          </div>
          <div className="grid grid-cols-1">
            <ServicePopularityChart data={servicePopularityData} />
          </div>
        </div>

      </main>
    </div>
  )
}


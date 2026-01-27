'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaCut, FaEnvelope, FaLock } from 'react-icons/fa'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Login successful!')
        router.push('/admin/dashboard')
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-white to-primary/10 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <motion.div animate={{ rotate: [0, 10, 0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="inline-block">
            <FaCut className="text-6xl text-primary mx-auto mb-4" />
          </motion.div>
          <h1 className="font-playfair text-4xl font-bold text-dark mb-2">Admin Login</h1>
          <p className="text-gray-600">Access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-dark font-semibold mb-2 flex items-center gap-2">
              <FaEnvelope className="text-primary" /> Email Address
            </label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none" placeholder="admin@salone.com" />
          </div>

          <div>
            <label className="block text-dark font-semibold mb-2 flex items-center gap-2">
              <FaLock className="text-primary" /> Password
            </label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none" placeholder="••••••••" />
          </div>

          <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-primary text-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-dark hover:text-primary transition-all disabled:opacity-50">
            {isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Default: admin@salone.com / password
        </p>
      </motion.div>
    </div>
  )
}


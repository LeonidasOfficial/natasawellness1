'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

interface RevenueData {
  date: string
  revenue: number
}

interface RevenueChartProps {
  data: RevenueData[]
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-2xl font-playfair font-bold text-dark mb-6">Revenue Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#666"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Revenue']}
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '2px solid #D4A574',
              borderRadius: '8px',
              color: '#D4A574'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#D4A574" 
            strokeWidth={3}
            dot={{ fill: '#D4A574', r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default RevenueChart


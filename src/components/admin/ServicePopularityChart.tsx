'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

interface ServiceData {
  service: string
  bookings: number
}

interface ServicePopularityChartProps {
  data: ServiceData[]
}

const ServicePopularityChart = ({ data }: ServicePopularityChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-2xl font-playfair font-bold text-dark mb-6">Popular Services</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="service" 
            stroke="#666"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            formatter={(value) => [`${value} bookings`, 'Total']}
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '2px solid #D4A574',
              borderRadius: '8px',
              color: '#D4A574'
            }}
          />
          <Legend />
          <Bar 
            dataKey="bookings" 
            fill="#D4A574"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default ServicePopularityChart


'use client'

import { motion } from 'framer-motion'
import { useTranslation } from '@/contexts/TranslationContext'
import { FaClock } from 'react-icons/fa'

interface WorkingHoursCardProps {
  className?: string
}

const WorkingHoursCard: React.FC<WorkingHoursCardProps> = ({ className = '' }) => {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-primary rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-dark text-primary rounded-full p-3 shadow-glow">
          <FaClock className="text-2xl" />
        </div>
        <h3 className="text-2xl font-bold text-dark">
          {t('workingHours.title')}
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg hover:bg-white/40 transition-all">
          <span className="font-semibold text-dark">
            {t('workingHours.weekdays')}
          </span>
          <span className="text-dark/80">
            {t('workingHours.weekdaysTime')}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg hover:bg-white/40 transition-all">
          <span className="font-semibold text-dark">
            {t('workingHours.saturday')}
          </span>
          <span className="text-dark/80">
            {t('workingHours.saturdayTime')}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default WorkingHoursCard

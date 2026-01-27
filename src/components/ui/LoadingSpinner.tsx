import { motion } from 'framer-motion'
import { FaCut } from 'react-icons/fa'

const LoadingSpinner = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-white flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8'

  return (
    <div className={containerClass}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="relative"
      >
        <FaCut className="text-6xl text-primary" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
        />
      </motion.div>
    </div>
  )
}

export default LoadingSpinner


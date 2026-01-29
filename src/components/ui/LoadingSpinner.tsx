import { motion } from 'framer-motion'
import Image from 'next/image'

const LoadingSpinner = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-white flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8'

  return (
    <div className={containerClass}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="relative w-16 h-16"
      >
        <Image
          src="/img/admin-ajax.png"
          alt="Loading"
          width={64}
          height={64}
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  )
}

export default LoadingSpinner


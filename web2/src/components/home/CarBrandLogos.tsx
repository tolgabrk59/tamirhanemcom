'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const carBrands = [
  'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota', 'Honda', 'Ford',
  'Renault', 'Peugeot', 'Fiat', 'Hyundai', 'Kia', 'Nissan', 'Mazda',
  'Volvo', 'Skoda', 'Seat', 'Opel', 'Citroen', 'Dacia', 'Suzuki', 'Mitsubishi',
  'Alfa Romeo', 'Aston Martin', 'Bentley', 'BYD', 'Chery', 'Chevrolet',
  'Chrysler', 'Cupra', 'DS', 'Ferrari', 'Geely', 'Jaecoo', 'Jaguar', 'Jeep',
  'Lada', 'Lamborghini', 'Land Rover', 'Lexus', 'Maserati', 'MG', 'Mini',
  'Porsche', 'Range Rover', 'Seres', 'Skywell', 'Ssangyong', 'Subaru',
  'Tesla', 'Togg',
]

interface LogoItem {
  id: number
  brand: string
  x: number
  y: number
}

export default function CarBrandLogos() {
  const [activeLogos, setActiveLogos] = useState<LogoItem[]>([])
  const logoIdRef = useRef(0)

  useEffect(() => {
    const spawnLogo = () => {
      const brand = carBrands[Math.floor(Math.random() * carBrands.length)]
      const logo: LogoItem = {
        id: logoIdRef.current++,
        brand,
        x: Math.random() * 60 + 20,
        y: Math.random() * 60 + 20,
      }
      setActiveLogos((prev) => [...prev.slice(-3), logo])
    }
    spawnLogo()
    const interval = setInterval(spawnLogo, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
      <AnimatePresence>
        {activeLogos.map((logo) => (
          <motion.div
            key={logo.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${logo.x}%`,
              top: `${logo.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.3, filter: 'blur(10px)' }}
            animate={{
              opacity: [0, 0.05, 0.05, 0],
              scale: [0.3, 1, 1, 0.7],
              filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(5px)'],
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 5,
              times: [0, 0.15, 0.85, 1],
              ease: 'easeInOut',
            }}
            onAnimationComplete={() => {
              setActiveLogos((prev) => prev.filter((l) => l.id !== logo.id))
            }}
          >
            <span
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-widest uppercase select-none"
              style={{
                color: 'var(--brand-500, #FBC91D)',
                textShadow: '0 0 30px rgba(251,201,29,0.1), 0 0 60px rgba(251,201,29,0.05)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '0.15em',
              }}
            >
              {logo.brand}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

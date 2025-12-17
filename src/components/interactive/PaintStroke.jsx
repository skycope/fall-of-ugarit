import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

export default function PaintStroke({ className = '', delay = 0, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* The paint stroke background */}
      <motion.div
        className="absolute inset-0 -inset-x-8"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{
          duration: 1.2,
          delay,
          ease: [0.22, 1, 0.36, 1]
        }}
        style={{ originX: 0 }}
      >
        <svg
          viewBox="0 0 400 80"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffb102" stopOpacity="0.8" />
              <stop offset="15%" stopColor="#ffc942" />
              <stop offset="50%" stopColor="#ffb102" />
              <stop offset="85%" stopColor="#e6a000" />
              <stop offset="100%" stopColor="#ffb102" stopOpacity="0.8" />
            </linearGradient>
            <filter id="roughPaper">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
              <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2">
                <feDistantLight azimuth="45" elevation="60" />
              </feDiffuseLighting>
            </filter>
          </defs>
          <path
            d="M0,40 Q20,20 50,35 T100,40 T150,45 T200,38 T250,42 T300,35 T350,40 Q380,50 400,40 L400,80 L0,80 Z"
            fill="url(#goldGradient)"
          />
          <path
            d="M0,40 Q30,55 60,42 T120,48 T180,40 T240,45 T300,38 T360,42 Q390,35 400,40 L400,0 L0,0 Z"
            fill="url(#goldGradient)"
            opacity="0.7"
          />
        </svg>
      </motion.div>

      {/* Content on top */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

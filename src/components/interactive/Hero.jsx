import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Hero({ imageSrc, imageAlt }) {
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20
  });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="relative"
      >
        {/* Book shadow */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-ink/20 blur-2xl rounded-full"
          style={{ transform: 'translateZ(-50px) translateX(-50%)' }}
        />

        {/* Book cover */}
        <motion.img
          src={imageSrc}
          alt={imageAlt}
          className="w-full max-w-[320px] md:max-w-[400px] h-auto drop-shadow-2xl"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(30px)',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        />

        {/* Subtle glow effect */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ transform: 'translateZ(35px)' }}
        />
      </motion.div>
    </div>
  );
}

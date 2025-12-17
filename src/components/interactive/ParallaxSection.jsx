import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxSection({
  children,
  className = '',
  speed = 0.5,
  bgImage = null,
  overlay = true
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`}>
      {bgImage && (
        <motion.div
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
          style={{ y }}
        >
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-deep-blue/80 via-mid-blue/60 to-deep-blue/80" />
          )}
        </motion.div>
      )}

      <motion.div className="relative z-10" style={{ opacity }}>
        {children}
      </motion.div>
    </section>
  );
}

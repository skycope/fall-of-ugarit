import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

export default function FloatingElement({
  children,
  className = '',
  speed = 0.5,
  direction = 'up', // up, down, left, right
  rotate = false,
  delay = 0,
  floatAnimation = true
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const yUp = useTransform(scrollYProgress, [0, 1], [200 * speed, -200 * speed]);
  const yDown = useTransform(scrollYProgress, [0, 1], [-200 * speed, 200 * speed]);
  const xLeft = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const xRight = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
  const rotation = useTransform(scrollYProgress, [0, 1], [-10 * speed, 10 * speed]);

  const motionValues = {
    up: { y: yUp },
    down: { y: yDown },
    left: { x: xLeft },
    right: { x: xRight }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...motionValues[direction],
        ...(rotate ? { rotate: rotation } : {})
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {floatAnimation ? (
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
}

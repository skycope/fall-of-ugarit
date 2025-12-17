import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

export default function RevealImage({
  src,
  alt,
  className = '',
  direction = 'up', // up, down, left, right
  delay = 0,
  parallax = false,
  parallaxSpeed = 0.2
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * parallaxSpeed, -100 * parallaxSpeed]);

  const clipPaths = {
    up: {
      hidden: 'inset(100% 0 0 0)',
      visible: 'inset(0 0 0 0)'
    },
    down: {
      hidden: 'inset(0 0 100% 0)',
      visible: 'inset(0 0 0 0)'
    },
    left: {
      hidden: 'inset(0 100% 0 0)',
      visible: 'inset(0 0 0 0)'
    },
    right: {
      hidden: 'inset(0 0 0 100%)',
      visible: 'inset(0 0 0 0)'
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={parallax ? { y } : {}}
    >
      <motion.div
        initial={{ clipPath: clipPaths[direction].hidden, scale: 1.2 }}
        animate={isInView ? {
          clipPath: clipPaths[direction].visible,
          scale: 1
        } : {}}
        transition={{
          clipPath: { duration: 1.2, delay, ease: [0.77, 0, 0.175, 1] },
          scale: { duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

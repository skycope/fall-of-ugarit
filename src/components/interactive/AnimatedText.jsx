import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedText({
  children,
  className = '',
  element = 'p',
  delay = 0,
  stagger = 0.03,
  color = 'gold' // gold, light, white
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  const colors = {
    gold: 'text-gold',
    light: 'text-light-blue',
    white: 'text-white'
  };

  const Tag = motion[element] || motion.p;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  };

  const wordAnimation = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <Tag
      ref={ref}
      className={`${colors[color]} ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ perspective: '1000px' }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordAnimation}
          className="inline-block"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {word}
          {index < words.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </Tag>
  );
}

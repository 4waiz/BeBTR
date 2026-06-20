import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reveal — fades/slides children into view once as they enter the viewport.
 * Used site-wide to give sections a polished, modern scroll experience
 * without each component re-implementing the same animation.
 */
function Reveal({ children, delay = 0, y = 24, as, ...rest }) {
  const MotionTag = as ? motion(as) : motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;

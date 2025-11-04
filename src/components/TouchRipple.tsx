import { motion } from 'motion/react';

interface TouchRippleProps {
  x: number;
  y: number;
  color: string;
  word: string;
}

export function TouchRipple({ x, y, color, word }: TouchRippleProps) {
  return (
    <>
      {/* Main ripple */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: x,
          top: y,
          backgroundColor: color,
          boxShadow: `0 0 20px ${color}`,
        }}
        initial={{ 
          scale: 0, 
          opacity: 0.8,
          x: '-50%',
          y: '-50%',
        }}
        animate={{ 
          scale: [0, 1.5, 2],
          opacity: [0.8, 0.5, 0],
        }}
        transition={{ 
          duration: 1,
          ease: 'easeOut',
        }}
      >
        <div className="w-32 h-32" />
      </motion.div>

      {/* Secondary smaller ripple */}
      <motion.div
        className="absolute rounded-full pointer-events-none border-4"
        style={{
          left: x,
          top: y,
          borderColor: color,
        }}
        initial={{ 
          scale: 0,
          opacity: 1,
          x: '-50%',
          y: '-50%',
        }}
        animate={{ 
          scale: [0, 2, 3],
          opacity: [1, 0.3, 0],
        }}
        transition={{ 
          duration: 1,
          ease: 'easeOut',
        }}
      >
        <div className="w-24 h-24" />
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: x,
          top: y,
          backgroundColor: color,
        }}
        initial={{ 
          scale: 1,
          opacity: 1,
          x: '-50%',
          y: '-50%',
        }}
        animate={{ 
          scale: [1, 0.5, 0],
          opacity: [1, 0.8, 0],
        }}
        transition={{ 
          duration: 0.8,
          ease: 'easeOut',
        }}
      >
        <div className="w-8 h-8" />
      </motion.div>

      {/* Word label at touch point */}
      <motion.div
        className="absolute pointer-events-none text-white drop-shadow-lg"
        style={{
          left: x,
          top: y,
        }}
        initial={{ 
          scale: 0,
          opacity: 1,
          x: '-50%',
          y: '-150%',
        }}
        animate={{ 
          scale: [0, 1.2, 1],
          opacity: [1, 1, 0],
          y: ['-150%', '-180%', '-200%'],
        }}
        transition={{ 
          duration: 1,
          ease: 'easeOut',
        }}
      >
        <div className="text-3xl whitespace-nowrap px-4 py-2 rounded-lg">
          {word}
        </div>
      </motion.div>
    </>
  );
}

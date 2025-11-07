import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export function DecorativeFrame() {
  const cornerStars = [
    { position: 'top-8 left-8', delay: 0 },
    { position: 'top-8 right-8', delay: 0.3 },
    { position: 'bottom-8 left-8', delay: 0.6 },
    { position: 'bottom-8 right-8', delay: 0.9 },
  ];

  return (
    <>
      {/* כוכבים קטנים בפינות */}
      {cornerStars.map((item, index) => {
        const { position, delay } = item;
        return (
          <motion.div
            key={index}
            className={`absolute ${position} pointer-events-none z-10`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1, 0.8],
              opacity: [0.4, 0.6, 0.4],
              rotate: [0, 360],
            }}
            transition={{
              scale: {
                duration: 2,
                delay: delay,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            <Star size={24} color="#FFD700" fill="#FFD700" opacity={0.7} />
          </motion.div>
        );
      })}
    </>
  );
}

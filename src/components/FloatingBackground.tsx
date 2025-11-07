import { motion } from 'motion/react';
import { Cloud } from 'lucide-react';

const clouds = [
  { delay: 0, top: '15%', duration: 25 },
  { delay: 5, top: '35%', duration: 30 },
  { delay: 10, top: '55%', duration: 28 },
  { delay: 3, top: '75%', duration: 32 },
];

export function FloatingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((cloud, index) => {
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              top: cloud.top,
              left: '-10%',
            }}
            initial={{ 
              x: '-10%',
              opacity: 0.3,
            }}
            animate={{ 
              x: '110vw',
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: cloud.duration,
              delay: cloud.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Cloud size={60 + index * 15} color="#FFFFFF" fill="#FFFFFF" opacity={0.6} />
          </motion.div>
        );
      })}
    </div>
  );
}

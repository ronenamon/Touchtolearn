import { motion } from 'motion/react';
import { Star, Heart, Sparkles } from 'lucide-react';

const floatingShapes = [
  { Icon: Star, color: '#FFD700', delay: 0 },
  { Icon: Heart, color: '#FF69B4', delay: 1 },
  { Icon: Sparkles, color: '#9933FF', delay: 2 },
  { Icon: Star, color: '#00CED1', delay: 3 },
  { Icon: Heart, color: '#FF6347', delay: 4 },
  { Icon: Star, color: '#32CD32', delay: 0.5 },
  { Icon: Sparkles, color: '#FF8800', delay: 1.5 },
  { Icon: Heart, color: '#FF1493', delay: 2.5 },
];

export function FloatingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {floatingShapes.map((shape, index) => {
        const { Icon, color, delay } = shape;
        const left = 10 + (index * 11) % 80;
        const size = 30 + (index % 3) * 20;
        
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${left}%`,
              color: color,
            }}
            initial={{ 
              y: '100vh',
              rotate: 0,
              opacity: 0.3,
            }}
            animate={{ 
              y: '-20vh',
              rotate: 360,
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 15 + index * 2,
              delay: delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Icon size={size} fill={color} />
          </motion.div>
        );
      })}
    </div>
  );
}

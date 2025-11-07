import { motion } from 'motion/react';
import { Star, Heart, Sparkles, Circle } from 'lucide-react';

interface MagicParticlesProps {
  x: number;
  y: number;
  color: string;
  word: string;
}

const shapes = [Star, Heart, Sparkles, Circle];

export function MagicParticles({ x, y, color, word }: MagicParticlesProps) {
  // יצירת 8-12 חלקיקים רנדומליים
  const particleCount = Math.floor(Math.random() * 5) + 8;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (360 / particleCount) * i + Math.random() * 30,
    distance: 100 + Math.random() * 100,
    duration: 0.8 + Math.random() * 0.4,
    size: 20 + Math.random() * 20,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  }));

  return (
    <>
      {/* גל ריפל ראשי קסום */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: x,
          top: y,
          background: `radial-gradient(circle, ${color}88, ${color}22)`,
          boxShadow: `0 0 40px ${color}88, 0 0 80px ${color}44`,
        }}
        initial={{ 
          scale: 0, 
          opacity: 1,
          x: '-50%',
          y: '-50%',
        }}
        animate={{ 
          scale: [0, 2.5, 3.5],
          opacity: [1, 0.6, 0],
        }}
        transition={{ 
          duration: 1.2,
          ease: [0.34, 1.56, 0.64, 1], // קפיצי
        }}
      >
        <div className="w-40 h-40" />
      </motion.div>

      {/* טבעת זוהרת */}
      <motion.div
        className="absolute rounded-full pointer-events-none border-[6px]"
        style={{
          left: x,
          top: y,
          borderColor: color,
          boxShadow: `0 0 20px ${color}`,
        }}
        initial={{ 
          scale: 0,
          opacity: 1,
          x: '-50%',
          y: '-50%',
          rotate: 0,
        }}
        animate={{ 
          scale: [0, 2, 2.5],
          opacity: [1, 0.5, 0],
          rotate: 360,
        }}
        transition={{ 
          duration: 1.5,
          ease: 'easeOut',
        }}
      >
        <div className="w-32 h-32" />
      </motion.div>

      {/* חלקיקים מתעופפים (כוכבים, לבבות וכו') */}
      {particles.map((particle) => {
        const ShapeComponent = particle.shape;
        const angleRad = (particle.angle * Math.PI) / 180;
        const endX = Math.cos(angleRad) * particle.distance;
        const endY = Math.sin(angleRad) * particle.distance;

        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: x,
              top: y,
              color: color,
            }}
            initial={{ 
              scale: 0,
              opacity: 1,
              x: '-50%',
              y: '-50%',
              rotate: 0,
            }}
            animate={{ 
              scale: [0, 1.2, 0],
              opacity: [1, 1, 0],
              x: ['-50%', `calc(-50% + ${endX}px)`],
              y: ['-50%', `calc(-50% + ${endY}px)`],
              rotate: [0, 180 + Math.random() * 360],
            }}
            transition={{ 
              duration: particle.duration,
              ease: 'easeOut',
            }}
          >
            <ShapeComponent 
              size={particle.size} 
              fill={color}
              strokeWidth={2}
            />
          </motion.div>
        );
      })}

      {/* נקודת מרכז זוהרת */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: x,
          top: y,
          backgroundColor: '#fff',
          boxShadow: `0 0 30px ${color}`,
        }}
        initial={{ 
          scale: 1,
          opacity: 1,
          x: '-50%',
          y: '-50%',
        }}
        animate={{ 
          scale: [1, 1.5, 0],
          opacity: [1, 1, 0],
        }}
        transition={{ 
          duration: 0.6,
          ease: 'easeOut',
        }}
      >
        <div className="w-6 h-6" />
      </motion.div>

      {/* המילה עם אפקט קפיץ קסום */}
      <motion.div
        className="absolute pointer-events-none drop-shadow-2xl"
        style={{
          left: x,
          top: y,
        }}
        initial={{ 
          scale: 0,
          opacity: 1,
          x: '-50%',
          y: '-50%',
          rotate: -10,
        }}
        animate={{ 
          scale: [0, 1.5, 1.2, 0],
          opacity: [1, 1, 1, 0],
          y: ['-50%', '-200%', '-220%', '-280%'],
          rotate: [-10, 5, -5, 0],
        }}
        transition={{ 
          duration: 1.4,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <div 
          className="text-5xl px-6 py-3 rounded-3xl backdrop-blur-sm border-4"
          style={{
            background: `linear-gradient(135deg, ${color}dd, ${color}99)`,
            borderColor: '#fff',
            textShadow: `
              3px 3px 0px rgba(0,0,0,0.1),
              0 0 20px rgba(255,255,255,0.8)
            `,
            color: '#fff',
          }}
        >
          {word}
        </div>
      </motion.div>

      {/* קונפטי נוסף קטן */}
      {Array.from({ length: 15 }, (_, i) => {
        const confettiAngle = Math.random() * 360;
        const confettiDistance = 50 + Math.random() * 150;
        const confettiX = Math.cos((confettiAngle * Math.PI) / 180) * confettiDistance;
        const confettiY = Math.sin((confettiAngle * Math.PI) / 180) * confettiDistance;
        
        return (
          <motion.div
            key={`confetti-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: x,
              top: y,
              backgroundColor: i % 2 === 0 ? color : '#fff',
              width: 4 + Math.random() * 8,
              height: 4 + Math.random() * 8,
            }}
            initial={{ 
              opacity: 1,
              x: '-50%',
              y: '-50%',
            }}
            animate={{ 
              opacity: [1, 1, 0],
              x: ['-50%', `calc(-50% + ${confettiX}px)`],
              y: ['-50%', `calc(-50% + ${confettiY}px)`],
            }}
            transition={{ 
              duration: 0.8 + Math.random() * 0.4,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </>
  );
}

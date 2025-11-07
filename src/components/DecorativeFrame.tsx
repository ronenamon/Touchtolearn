import { motion } from 'motion/react';
import { Star, Heart, Sparkles, Smile } from 'lucide-react';

export function DecorativeFrame() {
  const cornerIcons = [
    { Icon: Star, position: 'top-6 left-6', color: '#FFD700', rotation: -15 },
    { Icon: Heart, position: 'top-6 right-6', color: '#FF69B4', rotation: 15 },
    { Icon: Sparkles, position: 'bottom-6 left-6', color: '#9933FF', rotation: 15 },
    { Icon: Smile, position: 'bottom-6 right-6', color: '#FF8800', rotation: -15 },
  ];

  return (
    <>
      {/* אייקונים בפינות */}
      {cornerIcons.map((item, index) => {
        const { Icon, position, color, rotation } = item;
        return (
          <motion.div
            key={index}
            className={`absolute ${position} pointer-events-none z-10`}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0.8, 1, 0.8],
              rotate: [rotation - 10, rotation + 10, rotation - 10],
            }}
            transition={{
              duration: 3,
              delay: index * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div 
              className="p-3 rounded-2xl backdrop-blur-sm border-4 border-white/30"
              style={{
                background: `linear-gradient(135deg, ${color}99, ${color}66)`,
                boxShadow: `0 0 20px ${color}88`,
              }}
            >
              <Icon size={40} color="white" strokeWidth={2.5} fill="white" />
            </div>
          </motion.div>
        );
      })}

      {/* קישוטים נוספים בצדדים */}
      {[...Array(6)].map((_, i) => {
        const isTop = i < 3;
        const color = ['#FFD700', '#FF69B4', '#9933FF'][i % 3];
        
        return (
          <motion.div
            key={`decoration-${i}`}
            className={`absolute ${isTop ? 'top-0' : 'bottom-0'} pointer-events-none`}
            style={{
              left: `${15 + i * 15}%`,
            }}
            initial={{ 
              y: isTop ? -20 : 20,
              opacity: 0.6,
            }}
            animate={{ 
              y: isTop ? [-20, 0, -20] : [20, 0, 20],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2 + i * 0.3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 15px ${color}`,
              }}
            />
          </motion.div>
        );
      })}
    </>
  );
}

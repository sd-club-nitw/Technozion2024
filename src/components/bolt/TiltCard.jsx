import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Card from './Card';

interface TiltCardProps {
  title: string;
  description?: string;
  contact?: string;
  imgSrc: string;
}

const springConfig = {
  damping: 25,
  stiffness: 150,
  mass: 0.5
};

const TiltCard: React.FC<TiltCardProps> = ({ title, description, contact, imgSrc }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const glowOpacity = useSpring(0, springConfig);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -12;
    const rotateYValue = ((x - centerX) / centerX) * 12;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);

    const glowXPercent = (x / rect.width) * 100;
    const glowYPercent = (y / rect.height) * 100;
    glowX.set(glowXPercent);
    glowY.set(glowYPercent);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.05);
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glowOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="relative w-full h-full cursor-pointer"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full rounded-xl"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle 500px at ${glowX}% ${glowY}%, rgba(34, 211, 238, 0.3), transparent 50%)`,
            opacity: glowOpacity,
            mixBlendMode: 'screen'
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-10 overflow-hidden"
          style={{
            opacity: isHovered ? 0.3 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-horizontal" />
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            boxShadow: isHovered
              ? '0 30px 60px -12px rgba(0, 0, 0, 0.9), 0 0 100px rgba(34, 211, 238, 0.6), 0 0 50px rgba(34, 211, 238, 0.4), inset 0 0 50px rgba(34, 211, 238, 0.1)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 30px rgba(34, 211, 238, 0.2)',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <Card
            title={title}
            description={description}
            contact={contact}
            imgSrc={imgSrc}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none border border-cyan-400/50"
          style={{
            transform: 'translateZ(20px)',
            opacity: isHovered ? 1 : 0,
            boxShadow: 'inset 0 0 20px rgba(34, 211, 238, 0.3)',
            transition: 'opacity 0.3s ease'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default TiltCard;

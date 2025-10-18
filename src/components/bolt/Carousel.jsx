import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TiltCard from './TiltCard';
import { motion, AnimatePresence } from 'framer-motion';

interface CardData {
  title?: string;
  name?: string;
  description?: string;
  contact?: string;
  imgSrc?: string;
}

interface CarouselProps {
  data: CardData[];
}

const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      setCards(data);
    }
  }, [data]);

  const nextCard = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <p>No data available</p>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/30 via-black to-black" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float-1" style={{ top: '20%', left: '10%' }} />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float-2" style={{ top: '60%', left: '80%' }} />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float-3" style={{ top: '80%', left: '30%' }} />
        <div className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full animate-float-1" style={{ top: '40%', left: '70%', animationDelay: '1s' }} />
        <div className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full animate-float-2" style={{ top: '25%', left: '50%', animationDelay: '2s' }} />
      </div>

      <button
        onClick={prevCard}
        className="absolute left-4 md:left-8 z-20 p-3 md:p-4 rounded bg-black/60 backdrop-blur-sm border border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/80 hover:border-cyan-400 transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] group"
        aria-label="Previous card"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/10 rounded transition-colors" />
      </button>

      <div className="relative w-full max-w-md md:max-w-2xl h-[500px] md:h-[600px] px-4">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            className="absolute inset-0"
          >
            <TiltCard
              title={cards[currentIndex]?.title || cards[currentIndex]?.name || 'Untitled'}
              description={cards[currentIndex]?.description}
              contact={cards[currentIndex]?.contact}
              imgSrc={cards[currentIndex]?.imgSrc || '/placeholder.png'}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={nextCard}
        className="absolute right-4 md:right-8 z-20 p-3 md:p-4 rounded bg-black/60 backdrop-blur-sm border border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/80 hover:border-cyan-400 transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] group"
        aria-label="Next card"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/10 rounded transition-colors" />
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-cyan-500/30">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`transition-all duration-300 rounded-sm ${
              index === currentIndex
                ? 'w-8 h-2 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]'
                : 'w-2 h-2 bg-cyan-400/30 hover:bg-cyan-400/60 border border-cyan-400/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30 z-10" />
      <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-cyan-500/30 z-10" />
      <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-cyan-500/30 z-10" />
      <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-cyan-500/30 z-10" />
    </div>
  );
};

export default Carousel;

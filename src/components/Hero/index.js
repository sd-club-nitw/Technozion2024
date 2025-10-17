import React, { useEffect, useState } from "react";
import './index.css';
import { WebCanvas } from "../bg_animation/bg_animate";
import tzlogo_with_date from "./tzlogo_with_date.png";
import TypingWords from "./TypingWords";
import NumCount from "../utils/NumCount";
import { Link } from "react-router-dom";

// Countdown Component
import { motion, useAnimation } from "framer-motion";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTimeUp, setIsTimeUp] = useState(false);

  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff < 0) {
        clearInterval(interval);
        setIsTimeUp(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // 🪀 Scroll attempt effect
  useEffect(() => {
    const bounce = () => {
      controls.start({
        scaleY: [1, 1.25, 0.9, 1],
        scaleX: [1, 0.85, 1.1, 1],
        transition: { duration: 0.6, ease: "easeOut" },
      });
    };

    window.addEventListener("wheel", bounce);
    window.addEventListener("touchmove", bounce);

    return () => {
      window.removeEventListener("wheel", bounce);
      window.removeEventListener("touchmove", bounce);
    };
  }, [controls]);

  if (isTimeUp) return null;

  const labels = ["Days", "Hours", "Minutes", "Seconds"];
  const values = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds];

  return (
    <div className="countdown-container">
      <div className="countdown-clock">
        {labels.map((label, i) => (
          <motion.div
            key={label}
            className="time-box"
            animate={controls}
            transformOrigin="center"
          >
            <span className="time-numeric">{values[i]}</span>
            <span className="time-label">{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


const Hero = () => {
    // Set the target date and time for IST (Indian Standard Time)
    const targetDate = new Date("2025-10-24T10:30:00Z"); // This is 4:00 PM IST on October 24th , 2025

    return (
        <div>
            <div className="relative flex overflow-hidden mx-auto w-full">
                <WebCanvas />
                <div className="absolute h-full w-full top-0 left-0 spotlight opacity-95"></div>

                <div className='heading1 flex flex-col justify-center items-center' style={{ 'background': 'transparent' }}>
                    <div className="main-logo">

                  <span className="lg:text-5xl text-3xl font-bold mb-4 uppercase animate-pulse cursor-pointer">
          <TypingWords words={['TECHNOZION 2025', 'COMING SOON']} />
        </span>
                    </div>
                    {/* Countdown Clock */}
                    <CountdownTimer targetDate={targetDate} />
                    <section className="text-center uppercase mt-4 lg:text-3xl text-xl font-bold">
                         Prize pool worth ₹ <Link to='/events'><NumCount num={243000} className='hover:opacity-70 duration-100 cursor-pointer' /> /-</Link>
                    </section>
                    <section className="text-center mt-4 text-xl font-bold">
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Hero;

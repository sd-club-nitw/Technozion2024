import React, { useEffect, useState } from "react";
import './index.css';
import { WebCanvas } from "../bg_animation/bg_animate";
import tzlogo_with_date from "./tzlogo_with_date.png";
import TypingWords from "./TypingWords";
import NumCount from "../utils/NumCount";
import { Link } from "react-router-dom";

// Countdown Component
const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isTimeUp, setIsTimeUp] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = targetDate - now;
            if (diff < 0) {
                clearInterval(interval);
                setIsTimeUp(true);  // Mark timer as finished
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

    if (isTimeUp) {
        return null; // Hide the entire countdown component when the time is up
    }

    return (
        <div className="countdown-container">
            <div className="countdown-clock">
                <div className="time-box">
                    <span className="time-numeric">{timeLeft.days}</span>
                    <span className="time-label">Days</span>
                </div>
                <div className="time-box">
                    <span className="time-numeric">{timeLeft.hours}</span>
                    <span className="time-label">Hours</span>
                </div>
                <div className="time-box">
                    <span className="time-numeric">{timeLeft.minutes}</span>
                    <span className="time-label">Minutes</span>
                </div>
                <div className="time-box">
                    <span className="time-numeric">{timeLeft.seconds}</span>
                    <span className="time-label">Seconds</span>
                </div>
            </div>
        </div>
    );
};

const Hero = () => {
    // Set the target date and time for IST (Indian Standard Time)
    const targetDate = new Date("2025-10-24T06:00:00Z"); // This is 11:30 PM IST on October 24th , 2025

    return (
        <div>
            <div className="relative flex overflow-hidden mx-auto w-full">
                <WebCanvas />

                <div className='heading1 flex flex-col justify-center items-center' style={{ 'background': 'transparent' }}>
                    <div className="main-logo">

                  <span className="lg:text-5xl text-3xl font-bold mb-4 uppercase cursor-pointer">
          {/* <TypingWords words={['TECHNOZION 2025', 'COMING SOON']} /> */}
          <img alt='tz logo' className="w-80% scale-[.7] h-5 aspect-[15/3]" src={'./main_tz_logo.png'} />
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

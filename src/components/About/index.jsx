import React, { useRef, useState, useEffect } from 'react';
import './about.css';
// import logo1 from './logo1.png'; // Not used
// import AboutCard from './AboutCard'; // Not used
// import { WebCanvas } from "../bg_animation/bg_animate"; // Commented out in original
import { GrLinkNext } from "react-icons/gr";
import { FaYoutube } from "react-icons/fa";

// This component is now re-enabled.
// It calculates line breaks and animates each line in,
// which is much more responsive than animating each word.
const AnimatedText = ({ text }) => {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const run = () => {
      const el = containerRef.current;
      if (!el) return;

      const width = el.clientWidth;
      if (width === 0) return; // Don't run if element isn't rendered yet

      const measure = document.createElement("div");
      measure.style.position = "absolute";
      measure.style.visibility = "hidden";
      measure.style.whiteSpace = "nowrap";
      // Ensure font styles match for accurate measurement
      measure.style.font = window.getComputedStyle(el).font;
      document.body.appendChild(measure);

      const words = text.split(" ");
      let temp = [];
      let currentLine = "";

      for (let word of words) {
        // Fix: Check width with the *next* word added
        const testLine = currentLine === "" ? word : currentLine + " " + word;
        measure.innerText = testLine;
        
        if (measure.scrollWidth > width) {
          temp.push(currentLine.trim()); // Push the old line
          currentLine = word; // Start a new line
        } else {
          currentLine = testLine; // Add to the current line
        }
      }
      temp.push(currentLine.trim()); // Push the last line
      setLines(temp);
      document.body.removeChild(measure);
    };

    // Run slightly after layout settles
    const timeout = setTimeout(run, 100);

    // Re-run on window resize
    window.addEventListener('resize', run);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', run);
    };
  }, [text]); // Re-run if text changes

  return (
    <div
      ref={containerRef}
      className="text-md line-container flex-1" // Added flex-1 to fill space
      style={{ height: "auto" }}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className="line" // Assumes 'line' class in about.css handles display: block
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          {line}
        </span>
      ))}
    </div>
  );
};

export const About = () => {
  // Define text outside JSX for clarity
  const aboutText = `Technozion, NIT Warangal's annual technical festival, started as a platform for students to showcase their technical skills and innovations. Now, after many successful editions, it has become one of the most anticipated technical fests in the country, attracting participants from various institutions. Throughout its history, Technozion has hosted renowned speakers and experts, providing valuable insights and inspiration to attendees. The festival features various competitions, workshops, and exhibitions, creating a vibrant atmosphere of learning and collaboration.`;

  return (
    <div>
      <div className="relative about-page">
        {/* <WebCanvas /> */}
        <div className='absolute overflow-visible top-0 w-screen m-0 p-0 grid lg:grid-cols-6 grid-cols-1'>
          
          {/* === LEFT COLUMN (CONTENT) === */}
          {/* === LEFT COLUMN (CONTENT) === */}
<section className="flex pt-24 px-6 pb-6 sm:pt-24 sm:px-12 sm:pb-12 lg:pl-20 lg:pr-36 lg:py-24 justify-center flex-col col-span-3 bg-slate-950 overflow-visible min-h-screen about-content">
            
            {/* Title: Responsive Font Size */}
            <div className="text-5xl sm:text-6xl lg:text-8xl mb-10 text-rise">
              {"ABOUT".split("").map((ch, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{ch}</span>
              ))}
            </div>

            {/* Text: Using AnimatedText component for responsiveness */}
            <div className="flex-1 my-6"> {/* Wrapper to allow text to fill space */}
              <AnimatedText text={aboutText} />
            </div>

            {/* Buttons: Responsive layout (stacking) */}
            <section className="flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-4 mt-6">
              
              <button className="active:bg-slate-300 bg-white text-black w-full lg:w-fit p-5 rounded-md flex gap-x-2 items-center justify-center lg:justify-start">
                <span>Download brochure</span> <GrLinkNext />
              </button>

              <div className="flex flex-col items-center gap-y-2 justify-center">
                <a href='https://www.youtube.com/watch?v=LJLtHr0kcrA' className="bg-darkPurple text-white flex items-center w-full link-btn p-5 flex gap-x-2 items-center" target='_blank' rel="noopener noreferrer">
                  <span><FaYoutube /></span>
                  What is technozion
                </a>
                <a href='https://www.youtube.com/watch?v=1T_d1YoCWuA' className="bg-darkPurple text-white flex items-center w-full link-btn p-5 flex gap-x-2 items-center" target='_blank' rel="noopener noreferrer">
                  <span><FaYoutube /></span>
                  What is technozion
                </a>
              </div>
            </section>
          </section>

          {/* === RIGHT COLUMN (PDF) === */}
          {/* Set to h-screen to fill viewport on mobile when it stacks */}
          <section className="backdrop-blur-md col-span-3 h-screen">
            <div className="h-full z-10">
              <iframe
                src="/pdf/tz.pdf#toolbar=0&zoom=30&"
                title="Embedded PDF Document"
                // Responsive padding
                className="w-full p-4 sm:p-8 lg:p-20 m-auto rounded-md"
                style={{ border: 'none', height: '100%' }}
              >
                {/* Fallback content */}
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p>
                    **Sorry, your browser doesn't support embedded PDFs on this device.**
                  </p>
                  <a
                    href="/pdf/tz.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{
                      display: 'inline-block',
                      borderRadius: '5px',
                      marginTop: '10px',
                    }}
                  >
                    📥 Download PDF
                  </a>
                </div>
              </iframe>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
import React, { useRef, useState, useEffect } from 'react';
import './about.css';
import { WebCanvas } from "../bg_animation/bg_animate";
import { GrLinkNext } from "react-icons/gr";
import { FaYoutube } from "react-icons/fa";

// This component is now re-enabled.
// It calculates line breaks and animates each line in,
// which is much more responsive than animating each word.
// const AnimatedText = ({ text }) => {
//   const containerRef = useRef(null);
//   const [lines, setLines] = useState([]);

//   useEffect(() => {
//     const run = () => {
//       const el = containerRef.current;
//       if (!el) return;

//       const width = el.clientWidth;
//       if (width === 0) return; // Don't run if element isn't rendered yet

//       const measure = document.createElement("div");
//       measure.style.position = "absolute";
//       measure.style.visibility = "hidden";
//       measure.style.whiteSpace = "nowrap";
//       // Ensure font styles match for accurate measurement
//       measure.style.font = window.getComputedStyle(el).font;
//       document.body.appendChild(measure);

//       const words = text.split(" ");
//       let temp = [];
//       let currentLine = "";

//       for (let word of words) {
//         // Fix: Check width with the *next* word added
//         const testLine = currentLine === "" ? word : currentLine + " " + word;
//         measure.innerText = testLine;
        
//         if (measure.scrollWidth > width) {
//           temp.push(currentLine.trim()); // Push the old line
//           currentLine = word; // Start a new line
//         } else {
//           currentLine = testLine; // Add to the current line
//         }
//       }
//       temp.push(currentLine.trim()); // Push the last line
//       setLines(temp);
//       document.body.removeChild(measure);
//     };

//     // Run slightly after layout settles
//     const timeout = setTimeout(run, 100);

//     // Re-run on window resize
//     window.addEventListener('resize', run);

//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener('resize', run);
//     };
//   }, [text]); // Re-run if text changes

//   return (
//     <div
//       ref={containerRef}
//       className="text-md line-container flex-1" // Added flex-1 to fill space
//       style={{ height: "auto" }}
//     >
//       {lines.map((line, i) => (
//         <span
//           key={i}
//           className="line" // Assumes 'line' class in about.css handles display: block
//           style={{ animationDelay: `${i * 0.2}s` }}
//         >
//           {line}
//         </span>
//       ))}
//     </div>
//   );
// };

export const About = () => {
  // Define text outside JSX for clarity
  const aboutText = `Technozion, NIT Warangal's annual technical festival, started as a platform for students to showcase their technical skills and innovations. Now, after many successful editions, it has become one of the most anticipated technical fests in the country, attracting participants from various institutions. Throughout its history, Technozion has hosted renowned speakers and experts, providing valuable insights and inspiration to attendees. The festival features various competitions, workshops, and exhibitions, creating a vibrant atmosphere of learning and collaboration.`;

  return (
    <div>
      <div className="relative about-page">
        <WebCanvas />
        <div className="absolute overflow-visible  top-0 w-screen m-0 p-0  grid lg:grid-cols-6 grid-cols-1">
          <div className="absolute top-0 w-screen m-0 p-0 grid lg:grid-cols-6 grid-cols-1 overflow-visible">
            {/* LEFT COLUMN */}
            <section
              className="flex flex-col justify-center col-span-3 bg-slate-950 overflow-visible 
    h-screen pr-4 pl-4 py-12 pt-20 sm:pr-8 sm:pl-8 sm:py-16 lg:pr-36 lg:pl-20 lg:py-24"
            >
              <div className="text-5xl sm:text-6xl lg:text-8xl mb-10 sm:mb-6 text-rise flex flex-wrap">
                {"ABOUT".split("").map((ch, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                    {ch}
                  </span>
                ))}
              </div>

              <section className="text-md sm:text-xl text-rise flex-1">
                <AnimatedText text={aboutText} />
              </section>

              <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 sm:mt-8 gap-3 sm:gap-6">
                <a
                  href="/pdf/tz.pdf"
                  className="active:bg-slate-300 bg-white"
                  download="technozion_2025.pdf"
                >
                  <button className="text-black w-full sm:w-fit p-4 sm:p-5 rounded-md flex gap-x-2 items-center">
                    <span>Download brochure</span> <GrLinkNext />
                  </button>
                </a>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 w-full sm:w-auto">
                  <a
                    href="https://www.youtube.com/watch?v=LJLtHr0kcrA"
                    target="_blank"
                    className="bg-darkPurple text-white flex items-center justify-center w-full sm:w-auto p-3 sm:p-5 gap-x-2 rounded-md"
                  >
                    <FaYoutube /> What is technozion
                  </a>
                </div>
              </section>
            </section>

            {/* RIGHT COLUMN */}
            <section className="backdrop-blur-md col-span-3 w-full h-[500px] sm:h-[600px] lg:h-screen mt-4 lg:mt-10 overflow-auto">
              <iframe
                src="/pdf/tz.pdf#toolbar=0&zoom=30&"
                title="Embedded PDF Document"
                className="w-full h-full p-4 sm:p-8 lg:p-20 m-auto rounded-md"
                style={{ border: "none" }}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
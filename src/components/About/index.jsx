import React, {useRef, useState, useEffect} from 'react';
import './about.css';
import { WebCanvas } from "../bg_animation/bg_animate";
import { GrLinkNext } from "react-icons/gr";
import { FaYoutube } from "react-icons/fa";


// const AnimatedText = ({ text }) => {
//   const containerRef = useRef(null);
//   const [lines, setLines] = useState([]);

// useEffect(() => {
//   const run = () => {
//     const el = containerRef.current;
//     if (!el) return;

//     const width = el.clientWidth;
//     const measure = document.createElement("div");
//     measure.style.position = "absolute";
//     measure.style.visibility = "hidden";
//     measure.style.whiteSpace = "nowrap";
//     measure.style.width = width + "px";
//     measure.style.font = window.getComputedStyle(el).font;
//     document.body.appendChild(measure);

//     const words = text.split(" ");
//     let temp = [];
//     let currentLine = "";

//     for (let word of words) {
//       measure.innerText = currentLine + " " + word;
//       if (measure.scrollWidth > width) {
//         temp.push(currentLine.trim());
//         currentLine = word;
//       } else {
//         currentLine += " " + word;
//       }
//     }
//     temp.push(currentLine.trim());
//     setLines(temp);
//     document.body.removeChild(measure);
//   };

//   // Run slightly after layout settles (esp. after route transition)
//   const timeout = setTimeout(run, 100);
//   return () => clearTimeout(timeout);
// }, [text]);


//   return (
//     <div
//       ref={containerRef}
//       className="text-md line-container"
//       style={{ height: "auto" }}
//     >
//       {lines.map((line, i) => (
//         <span
//           key={i}
//           className="line"
//           style={{ animationDelay: `${i * 0.2}s` }}
//         >
//           {line}
//         </span>
//       ))}
//     </div>
//   );
// };

export const About = () => {
  return (
    <div>
      <div className="relative about-page">
       <WebCanvas />
        <div className='absolute overflow-visible  top-0 w-screen m-0 p-0  grid lg:grid-cols-6 grid-cols-1'>
          <section className="flex pr-36 py-24 pl-20 justify-center flex-col col-span-3 bg-slate-950 overflow-visible h-screen  about-content">
<div className="text-8xl mb-10 text-rise">

  {"ABOUT".split("").map((ch, i) => (
    <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{ch}</span>
  ))}
</div>
<section className="text-md text-rise flex-1">
{`
Technozion, NIT Warangal's annual technical festival, started 
as a platform for students to showcase their technical skills and 
innovations. Now, after many successful editions, it has become one 
of the most anticipated technical fests in the country, attracting 
participants from various institutions. Throughout its history, 
Technozion has hosted renowned speakers and experts, providing 
valuable insights and inspiration to attendees. The festival 
features various competitions, workshops, and exhibitions, 
creating a vibrant atmosphere of learning and collaboration.
`.split(" ").map((ch, i) => (
    <span key={i} style={{ animationDelay: `${i * 0.01}s` }}>{ch}</span>
  ))}
</section>
<section className="flex items-start justify-between ">
<a href="/pdf/tz.pdf" className="active:bg-slate-300 bg-white" download="technozion_2025.pdf">
<button className="  text-black w-fit p-5  rounded-md flex gap-x-2 items-center"><span>Download brochure</span> <GrLinkNext /></button>
</a>
<div className="flex flex-col items-center gap-y-2 justify-center">
<a href='https://www.youtube.com/watch?v=LJLtHr0kcrA' className="bg-darkPurple text-white flex items-center w-full link-btn p-5 flex gap-x-2 items-center" target='_blank'>

  <span><FaYoutube /></span>
What is technozion

</a>
<a href='https://www.youtube.com/watch?v=1T_d1YoCWuA' className="bg-darkPurple text-white flex items-center w-full link-btn p-5 flex gap-x-2 items-center" target='_blank'>

  <span><FaYoutube /></span>
What is technozion

</a>
</div>
</section>
          </section>

             <section className="backdrop-blur-md col-span-3 h-full">
      
        <div className="h-full z-10">
          <iframe
            src="/pdf/tz.pdf#toolbar=0&zoom=30&"
            title="Embedded PDF Document"
            className="w-full p-20 m-auto rounded-md"
            style={{ border: 'none', height: '100%' }}
          >
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

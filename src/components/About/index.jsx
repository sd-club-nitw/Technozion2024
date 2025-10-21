import React from 'react';
import './about.css';
import logo1 from './logo1.png';
import AboutCard from './AboutCard';
import { WebCanvas } from "../bg_animation/bg_animate";
import { GrLinkNext } from "react-icons/gr";

export const About = () => {
  return (
    <div>
      <div className="relative about-page">
       {/* <WebCanvas /> */}
        <div className='absolute overflow-visible  top-0 w-screen m-0 p-0  grid lg:grid-cols-6 grid-cols-1'>
          <section className="flex pr-36  pl-20 justify-center flex-col col-span-3 bg-slate-950 overflow-visible h-screen  about-content">
<div className="text-8xl mb-10 animate-slideInLeft">
  ABOUT
</div>
<section className="text-md">
Technozion, NIT Warangal's annual technical festival, started 
as a platform for students to showcase their technical skills and 
innovations. Now, after many successful editions, it has become one 
of the most anticipated technical fests in the country, attracting 
participants from various institutions. Throughout its history, 
Technozion has hosted renowned speakers and experts, providing 
valuable insights and inspiration to attendees. The festival 
features various competitions, workshops, and exhibitions, 
creating a vibrant atmosphere of learning and collaboration.
</section>
<button className=" active:bg-slate-300 bg-white text-black w-fit p-5 mt-10 rounded-md flex gap-x-2 items-center"><span>Download brochure</span> <GrLinkNext /></button>
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

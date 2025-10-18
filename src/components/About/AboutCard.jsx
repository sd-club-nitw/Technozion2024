import React, { useRef, useEffect, useState } from "react";
import './about.css';
import youtubeLogo from './youtube-logo.png';
import { motion } from "framer-motion";
import TypingText from "../utils/TypingText";


function AboutCard({ content, image, imgToRight, title }) {
  return (
    <div className="about-container lg:mt-32 mt-24">
      <div className={`flex flex-col mx-4 md:mx-10 mt-10 flex-wrap justify-center items-center`}>
        <div className="about_us w-full text-center"></div>

        <div className="about-card text-white p-10 rounded-md w-full">
          <div className="z-5 flex justify-center items-center duration-700 flex-col sm:flex-row">
            {/* Uncomment this if you need to display an image */}
            {/* <div className="sm:w-[100%] md:w-[45%] flex justify-center items-center">
              <img className="sm:w-[330px] md:w-[590px] max-w-full rounded-md" src={image} alt="themelogo" />
            </div> */}
            <div className="theme-content sm:w-[100%] md:w-[45%] text-md space-x-9">
              <p>{content}</p>
            </div>
          </div>
        </div>
        <br />
      </div>

      <div className="youtube-links">
        {/* Your motion buttons remain unchanged */}
      </div>

      <section className="w-full z-9 h-full">
        <h1 className="text-center">Technozion Brochure</h1>
        <div style={{ height: '800px', width: '100%' }}>
          <iframe
            src="/pdf/tz.pdf#toolbar=0&zoom=60&"
            title="Embedded PDF Document"
            style={{ border: 'none', width: '80%', margin: 'auto', height: '100%' }}
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
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
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
  );
}

export default AboutCard;

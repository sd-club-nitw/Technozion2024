import React, { useRef, useEffect, useState } from "react";
import './about.css';
import youtubeLogo from './youtube-logo.png';
import { motion } from "framer-motion";
import TypingText from "../utils/TypingText";
import { WebCanvas } from "../bg_animation/bg_animate";


function AboutCard({ content, image, imgToRight, title }) {
  return (
    <div className="about-container">
      <WebCanvas />
      <WebCanvas />
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

     
    </div>
  );
}

export default AboutCard;

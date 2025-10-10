import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./card.css";
import ResizeObserver from "resize-observer-polyfill";
import { WebCanvas } from "../bg_animation/bg_animate";
import fallbackImg from "./tzcomingsoon.png"; // Fallback image
import PosterSkeleton from "../Skeleton/PosterSkeleton";
import { IoMdArrowRoundBack, IoMdPerson } from "react-icons/io";
import { a, span } from "framer-motion/client";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdContentCopy, MdEmail } from "react-icons/md";
import CopyWrapper from "../utils/CopyWrapper";

const Card = () => {
  const location = useLocation(); // Extract data from navigation
  const navigate = useNavigate(); // For navigating back
  const { title, overview, rules, judging_criteria, imgsrc, glink, total_cost } =
    location.state || {}; // Extract state data

  const [activeTab, setActiveTab] = useState("overview"); // Track the active tab
  const [imageSrc, setImageSrc] = useState(imgsrc); // State for image source

  const contentRef = useRef(null); // Ref to the content container
  console.log(judging_criteria);
  // Handles navigation back to the previous view
  const handleBack = () => {
    navigate(-1); // Navigate back in browser history
  };

  // Handles image load error
  const handleImageError = () => {
    setImageSrc(fallbackImg); // Set to fallback image on error
  };

  // Scroll to the top of the content container when the active tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0; // Scroll the content container to the top
    }
  }, [activeTab]); // Runs whenever activeTab changes

  // Effect to set the logo height CSS variable
  useEffect(() => {
    const logoContainer = document.querySelector(".logo-container");

    const setLogoHeight = (entries) => {
      for (let entry of entries) {
        const logoHeight = entry.contentRect.height; // Get the new height of the logo container
        document.documentElement.style.setProperty(
          "--logo-height",
          `${logoHeight}px`
        ); // Set the variable
      }
    };

    const resizeObserver = new ResizeObserver(setLogoHeight); // Initialize ResizeObserver

    if (logoContainer) {
      resizeObserver.observe(logoContainer); // Start observing the logo container
    }

    // Clean up on unmount
    return () => {
      resizeObserver.disconnect(); // Stop observing when component unmounts
    };
  }, []);

  return (
    <div className="card-container">
      <div className="web-canvas">
        <WebCanvas />
      </div>
      <div className={`event_card wrap animate pop active `}>
        <div className="text">
          <div className="logo-cardnav-container">
            <div className="logo-container p-5 ">
              <PosterSkeleton
                src={imageSrc}
                alt="Logo"
                className="cnt-logo rounded-md"
                onError={handleImageError}
              />
            </div>
            <div className="content-container">
              <div className="cardnav p-5 z-10">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={activeTab === "overview" ? "active" : ""}
                >
                  Overview
                </button>
                {rules && (
                  <button
                    onClick={() => setActiveTab("rules")}
                    className={activeTab === "rules" ? "active" : ""}
                  >
                    Rules
                  </button>
                )}
                {/* {judging_criteria && (
                  <button
                    onClick={() => setActiveTab('judging_criteria')}
                    className={activeTab === 'judging_criteria' ? 'active' : ''}
                  >
                    Judging Criteria
                  </button>
                )} */}
                <button
                  className="back-button flex items-center gap-x-2"
                  onClick={handleBack}
                >
                  <span>
                    <IoMdArrowRoundBack />
                  </span>
                  Back
                </button>
              </div>
              <div
                className="content p-5 lg:gap-y-10 gap-y-5"
                ref={contentRef}
                key={activeTab}
              >
                {" "}
                {/* Key ensures content re-renders on tab change */}
                {activeTab === "overview" ? (
                  <>
                    <div className="font-bold text-2xl uppercase w-full ">
                      {overview?.main_title}
                    </div>
                    {glink && (
                      <span className="opacity-70 text-[1rem]">
                        <a
                          href={glink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 flex hover:bg-[#16f6f256] hover:scale-110 duration-150 hover:text-white items-center gap-x-3 uno-underline px-3 py-3 bg-gray rounded-md border-blue-500"
                        >
                          <span>
                            <FaExternalLinkAlt />
                          </span>
                          Register Now
                        </a>
                      </span>
                    )}
                    <section className="flex flex-col gap-y-1 items-start justify-start">
                      <span className="opacity-70 text-[1rem]">
                        Description
                      </span>

                      <div className="text-[1.1rem]">{overview?.description}</div>
                    </section>
                    {total_cost ? (
                       <section className="flex flex-col gap-y-1 items-start justify-start">
                        <span className="opacity-70 text-[1rem]">
                          Prizes worth
                        </span>
                        <span className="text-[1.2rem]">₹ <strong>{total_cost}</strong></span>
                        <small className="opacity-60">
                          prizes will be given based on judging criteria
                        </small>
                        
                      </section>
                    ) : null}
                    {overview?.cash_prize && (
                      <section className="flex flex-col gap-y-1 items-start justify-start">
                        <span className="opacity-70 text-[1rem]">
                          Cash Prize
                        </span>
                        <span className="text-[1.2rem]">₹ <strong>{overview.cash_prize}</strong></span>

                       <small className="opacity-60">
                          cash prize will be given based on performance
                        </small>
                      </section>
                    )}
                    <section className="flex flex-col gap-y-1 items-start justify-start">
                      <span className="opacity-70 text-[1rem]">
                        Participation
                      </span>
                      <div className="font-bold">
                        {overview?.team_size == 1
                          ? `Individual`
                          : overview.team_size}
                      </div>
                    </section>
                    
                    <section className="flex flex-col gap-y-1 items-start justify-start">
                      <span className="opacity-70 text-[1rem]">Contact</span>
                      <div className="flex lg:flex-row flex-col gap-x-5 text-[1rem] gap-y-1">
                        {overview?.contact?.map((contact, index) => (
                          <div key={index} className="flex flex-col mb-5 bg-gray p-3 rounded-md lg:min-w-[15em]">
                            {contact?.name && (

                              <span className="flex gap-x-3 opacity-50 text-[.9rem] items-center">{contact.name}</span>
                            )}
{contact?.phone && (

  <span className="flex justify-between gap-x-3 items-center cursor-pointer">
                              <span  className="flex gap-x-3 items-center">

                             +91 {contact.phone}
                              </span>
                            <CopyWrapper text={contact.phone}>
                              <MdContentCopy />
                            </CopyWrapper>
                            </span>
                            )}
                            {contact?.email && (
                            <span className="flex justify-between gap-x-3 items-center cursor-pointer">
                              <span  className="">

                              {contact.email}
                              
                              </span>
                              <CopyWrapper text={contact.email}>
                              <MdContentCopy />
                                </CopyWrapper>
                            </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                ) : (
                  <>
                    {activeTab === "rules" ? (
                      <>
                        <div>
                          <div className="font-bold text-2xl uppercase w-full ">
                            Rules
                          </div>
                          <div className="flex flex-col gap-y-3 mt-5">
                            {rules?.map((rule, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-x-3"
                              >
                                <span className="font-bold">{index + 1}.</span>
                                <span>{rule}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>Invalid Tab</>
                    )}
                  </>
                )}
                {/* {renderContent()} */}
              </div>
              {/* <div className="register">
                                <button className="register-button" onClick={handleRegister}>Register</button>
                            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

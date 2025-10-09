import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./card.css";
import ResizeObserver from "resize-observer-polyfill";
import { WebCanvas } from "../bg_animation/bg_animate";
import fallbackImg from "./tzcomingsoon.png"; // Fallback image
import PosterSkeleton from "../Skeleton/PosterSkeleton";

const Card = () => {
  const location = useLocation(); // Extract data from navigation
  const navigate = useNavigate(); // For navigating back
  const { title, overview, rules, judging_criteria, imgsrc, glink } =
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

  // Renders the content of the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <div dangerouslySetInnerHTML={{ __html: overview }} />;
      case "rules":
        return <div dangerouslySetInnerHTML={{ __html: rules }} />;
      case "judging_criteria":
        return <div dangerouslySetInnerHTML={{ __html: judging_criteria }} />;
      default:
        return null;
    }
  };

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

  // Handles redirect to the registration link
  const handleRegister = () => {
    if (glink) {
      window.open(glink, "_blank"); // Open the glink URL in a new tab
    } else {
      alert("Registration link is unavailable."); // Fallback if glink is missing
    }
  };

  return (
    <div className="card-container">
      <div className="web-canvas">
        <WebCanvas />
      </div>
      <div className={`event_card wrap animate pop active`}>
        <div className="text">
          <div className="logo-cardnav-container">
            <div className="logo-container">
              <PosterSkeleton
                src={imageSrc}
                alt="Logo"
                className="cnt-logo"
                onError={handleImageError}
              />
            </div>
            <div className="content-container">
              <div className="cardnav">
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
                <button className="back-button" onClick={handleBack}>
                  Back
                </button>
              </div>
              <div className="content" ref={contentRef} key={activeTab}>
                {" "}
                {/* Key ensures content re-renders on tab change */}
                {renderContent()}
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

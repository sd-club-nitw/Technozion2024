import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./card.css";
import { WebCanvas } from "../bg_animation/bg_animate";
import fallbackImg from "./tzcomingsoon.png";
import PosterSkeleton from "../Skeleton/PosterSkeleton";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import CopyWrapper from "../utils/CopyWrapper";

const Card = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    title,
    name,
    overview,
    rules,
    judging_criteria,
    imgsrc,
    glink,
    total_cost,
  } = location.state || {};

  const [imageSrc, setImageSrc] = useState(imgsrc);
  const cardRef = useRef(null);

  // Handles navigation back
  const handleBack = React.useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/events");
    }
  }, [navigate]);

  // Handles clicking outside the card
  const handleContainerClick = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      handleBack();
    }
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBack]);

  // Handles image load error
  const handleImageError = () => {
    setImageSrc(fallbackImg);
  };

  return (
    <div className="card-container" onClick={handleContainerClick}>
      <div className="web-canvas">
        <WebCanvas />
      </div>

      <div
        ref={cardRef}
        className="event_card wrap active"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text">
          {/* Card Header with single Back button */}
          <div className="cardnav p-4 lg:px-6 z-10">
            <div className="flex items-center gap-2">
              {name && (
                <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-cyan-400/40 bg-cyan-950/40 text-cyan-300 font-semibold">
                  {name}
                </span>
              )}
            </div>
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

          {/* Three Sections: Image, Overview, Rules */}
          <div className="card-sections-container">
            {/* Section 1: Image */}
            <div className="card-section card-section-image">
              <div className="poster-frame">
                <PosterSkeleton
                  src={imageSrc}
                  alt={title || "Event Poster"}
                  className="cnt-logo rounded-xl"
                  onError={handleImageError}
                />
              </div>
            </div>

            {/* Section 2: Overview */}
            <div className="card-section card-section-overview custom-scrollbar">
              <div className="font-bold text-2xl lg:text-3xl uppercase tracking-wide text-cyan-300 mb-4">
                {overview?.main_title || title}
              </div>

              {glink && (
                <div className="mb-5">
                  <a
                    href={glink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="register-btn inline-flex items-center gap-x-2.5 px-4 py-2.5 rounded-lg border border-cyan-400 text-cyan-300 bg-cyan-950/40 hover:bg-cyan-500/20 hover:scale-105 duration-200 transition-all text-sm font-semibold"
                  >
                    <FaExternalLinkAlt className="text-xs" />
                    <span>Register Now</span>
                  </a>
                </div>
              )}

              {overview?.description && (
                <section className="overview-item mb-5 flex flex-col gap-y-1">
                  <span className="section-label opacity-70 text-[0.95rem] tracking-wider uppercase">
                    Description
                  </span>
                  <div className="section-text text-sm lg:text-[1.05rem] leading-relaxed">
                    {overview.description}
                  </div>
                </section>
              )}

              {total_cost ? (
                <section className="overview-item mb-5 flex flex-col gap-y-1">
                  <span className="section-label opacity-70 text-[0.95rem] tracking-wider uppercase">
                    Prizes worth
                  </span>
                  <span className="text-xl lg:text-2xl font-bold text-cyan-300">
                    ₹ {total_cost}
                    <sup>*</sup>
                  </span>
                </section>
              ) : null}

              {overview?.cash_prize && (
                <section className="overview-item mb-5 flex flex-col gap-y-1">
                  <span className="section-label opacity-70 text-[0.95rem] tracking-wider uppercase">
                    Cash Prize
                  </span>
                  <span className="text-xl lg:text-2xl font-bold text-cyan-300">
                    ₹ {overview.cash_prize}
                  </span>
                </section>
              )}

              {overview?.team_size && (
                <section className="overview-item mb-5 flex flex-col gap-y-1">
                  <span className="section-label opacity-70 text-[0.95rem] tracking-wider uppercase">
                    Participation
                  </span>
                  <div className="font-bold text-sm lg:text-base">
                    {String(overview.team_size) === "1"
                      ? "Individual"
                      : overview.team_size}
                  </div>
                </section>
              )}

              {overview?.contact && overview.contact.length > 0 && (
                <section className="overview-item mb-4 flex flex-col gap-y-1">
                  <span className="section-label opacity-70 text-[0.95rem] tracking-wider uppercase mb-1">
                    Contact
                  </span>
                  <div className="flex flex-col gap-3">
                    {overview.contact.map((contact, index) => (
                      <div
                        key={index}
                        className="contact-card p-3 rounded-lg bg-black/40 border border-cyan-500/20 flex flex-col gap-y-1"
                      >
                        {contact?.name && (
                          <span className="text-xs lg:text-sm opacity-70 font-medium">
                            {contact.name}
                          </span>
                        )}
                        {contact?.phone && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-cyan-300 font-medium">
                              +91 {contact.phone}
                            </span>
                            <CopyWrapper text={contact.phone}>
                              <MdContentCopy className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
                            </CopyWrapper>
                          </div>
                        )}
                        {contact?.email && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-cyan-300 truncate mr-2 font-medium">
                              {contact.email}
                            </span>
                            <CopyWrapper text={contact.email}>
                              <MdContentCopy className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
                            </CopyWrapper>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <small className="opacity-60 text-xs mt-2 block">
                    *cash prize will be given based on judging criteria
                  </small>
                </section>
              )}
            </div>

            {/* Section 3: Rules */}
            <div className="card-section card-section-rules custom-scrollbar">
              <div className="font-bold text-2xl lg:text-3xl uppercase tracking-wide text-cyan-300 mb-4">
                Rules
              </div>

              {rules && rules.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {rules.map((rule, index) => (
                    <div
                      key={index}
                      className="rule-item flex items-start gap-3 p-3.5 rounded-lg bg-black/40 border border-cyan-500/20"
                    >
                      <span className="font-bold text-cyan-300 min-w-[22px]">
                        {index + 1}.
                      </span>
                      <span className="text-sm lg:text-[0.95rem] leading-relaxed">
                        {rule}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-black/30 border border-cyan-500/20 text-sm opacity-70">
                  No specific rules provided for this event. Follow general fest
                  guidelines.
                </div>
              )}

              {judging_criteria && judging_criteria !== "Coming Soon..." && (
                <div className="mt-6">
                  <div className="font-bold text-lg uppercase tracking-wide text-cyan-300 mb-2">
                    Judging Criteria
                  </div>
                  <div className="p-3.5 rounded-lg bg-black/40 border border-cyan-500/20 text-sm lg:text-[0.95rem] leading-relaxed">
                    {judging_criteria}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

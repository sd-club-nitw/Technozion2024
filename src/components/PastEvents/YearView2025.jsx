import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import EventsBrowser from "./EventsBrowser";
import { TeamContent } from "../Team/team";
import TeamsBanner from "../Team/Teams.png";

export const YearView2025 = ({ onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialSection = () => {
    const params = new URLSearchParams(location.search);
    return params.get("section") || "events";
  };

  const [activeSection, setActiveSection] = useState(getInitialSection);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionParam = params.get("section");
    if (sectionParam && (sectionParam === "events" || sectionParam === "team")) {
      setActiveSection(sectionParam);
    }
  }, [location.search]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    const params = new URLSearchParams(location.search);
    params.set("section", section);
    // If switching to team, remove tab param or preserve it
    if (section === "team") {
      params.delete("tab");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <div className="edition-view-container">
      {/* 2025 Edition Navigation Bar */}
      <div className="edition-topbar">
        <div className="edition-topbar-row">
          {/* Back to all editions */}
          <button
            type="button"
            className="back-to-years-btn"
            onClick={onBack}
            aria-label="Back to Past Editions"
          >
            <IoMdArrowRoundBack className="text-base" />
            <span>All Editions</span>
          </button>

          {/* Title & year badge */}
          <div className="edition-badge-container">
            <h1 className="edition-title-badge">Technozion 2025</h1>
            <span className="edition-year-pill">ARCHIVE</span>
          </div>

          {/* Mode Switcher: Events vs Team */}
          <div className="edition-mode-switcher">
            <button
              type="button"
              className={`mode-switch-btn ${
                activeSection === "events" ? "active" : ""
              }`}
              onClick={() => handleSectionChange("events")}
              aria-pressed={activeSection === "events"}
            >
              <FaCalendarAlt />
              <span>Events & Expos</span>
            </button>

            <button
              type="button"
              className={`mode-switch-btn ${
                activeSection === "team" ? "active" : ""
              }`}
              onClick={() => handleSectionChange("team")}
              aria-pressed={activeSection === "team"}
            >
              <FaUsers />
              <span>Organizing Team</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Body: Events or Team */}
      <div className="edition-content-body">
        {activeSection === "events" ? (
          <EventsBrowser />
        ) : (
          <div className="edition-team-wrapper">
            <img
              src={TeamsBanner}
              alt="Technozion 2025 Team"
              className="edition-team-banner"
            />
            <TeamContent />
          </div>
        )}
      </div>
    </div>
  );
};

export default YearView2025;

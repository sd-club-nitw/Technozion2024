import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebCanvas } from "../bg_animation/bg_animate";
import Poster from "../event_scroll/poster";
import { events2026 } from "./eventsData";
import "../PastEvents/PastEvents.css";
import "../event_scroll/index.css";

const CATEGORY_TABS = [
  { key: "all", label: "ALL" },
  { key: "competition", label: "COMPETITIONS" },
  { key: "funevent", label: "FUN EVENTS" },
  { key: "demonstration", label: "DEMONSTRATIONS" },
];

export const EventsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEvents = events2026.filter((ev) => {
    if (selectedCategory === "all") return true;
    const typeLower = (ev.event_type || "").toLowerCase();
    if (selectedCategory === "competition") {
      return typeLower.includes("competition");
    }
    if (selectedCategory === "funevent") {
      return typeLower.includes("fun");
    }
    if (selectedCategory === "demonstration") {
      return typeLower.includes("demonstration");
    }
    return true;
  });

  const handlePosterClick = (item) => {
    navigate("/card", {
      state: {
        ...item,
        imgsrc: item.imgsrc || "",
        glink: item.glink || "",
        returnPath: "/events",
      },
    });
  };

  return (
    <div className="past-events-root">
      <div className="past-events-canvas">
        <WebCanvas />
      </div>

      <div className="edition-view-container">
        {/* Top Header Bar */}
        <div className="edition-topbar">
          <div className="edition-topbar-row">
            <div className="edition-badge-container">
              <h1 className="edition-title-badge">Technozion 2026</h1>
              <span className="edition-year-pill">EVENTS</span>
            </div>

            {/* Category Filter Tabs */}
            <div className="tabs my-0">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`tab-button ${
                    selectedCategory === tab.key ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(tab.key)}
                  aria-pressed={selectedCategory === tab.key}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="edition-content-body">
          <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-8 lg:gap-y-10 lg:m-6 m-3">
            {filteredEvents.map((item, index) => (
              <Poster
                key={item.index || index}
                imageSrc={item.imgsrc || ""}
                fallbackSrc=""
                title={item.title}
                content={item.name}
                onClick={() => handlePosterClick(item)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

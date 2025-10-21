import React, { useState } from "react";
import { motion } from "framer-motion";
import { WebCanvas } from "../bg_animation/bg_animate";
import { useNavigate } from "react-router-dom";

import Event from "./Event.png";
import Portal from "./newPortal.png";
import Flame from "./Flame.png";
import ClubImg from "./Club.jpg";
import SpotImg from "./Spot.jpg";
import DeptImg from "./Dept.jpg";

import "./index.css";

const TABS = [
  { key: "club", label: "CLUB", dataSource: "clubevents", bg: ClubImg },
  { key: "spotlight", label: "SPOTLIGHT", dataSource: "spotlight", bg: SpotImg },
  { key: "department", label: "DEPARTMENT", dataSource: "societies", bg: DeptImg },
];

const Events = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("club"); // default active
  const [flame, setFlame] = useState(false);

  // keep the same 'card click' feel: flash flame then navigate
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setFlame(true);

    // show flame briefly then navigate (timings follow original pattern)
    setTimeout(() => setFlame(false), 700);
    const tab = TABS.find((t) => t.key === tabKey);
    if (!tab) return;

    setTimeout(() => {
      navigate("/Index", { state: { dataSource: tab.dataSource } });
    }, 900);
  };

  const activeTabObj = TABS.find((t) => t.key === activeTab);

  return (
    <>
  

      <div className="events-container">
        {/* top Event logo */}
        <div className="EventImg">
          <img src={Event} alt="Event" />
        </div>

        {/* neon framed area */}
        <div className="events-frame">
          {/* tabs row */}
          <motion.div
            className="tabs-row"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {TABS.map((tab) => (
              <motion.button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => handleTabClick(tab.key)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* content panel (uses the selected tab's background image for look) */}
          <div
            className="tab-panel"
            style={{
              backgroundImage: activeTabObj && activeTabObj.bg ? `url(${activeTabObj.bg})` : "none",
            }}
          >
            <div className="panel-overlay">
              <h2 className="panel-title">{activeTabObj?.label}</h2>
              <p className="panel-sub">
                {activeTab === "club"
                  ? "Explore club events and activities."
                  : activeTab === "spotlight"
                  ? "Spotlight events and highlights."
                  : "Department level events and notices."}
              </p>

              <div className="panel-actions">
                <button
                  className="enter-btn"
                  onClick={() => {
                    // same enter behavior as clicking the tab
                    handleTabClick(activeTab);
                  }}
                >
                  Enter
                </button>
              </div>
            </div>
          </div>

          {/* portal + flame remain at the bottom */}
          {/* <div className="Portal">
            <img src={Portal} alt="Portal" className="portal-img" />
            <motion.img
              src={Flame}
              alt="Flame"
              className="Flame-img"
              initial={{ opacity: 0 }}
              animate={{ opacity: flame ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Events;

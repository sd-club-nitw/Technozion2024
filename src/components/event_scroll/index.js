import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Poster from "./poster.js";
import { Loader } from "../Loader/index.js";
import "./index.css";
import { WebCanvas } from "../bg_animation/bg_animate.js";
import imgsrc from "./tzcomingsoon.png"; // Fallback image
import dept from "./dept_poster_page.png";
import club from "./club_event_page.png";
import spotlight from "./spot_event_page.png";

const TABS = [
  { key: "societies", label: "DEPARTMENT" },
  { key: "spotlight", label: "SPOTLIGHT" },
  { key: "clubevents", label: "CLUB" },
  { key: "projects", label: "PROJECTS EXPO" },
];

function Index() {
  const location = useLocation();
  const navigate = useNavigate();

  // pick initial tab from URL ?tab=..., then location.state?.dataSource, then default to 'societies'
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || location.state?.dataSource || "societies";
  };

  const [selectedTab, setSelectedTab] = useState(getInitialTab);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [headingImage, setHeadingImage] = useState(null);
  const [error, setError] = useState(null);

  // Keep selectedTab in sync if the URL or location.state changes (e.g., user navigates / bookmarks)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabFromSearch = params.get("tab");
    const tabFromState = location.state?.dataSource;

    const preferred = tabFromSearch || tabFromState;
    if (preferred && preferred !== selectedTab) {
      setSelectedTab(preferred);
    }
    // note: we intentionally do not force a change if preferred is falsy,
    // so the current selectedTab (maybe user-chosen) remains.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.state]);

  // When selectedTab changes, update the URL query param so the route persists the tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("tab") !== selectedTab) {
      params.set("tab", selectedTab);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        if (selectedTab === "societies") {
          response = await fetch("/dataJSON/societyx.json");
          setHeadingImage(dept);
        } else if (selectedTab === "spotlight") {
          response = await fetch("/dataJSON/spotlight.json");
          setHeadingImage(spotlight);
        } else if (selectedTab === "clubevents") {
          response = await fetch("/dataJSON/club.json");
          setHeadingImage(club);
        } else if (selectedTab === "projects") {
          response = await fetch("/dataJSON/workshop.json");
          setHeadingImage(club);
        } else {
          // fallback
          response = await fetch("/dataJSON/spotlight.json");
          setHeadingImage(spotlight);
        }

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        if (!isMounted) return;
        setData(result);
      } catch (err) {
        console.error("Error loading data:", err);
        if (!isMounted) return;
        setError(err.message || "Unknown error");
        setData([]);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedTab]);

  // click to card page
  const handlePosterClick = (item) => {
    navigate("/card", {
      state: { ...item, imgsrc: item.imgsrc || imgsrc, glink: item.glink },
    });
  };

  const renderSocieties = () => {
    return data.map((society) => (
      <div key={society.societyName}>
        <h2 className="society-heading">{society.societyName}</h2>
        <div className="flex justify-center items-center">
          <div
            className={
              "grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1  gap-4 lg:m-10 m-5 place-content-center justify-items-center"
            }
          >
            {society.events?.map((event, index) => (
              <Poster
                key={index}
                imageSrc={event.imgsrc}
                fallbackSrc={imgsrc}
                title={event.title}
                content={event.name}
                onClick={() => handlePosterClick(event)}
              />
            ))}
          </div>
        </div>
      </div>
    ));
  };

  // UI states
  if (isLoading) return <Loader />;
  if (error) return <div className="fetch-error">Error: {error}</div>;
  if (!data || (Array.isArray(data) && data.length === 0))
    return <div className="fetch-error">No data available</div>;

  return (
    <div className="outer-container">
      <div className="poster-canvas">
        <WebCanvas />
      </div>

      {/* Tabs row */}
      <div className="tabs-wrapper mt-20 lg:mt-28 sm:mt-28 md:mt-28">
        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tab-button ${
                selectedTab === tab.key ? "active" : ""
              }`}
              onClick={() => setSelectedTab(tab.key)}
              aria-pressed={selectedTab === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="inner-container">
        {selectedTab === "societies" ? (
          renderSocieties()
        ) : (
          <div
            className="grid lg:grid-cols-5 md:grid-cols-3 
          sm:grid-cols-2 grid-cols-1 gap-4 lg:m-10 m-5 place-content-center 
          justify-items-center"
          >
            {data.map((item, index) => (
              <Poster
                key={index}
                imageSrc={item.imgsrc}
                fallbackSrc={imgsrc}
                title={item.title}
                content={item.name}
                onClick={() => handlePosterClick(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;

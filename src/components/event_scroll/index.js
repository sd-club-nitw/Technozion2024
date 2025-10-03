import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Poster from './poster.js';
import { Loader } from '../Loader/index.js'; // Import your loader
import './index.css';
import { WebCanvas } from '../bg_animation/bg_animate.js';
import imgsrc from './tzcomingsoon.png'; // Fallback image
import dept from './dept_poster_page.png';
import club from './club_event_page.png';
import spotlight from './spot_event_page.png';

const TABS = [
  { key: 'societies', label: 'DEPARTMENT' },
  { key: 'spotlight', label: 'SPOTLIGHT' },
  { key: 'clubevents', label: 'CLUB' },
];

function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {};

  const initialTab = state?.dataSource || 'spotlight';
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [headingImage, setHeadingImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        if (selectedTab === 'societies') {
          response = await fetch('/dataJSON/societyx.json');
          setHeadingImage(dept);
        } else if (selectedTab === 'spotlight') {
          response = await fetch('/dataJSON/spotlight.json');
          setHeadingImage(spotlight);
        } else if (selectedTab === 'clubevents') {
          response = await fetch('/dataJSON/club.json');
          setHeadingImage(club);
        } else {
          // fallback (shouldn't happen)
          response = await fetch('/dataJSON/spotlight.json');
          setHeadingImage(spotlight);
        }

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        if (!isMounted) return;
        setData(result);
      } catch (err) {
        console.error('Error loading data:', err);
        if (!isMounted) return;
        setError(err.message || 'Unknown error');
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
    navigate('/card', { state: { ...item, imgsrc: item.imgsrc || imgsrc, glink: item.glink } });
  };

  const renderSocieties = () => {
    // Expecting data to be an array of societies with events
    return data.map((society) => (
      <div key={society.societyName}>
        <h2 className="society-heading">{society.societyName}</h2>
        <div className="poster-container">
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
    ));
  };

  // UI states
  if (isLoading) return <Loader />;
  if (error) return <div className="fetch-error">Error: {error}</div>;
  if (!data || (Array.isArray(data) && data.length === 0)) return <div className="fetch-error">No data available</div>;

  return (
    <div className="outer-container">
      <div className="poster-canvas">
        <WebCanvas />
      </div>

      {/* Tabs row */}
      <div className="tabs-wrapper">
        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tab-button ${selectedTab === tab.key ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab.key)}
              aria-pressed={selectedTab === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heading image */}
      {/* <div className="heading">
        {headingImage && (
          <img src={headingImage} alt="eventtype" className="heading-image" />
        )}
      </div> */}

      <div className="inner-container">
        {selectedTab === 'societies' ? renderSocieties() : (
          <div className="poster-container">
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

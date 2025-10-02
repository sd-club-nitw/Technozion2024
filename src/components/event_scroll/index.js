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

function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {};
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [headingImage, setHeadingImage] = useState(null); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (state && state.dataSource === 'societies') {
          response = await fetch('/dataJSON/societyx.json');
          setHeadingImage(dept); 
        } else if (state && state.dataSource === 'spotlight') {
          response = await fetch('/dataJSON/spotlight.json');
          setHeadingImage(spotlight); // Set heading image to spotlight
        } else if (state && state.dataSource === 'clubevents') {
          response = await fetch('/dataJSON/club.json');
          setHeadingImage(club); // Set heading image to club
        }

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result);
        setIsLoading(false); // Set loading to false after successful fetch
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error.message); // Set error message if fetching fails
        setIsLoading(false); // Still stop the loader after error
      }
    };

    fetchData();
  }, [state]);

  // Display loader while fetching
  if (isLoading) {
    return <Loader />;
  }

  // Display error message if fetching failed
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Display when no data is available
  if (!data.length) {
    return <p>No data available</p>;
  }

  // Function to handle poster click
  const handlePosterClick = (item) => {
    // Always pass the original image src and glink
    navigate('/card', { state: { ...item, imgsrc: item.imgsrc || imgsrc, glink: item.glink } });
  };

  // Render society posters
  const renderSocieties = () => {
    return data.map((society) => (
      <div key={society.societyName}>
        <h2 className="society-heading">{society.societyName}</h2>
        <div className="poster-container">
          {society.events?.map((event, index) => (
            <Poster
              key={index}
              imageSrc={event.imgsrc} // Pass the event's imgsrc
              fallbackSrc={imgsrc} // Pass fallback image in case of error
              title={event.title}
              content={event.name}
              onClick={() => handlePosterClick(event)}
            />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="outer-container">
      <div className="poster-canvas">
        <WebCanvas />
      </div>
      <div className="heading">
        {headingImage && (
          <img src={headingImage} alt="eventtype" className="heading-image" />
        )}
      </div>
      <div className="inner-container">
        {state && state.dataSource === 'societies' ? renderSocieties() : (
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

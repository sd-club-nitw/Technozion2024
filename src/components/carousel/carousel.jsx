import React, { useState, useEffect } from 'react';
import Card from '../card/card.jsx'; // Importing the Card component
import './carousel.css'; // Carousel styles
import { WebCanvas } from '../bg_animation/bg_animate.js';
import imgsrc from './tzcomingsoon.png';

const Carousel = ({ data }) => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (data && data.length > 0) {
      setCards(data); // Set the data from props only the first time
    }
  }, [data]); 

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  // Add a guard clause to prevent accessing undefined cards
  if (cards.length === 0) {
    return <p>No data available</p>; // Display a message if no data is available
  }

  return (
    <>
      <div className="carousel-canvas">
        <WebCanvas /> 
      </div>
      <div className="carousel">
        <button onClick={prevCard} className="carousel-button prev">«</button>
        <div className="carousel-content">
          <Card
          
            title={cards[currentIndex]?.title || cards[currentIndex]?.name}

            
            description={cards[currentIndex]?.description}

           
            

            
            contact={cards[currentIndex]?.contact}

            // Fallback image, if imgSrc is not available, use a default one
            imgSrc={cards[currentIndex]?.imgSrc || imgsrc}
          />
        </div>
        <button onClick={nextCard} className="carousel-button next">»</button>
      </div>
    </>
  );
};

export default Carousel;

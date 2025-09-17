import React, { useEffect, useState } from 'react';
import './team.css'; 
import { WebCanvas } from "../bg_animation/bg_animate";
import Teams from './Teams.png';
import { motion } from 'framer-motion';

export const Team = () => {
  const [data, setData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoverStates, setHoverStates] = useState([]);

  useEffect(() => {
    fetch('./TeamData.json')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setHoverStates(new Array(data.length).fill(false));
      }) 
      .catch((error) => console.error('Error fetching JSON:', error));
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGridTemplate = (data) => { 
    let rows = []; 
    let index = 0; 
    const isMobile = windowWidth < 786;

    while (index < data.length) { 
      if (isMobile) { 
        rows.push([data[index]]); 
        index += 1; 
      } else { 
        rows.push([data[index], data[index + 1]]); 
        index += 2; 
      } 
    } 
    return rows; 
  }; 

  const gridTemplate = getGridTemplate(data);

  const handleMouseEnter = (index) => {
    setHoverStates((prev) => {
      const newHoverStates = [...prev];
      newHoverStates[index] = true;
      return newHoverStates;
    });
  };
  
  const handleMouseLeave = (index) => {
    setHoverStates((prev) => {
      const newHoverStates = [...prev];
      newHoverStates[index] = false;
      return newHoverStates;
    });
  };

  return (
    <div className="Teams">
      <div className="web-canvas">
        <WebCanvas />
      </div>
      <img src={Teams} alt="teams" className='mainteams'/>
       
      <div className="list">
        <div className="row-container">
        <a 
  href="https://mail.google.com/mail/?view=cm&fs=1&to=dean_sa@nitw.ac.in" 
  target="_blank" 
  className='person'
>
 dean_sa@nitw.ac.in
</a>

<a 
  href="https://mail.google.com/mail/?view=cm&fs=1&to=sac_president@nitw.ac.in" 
  target="_blank" 
   className='person'>
  sac_president@nitw.ac.in
</a>
        </div>
        <div className="additional-image-container">
          <p className='sacimg'>SECRETARY</p>
        </div>

        {gridTemplate.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div className={`grid-row ${row.length === 1 ? 'one-item' : rowIndex % 2 === 0 ? 'two-item-even' : 'two-item-odd'}`}>
              {row.map((person, personIndex) =>
                person?.name ? (
                  <div
                    className="person"
                    key={personIndex}
                    id={`person-${rowIndex}-${personIndex}`}
                    onMouseEnter={() => handleMouseEnter(rowIndex * 2 + personIndex)}
                    onMouseLeave={() => handleMouseLeave(rowIndex * 2 + personIndex)}
                  >
                    <motion.div 
                      className="personImage"
                      animate={hoverStates[rowIndex * 2 + personIndex] ? { y: '-52%', x: '0%',scale:1.2 } : { y: '0%', x: '0%',scale:1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img 
                        src={`/teamImages/${person.image}`} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', margin: '0', borderRadius: '50%' }} 
                      />
                    </motion.div>

                    {!hoverStates[rowIndex * 2 + personIndex] && windowWidth > 510 ? (
                      <motion.div
                        className="personDetails"
                        animate={{ y: '0%', x: '0%' }} // No motion needed for the initial state
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {person.position && <h1>{person.position}</h1>}
                        <h2 className="font-bold">{person.name}</h2>
                        <p className="person-contact">{person.contact}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="person-info"
                        animate={hoverStates[rowIndex * 2 + personIndex] ? { y: '0%', x: '0%',opacity:1 } : { y: '-0%', x: '0%',opacity:1 }}
                        transition={{ type: "spring", stiffness:300 }}
                      >
                        {person.position && <p><strong>{person.position}</strong></p>}
                        <p><strong>Name:</strong> {person.name}</p>
                        {/* <p><strong>Contact:</strong> {person.contactNo}</p> */}
                        {person.email && <p>  <strong>Email:</strong> 
  <a 
    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${person.email}`} 
    target="_blank" 
    rel="noopener noreferrer"

  >
    {person.email}
  </a></p>}
                      </motion.div>
                    )}
                  </div>
                ) : null
              )}
            </div>
            
            {/* Additional image rendering logic */}
            {(((windowWidth > 786) && rowIndex === 1) || ((windowWidth < 786 && rowIndex === 3))) && (
              <div className="additional-image-container">
                <p className='sacimg'>JOINT SECRETARY</p>
              </div>
            )}
            {(((windowWidth > 786) && rowIndex === 3) || ((windowWidth < 786 && rowIndex === 7))) && (
              <div className="additional-image-container">
                <p className='sacimg'>DEVELOPERS</p>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

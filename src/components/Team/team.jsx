import React, { useEffect, useState } from 'react';
import './team.css'; 
import { WebCanvas } from "../bg_animation/bg_animate";
import Teams from './Teams.png';
import { motion } from 'framer-motion';
import { MdEmail } from "react-icons/md";
import TeamCrad from "./TeamCrad";
  import ProfileCard from '../ProfileCardAnimation/ProfileCard'

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


  return (
    <div className="Teams">

        <WebCanvas />
     <section className="absolute top-0 overflow-y-scroll h-screen">

      {/* <img src={Teams} alt="teams" className='mainteams lg:mt-36 mt-24 lg:scale-100 scale-90 sm:mt-28'/> */}
       <section className="lg:text-8xl  text-center text-rise event-heading md:text-6xl text-5xl  w-full  lg:py-10 py-5  mt-20 lg:mt-24 sm:mt-28 md:mt-28">
      {"TEAM".split("").map((ch, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{ch}</span>
      ))}
     </section>
       
      <div className="list">
     <section className="flex flex-col items-center justify-center mb-10">
      <h1 className="lg:text-5xl sm:text-4xl text-3xl  uppercase font-bold">Chief Patron</h1>
      {data?.chief_patrons?.map((member, index) => (
        
        <TeamCrad src={`/teamImages/${member.image}`} key={index} name={member.name} position={member.position} />
      ))}
     </section>
      <section className="flex flex-col items-center justify-center mb-10">
      <h1 className="lg:text-5xl sm:text-4xl text-3xl  uppercase font-bold">Patrons</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {data?.patrons?.map((member, index) => (
        
        <TeamCrad src={`/teamImages/${member.image}`} key={index} email={member.email} name={member.name} position={member.position} />
      ))}
      </div>
     </section>
     <section className="flex flex-col items-center justify-center mb-10">
      <h1 className="lg:text-5xl sm:text-4xl text-3xl  uppercase font-bold">Student Council</h1>
    <h2 className="lg:text-3xl text-xl uppercase lg:my-5 xs:my-3">General Secretaries</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {data?.student_council?.general_secretaries?.map((member, index) => (
        
        <TeamCrad src={`/teamImages/${member.image}`} name={member.name} position={member.position} />
      ))}
      </div>
      <br />
    <h2 className="lg:text-3xl text-xl uppercase lg:my-5 xs:my-3">Joint Secretaries</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {data?.student_council?.joint_secretaries?.map((member, index) => (
        
        <TeamCrad src={`/teamImages/${member.image}`} name={member.name} position={member.position} />
      ))}
      </div>
     </section>


{/* web team  */}
      <section className="flex flex-col items-center justify-center mb-10">
      <h1 className="lg:text-5xl sm:text-4xl text-3xl  uppercase font-bold">Web Team</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
    

      {data?.web_team?.map((member, index) => (
        
        
        
        
        
        
        
        
        <TeamCrad src={`/teamImages/${member.image}`} name={member.name} position={member.position} />
      ))}
      </div>
     </section>

       
      </div>
      </section>
    </div>
  );
};

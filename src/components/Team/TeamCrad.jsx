import React from "react";
import "./TeamCrad.css";

const TeamCard = ({ src, name, position, email = "" }) => {
  return (
    <>
      <div className="teamcard-wrapper">
        <div className="teamcard-title">{position}</div>

        <div className="teamcard">
          <img src={src} alt={name} />
        </div>

        <div className="teamcard-info">
          <p className="teamcard-name">{name}</p>
          {email && <p className="teamcard-email">{email}</p>}
        </div>
      </div>
    </>
  );
};

export default TeamCard;

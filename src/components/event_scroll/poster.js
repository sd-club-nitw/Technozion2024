import React from "react";
import "./poster.css"; // Assuming you have some styles for Poster
import PosterSkeleton from "../Skeleton/PosterSkeleton";

const Poster = ({ imageSrc, fallbackSrc, title, content, onClick }) => {
  const handleError = (e) => {
    e.target.src = fallbackSrc; // Set fallback image if the original fails
  };

  return (
    <div className="poster flex flex-col" onClick={onClick}>
      <PosterSkeleton
        src={imageSrc}
        alt={title}
        className=" rounded-md mb-2"
        onError={handleError}
      />
      {/* <img src={imageSrc} alt={title} onError={handleError} className="poster-image" /> */}

      <div className="flex flex-col justify-end flex-1">
        <h3 className="font-bold">{title}</h3>
        <p className="opacity-70">{content}</p>
      </div>
    </div>
  );
};

export default Poster;

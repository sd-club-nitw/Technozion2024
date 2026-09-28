import React from "react";
import "./poster.css"; // Assuming you have some styles for Poster
import PosterSkeleton from "../Skeleton/PosterSkeleton";

const Poster = ({ imageSrc, fallbackSrc, title, content, prize, onClick }) => {
  const handleError = (e) => {
    e.target.src = fallbackSrc; // Set fallback image if the original fails
  };

  return (
    <div className="poster flex flex-col cursor-pointer" onClick={onClick}>
      <div className="relative">
        <PosterSkeleton
          src={imageSrc}
          alt={title}
          className=" rounded-md mb-2"
          onError={handleError}
        />
        <span className="poster-view">View</span>
      </div>

      <div className="flex flex-col justify-end min-h-[3.75rem]">
        <h3 className="font-bold line-clamp-1">{title}</h3>
        <p className="opacity-70 text-xs sm:text-sm line-clamp-1">{content}</p>
        {prize && (
          <span className="text-xs font-semibold text-cyan-300 mt-1">
            {prize}
          </span>
        )}
      </div>
    </div>
  );
};

export default Poster;

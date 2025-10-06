import React from 'react';
import './poster.css'; // Assuming you have some styles for Poster
import PosterSkeleton from "../Skeleton/PosterSkeleton";

const Poster = ({ imageSrc, fallbackSrc, title, content, onClick }) => {
  const handleError = (e) => {
    e.target.src = fallbackSrc; // Set fallback image if the original fails
  };

  return (
    <div className="poster" onClick={onClick}>
      <PosterSkeleton src={imageSrc} alt={title} className="poster-image" onError={handleError} />
      {/* <img src={imageSrc} alt={title} onError={handleError} className="poster-image" /> */}
     <div>
<div className="flex flex-col">

      <h3 className='font-bold'>{title}</h3>
      <p className='opacity-70'>{content}</p>
</div>
     </div>
    </div>
  );
};

export default Poster;

import React, { useState } from "react";

function PosterSkeleton({ src, alt, className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);

  // Handles image load error
  return (
    <div className="relative w-full aspect-[4/5]  rounded-lg bg-gray-800">
      {!loaded && (
        <div className="absolute inset-0  animate-pulse max-h-full bg-slate-800  bg-opacity-75" />
      )}

      <img
        {...props}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={
          (" w-full aspect-[4/5] object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0 ") + className // merge user-provided classes
        }
      />
    </div>
  );
}

export default PosterSkeleton;

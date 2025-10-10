import React, { useState } from "react";

const CopyWrapper = ({ text, children, className = "" }) => {
  const [show, setShow] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setShow(true);
      setTimeout(() => setShow(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} onClick={handleCopy}>
      {children}
      {show && (
        <div className="absolute -top-8 -left-3/4 -translate-x-1/2 bg-gray text-white text-sm px-2 py-1 rounded">
          Copied!
        </div>
      )}
    </div>
  );
};

export default CopyWrapper;

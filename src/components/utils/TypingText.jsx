import React, { useState, useEffect } from "react";

export default function TypingText({ text, speed = 100 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) clearInterval(typeInterval);
    }, speed);

    return () => clearInterval(typeInterval);
  }, [text, speed]);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      {displayedText}
      <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
    </span>
  );
}

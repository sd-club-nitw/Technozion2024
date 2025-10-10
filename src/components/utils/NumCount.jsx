
import React, { useEffect, useRef, useState } from 'react'

function NumCount({num, className=''}) {
    const [currNum, setCurrNum] = useState(0)
     
     useEffect(() => {
    const duration = 3000; // 3 seconds
    const endValue = num;
    const stepTime = 10; // ms per update
    const increment = endValue / (duration / stepTime);


    const timer = setInterval(() => {
      setCurrNum((prev) => {
        if (prev + increment >= endValue) {
          clearInterval(timer);
        

        
          return endValue;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, []);
  return (
    <>
   
    <span className={className}>
        {Math.floor(currNum).toLocaleString()}
        </span>
    </>
  )
}

export default NumCount

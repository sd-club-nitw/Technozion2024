import React from 'react';
import Galaxy from '../bg_animation/Galaxy';
import { WebCanvas } from '../bg_animation/bg_animate';

export const ComingSoon = () => {
  return (
    <div className="relative">
      <WebCanvas />

      <div className='absolute top-0 w-[100vw]'>
        <div className="about-container w-full z-2 relative p-4 text-white">
          <div className="flex items-center justify-center h-screen text-white">
            <div className="text-center">
              <span className="text-5xl font-bold mb-4 uppercase animate-pulse cursor-pointer">
                Coming Soon
              </span>
              <p className="text-lg text-gray-300">
                We’re working hard to bring you something amazing. Stay tuned!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 

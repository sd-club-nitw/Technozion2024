import React from "react";

const TeamCard = ({ src, name, position, email = "" }) => {
  return (
    <div className="relative group p-4">
      
      {/* Container for the whole card with padding to prevent overlap */}
      <div className="relative w-full">
        
        {/* Top-left colored corner (appears on hover) */}
        <div 
          className="absolute top-0 left-0 w-12 h-12 bg-[#00ffff] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        ></div>
        
        {/* Bottom-right colored corner (appears on hover) */}
        <div 
          className="absolute bottom-0 right-0 w-12 h-12 bg-[#7b00ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        ></div>
        
        {/* Main card */}
        <div 
          className="relative bg-[#121212] overflow-hidden transition-all duration-500 group-hover:scale-95"
          style={{
            clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)'
          }}
        >
          
          {/* Gold corner - top left */}
          <div 
            className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#ffd700] to-[#b8860b] z-10"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          ></div>
          
          {/* Gold corner - bottom right */}
          <div 
            className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#ffd700] to-[#b8860b] z-10"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
          ></div>
          
          {/* Image */}
          <div className="relative h-80 overflow-hidden">
            <img
              src={src}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
          </div>
          
          {/* Info section */}
          <div className="p-6 bg-[#0a0a0a]">
            
            {/* Position */}
            <div 
              className="inline-block px-4 py-2 bg-[#7b00ff] mb-3"
              style={{
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)'
              }}
            >
              <p className="text-[10px] uppercase tracking-widest text-[#f9f9f9] font-bold">
                {position}
              </p>
            </div>
            
            {/* Name with different hover effect */}
            <h3 className="text-2xl font-black text-[#f9f9f9] mb-2 relative overflow-hidden group-hover:tracking-wider transition-all duration-500">
              <span className="relative inline-block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00ffff] group-hover:via-[#9633ff] group-hover:to-[#00ffff] transition-all duration-500">
                {name}
              </span>
              {/* Underline that appears on hover */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00ffff] group-hover:w-full transition-all duration-700"></span>
            </h3>
            
            {/* Divider */}
            <div className="h-px bg-[#2a2a2a] mb-3"></div>
            
            {/* Email */}
            {email && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-[#00ffff] rounded-full"></div>
                <p className="text-xs text-[#4ef0ff]/70">{email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;

import React from 'react';
import { Mail, Phone, Globe, Cpu, Binary } from 'lucide-react';

interface CardProps {
  title: string;
  description?: string;
  contact?: string;
  imgSrc: string;
}

const Card: React.FC<CardProps> = ({ title, description, contact, imgSrc }) => {
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 rounded-xl overflow-hidden shadow-2xl border border-cyan-500/30 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10h20M30 10v20M30 30h20M50 30v20M50 50h20" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-cyan-400"/>
              <circle cx="30" cy="10" r="2" fill="currentColor" className="text-cyan-400"/>
              <circle cx="30" cy="30" r="2" fill="currentColor" className="text-cyan-400"/>
              <circle cx="50" cy="30" r="2" fill="currentColor" className="text-cyan-400"/>
              <circle cx="50" cy="50" r="2" fill="currentColor" className="text-cyan-400"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400/50" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/50" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400/50" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-400/50" />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

      <div className="relative w-full h-3/5 overflow-hidden bg-gradient-to-br from-gray-900 to-black border-b border-cyan-500/30">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan" />

        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />

        <div className="absolute top-4 right-4 text-cyan-400/40">
          <Cpu className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3 text-cyan-400/30 text-xs font-mono">
            <Binary className="w-4 h-4" />
            <span>01001010</span>
          </div>

          <h2 className="text-2xl font-bold text-cyan-400 mb-2 tracking-wide uppercase font-mono drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{title}</h2>
          {description && (
            <p className="text-gray-300 text-sm leading-relaxed font-light">{description}</p>
          )}
        </div>

        {contact && (
          <div className="mt-4 flex items-center gap-2 text-sm text-cyan-400/80 font-mono border-t border-cyan-500/20 pt-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            {contact.includes('@') ? (
              <Mail className="w-4 h-4" />
            ) : contact.includes('http') ? (
              <Globe className="w-4 h-4" />
            ) : (
              <Phone className="w-4 h-4" />
            )}
            <span className="truncate">{contact}</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/50 backdrop-blur-sm border-t border-cyan-500/30 flex items-center px-4 gap-4 text-xs font-mono text-cyan-400/60">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span>ONLINE</span>
        </div>
        <div className="flex-1 h-1 bg-gradient-to-r from-cyan-500/20 via-cyan-500/50 to-cyan-500/20 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-cyan-400/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Card;

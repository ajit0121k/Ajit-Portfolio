import React from 'react';

export default function MarqueeRibbon() {
  const items = [
    'ARCHITECTURE',
    'FULL-STACK MERN',
    'DISTRIBUTED SYSTEMS',
    'ZERO-TRUST SECURITY',
    'CLOUD DEVOPS',
    'HIGH PERFORMANCE',
    'DATABASE OPTIMIZATION',
    'CLEAN CODE',
  ];

  return (
    <div className="py-7 my-8 border-y border-[#dfd6c7] dark:border-white/10 overflow-hidden select-none bg-[#2d3a2e] text-[#f5f0e8] shadow-inner">
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {Array.from({ length: 4 }).flatMap((_, setIdx) =>
          items.map((item, idx) => (
            <div key={`${setIdx}-${idx}`} className="flex items-center gap-6 mx-5">
              <span className="text-xl sm:text-3xl font-serif font-black tracking-widest text-[#f5f0e8] uppercase">
                {item}
              </span>
              {/* Sunburst Rosette Separator */}
              <svg className="w-6 h-6 text-[#c66a3d] opacity-90 flex-shrink-0 animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100" fill="currentColor">
                {Array.from({ length: 16 }).map((_, i) => (
                  <rect
                    key={i}
                    x="48"
                    y="10"
                    width="4"
                    height="26"
                    rx="2"
                    transform={`rotate(${i * 22.5} 50 50)`}
                  />
                ))}
              </svg>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

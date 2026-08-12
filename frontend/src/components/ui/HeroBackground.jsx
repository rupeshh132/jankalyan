import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './HeroBackground.css';

export const HeroBackground = ({ className = '' }) => {
  const { theme } = useTheme();
  
  if (theme !== 'dark') return null;

  return (
    <div 
      className={className} 
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
    >
      {/* Noise */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, opacity: 0.05, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      {/* Vignette (Z-index 2, Middle - sits ON TOP of blobs to guarantee text contrast) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'radial-gradient(circle at center, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.95) 90%)' }} />

      {/* Blobs (Z-index 1, Bottom) */}
      <div style={{ 
        position: 'absolute', width: '50vw', height: '50vw', maxWidth: '750px', maxHeight: '750px', 
        top: '-5%', left: '-5%', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.55, zIndex: 1,
        background: 'radial-gradient(circle at center, #ffb703 0%, #fb8500 40%, transparent 70%)',
        animation: 'drift1 18s ease-in-out infinite alternate'
      }} />
      <div style={{ 
        position: 'absolute', width: '55vw', height: '55vw', maxWidth: '850px', maxHeight: '850px', 
        top: '5%', right: '-10%', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.55, zIndex: 1,
        background: 'radial-gradient(circle at center, #38d9d0 0%, #0891b2 45%, transparent 70%)',
        animation: 'drift2 22s ease-in-out infinite alternate'
      }} />
    </div>
  );
};

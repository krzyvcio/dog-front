
import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Maximum distance to pull down in pixels
  const PULL_THRESHOLD = 80;
  // Resistance factor (higher = harder to pull)
  const RESISTANCE = 0.5;

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull if we are at the top of the scroll container
    // We check window.scrollY or the container's scrollTop depending on layout.
    // In this app layout, usually the parent div scrolls. 
    // We will rely on the parent container's scrollTop passed via ref or parent check,
    // but typically touch start Y is enough if we check scroll position in move.
    
    // Check if parent is scrolled to top
    const parent = containerRef.current?.parentElement;
    if (parent && parent.scrollTop === 0 && !refreshing) {
      setStartY(e.touches[0].clientY);
    } else {
      setStartY(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0 || refreshing) return;

    const y = e.touches[0].clientY;
    const diff = y - startY;

    // Only allow pulling down
    if (diff > 0) {
       // Check parent scroll again to be sure
       const parent = containerRef.current?.parentElement;
       if (parent && parent.scrollTop <= 0) {
         // Prevent default only if we are actually pulling to refresh to avoid native scrolling interference
         // Note: e.preventDefault() in passive listeners is ignored, so we rely on CSS touch-action often.
         setCurrentY(diff * RESISTANCE);
       }
    }
  };

  const handleTouchEnd = async () => {
    if (startY === 0 || refreshing) return;

    if (currentY > PULL_THRESHOLD) {
      setRefreshing(true);
      setCurrentY(60); // Snap to loading position
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setCurrentY(0);
        setStartY(0);
      }
    } else {
      setCurrentY(0);
      setStartY(0);
    }
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        transform: `translateY(${currentY}px)`, 
        transition: refreshing ? 'transform 0.2s' : currentY === 0 ? 'transform 0.3s' : 'none' 
      }}
      className="relative min-h-full"
    >
      {/* Loading Indicator */}
      <div 
        className="absolute left-0 right-0 flex justify-center pointer-events-none"
        style={{ 
          top: -40, 
          opacity: currentY > 10 ? Math.min(currentY / PULL_THRESHOLD, 1) : 0 
        }}
      >
        <div className="bg-white p-2 rounded-full shadow-md border border-gray-100">
          <RefreshCw 
            size={20} 
            className={`text-primary ${refreshing ? 'animate-spin' : ''}`} 
            style={{ transform: `rotate(${currentY * 2}deg)` }}
          />
        </div>
      </div>
      
      {children}
    </div>
  );
};

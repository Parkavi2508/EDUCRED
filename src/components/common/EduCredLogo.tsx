import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const EduCredLogo: React.FC<LogoProps> = ({ className = '', showTagline = true, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const tagSize = size === 'sm' ? 'text-[9px]' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Stylized Book Icon matching image.png */}
      <div className={`relative ${iconSize} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Left book page - Warm Gold */}
          <path
            d="M17 9.5C13 9 7 10 5 11.5V26.5C7 25 13 24 17 24.5V9.5Z"
            fill="#F7D794"
          />
          {/* Right book page - Navy */}
          <path
            d="M19 9.5C23 9 29 10 31 11.5V26.5C29 25 23 24 19 24.5V9.5Z"
            fill="#192A56"
          />
          {/* Book Spine / Bookmark - Soft Coral */}
          <path
            d="M17 7C17 6.4 17.4 6 18 6C18.6 6 19 6.4 19 7V27C19 27.6 18.6 28 18 28C17.4 28 17 27.6 17 27V7Z"
            fill="#EDA6A3"
          />
          <path
            d="M18 25L15.5 28.5H20.5L18 25Z"
            fill="#EDA6A3"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-[#192A56] leading-none ${textSize}`}>
          EduCred
        </span>
        {showTagline && (
          <span className={`text-slate-500 font-medium tracking-tight mt-0.5 whitespace-nowrap ${tagSize}`}>
            Make Every Contribution Visible.
          </span>
        )}
      </div>
    </div>
  );
};

import { memo } from 'react';
import { useAssets } from '../lib/assetContext';

const Logo = memo(({ 
  className = "", 
  hideText = false, 
  textColor = "#f84c4c",
  size = "w-16 h-16",
  assetKey = "header_logo"
}: { 
  className?: string;
  hideText?: boolean;
  textColor?: string;
  size?: string;
  assetKey?: string;
}) => {
  const { overrides } = useAssets();
  const override = overrides[assetKey];

  if (override?.isActive) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className={`${size} relative`}>
          <img 
            src={override.url} 
            alt="Logo" 
            className="w-full h-full object-contain" 
            width="64"
            height="64"
            loading="eager"
          />
        </div>
        {!hideText && (
          <div className="flex flex-col items-center mt-1">
            <span className="font-bold text-center text-[10px] leading-tight tracking-[0.1em] uppercase" style={{ color: textColor }}>
              Statistics By
            </span>
            <span className="font-black text-center text-xl leading-none uppercase" style={{ color: textColor }}>
              SG
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${size} relative`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Blue Triangle Roof */}
          <path d="M28 15L15 28H41L28 15Z" fill="#3b82f6" stroke="#000" strokeWidth="1.5" />
          {/* Green Block */}
          <rect x="20" y="28" width="15" height="15" fill="#14b8a6" stroke="#000" strokeWidth="1.5" />
          
          {/* White Arch Base - Symmetrized */}
          <path d="M15 43H55V65" fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M15 43V65" fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
          
          {/* Corrected Arch - centered at x=35 */}
          <path d="M25 65C25 50 45 50 45 65" fill="none" stroke="#000" strokeWidth="1.5" />
          
          {/* Fills for the base (separate from stroke to allow missing bottom line) */}
          <path d="M15 43H55V65H45C45 50 25 50 25 65H15V43Z" fill="#fff" />
          
          {/* Bottom lines except under the arch */}
          <path d="M15 65H25" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M45 65H55" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />

          {/* Middle Red Bar */}
          <rect x="40" y="15" width="10" height="28" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
          
          {/* Right Orange Bar */}
          <rect x="62" y="15" width="10" height="50" fill="#f97316" stroke="#000" strokeWidth="1.5" />
        </svg>
      </div>
      {!hideText && (
        <div className="flex flex-col items-center -mt-2">
          <span className="font-bold text-center text-[10px] leading-tight tracking-[0.1em] uppercase" style={{ color: textColor }}>
            Statistics By
          </span>
          <span className="font-black text-center text-xl leading-none uppercase" style={{ color: textColor }}>
            SG
          </span>
        </div>
      )}
    </div>
  );
});

export default Logo;

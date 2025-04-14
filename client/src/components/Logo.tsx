import React from "react";
import pranjaLogoNew from "../assets/pranaja-logo-new.png";

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 8, className = "" }) => {
  const sizeClass = `w-${size} h-${size}`;
  
  return (
    <div className={`${sizeClass} ${className}`}>
      <img 
        src={pranjaLogoNew} 
        alt="PRANAJA ARISHAF STUDIO Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;

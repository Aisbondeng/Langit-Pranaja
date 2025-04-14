import React from "react";
import Logo from "./Logo";

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-DEFAULT">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white font-montserrat mb-2">
          PRANAJA ARISHAF STUDIO
        </h1>
        <div className="w-16 h-16 mx-auto mb-4">
          <Logo size={16} />
        </div>
        <p className="text-gray-400">Loading your music experience...</p>
        <div className="w-48 h-1 mt-4 mx-auto bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse rounded-full" 
            style={{ width: '70%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

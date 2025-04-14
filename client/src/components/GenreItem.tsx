import React from "react";
import { useLocation } from "wouter";

interface GenreItemProps {
  genre: string;
  imageUrl: string;
}

const GenreItem: React.FC<GenreItemProps> = ({ genre, imageUrl }) => {
  const [, setLocation] = useLocation();
  
  const handleClick = () => {
    // Navigate to browse page with genre filter
    setLocation(`/browse?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <div className="genre-item cursor-pointer" onClick={handleClick}>
      <div className="relative rounded-lg overflow-hidden h-24">
        <img 
          src={imageUrl} 
          alt={`${genre} music`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3">
          <h3 className="text-white font-bold">{genre}</h3>
        </div>
      </div>
    </div>
  );
};

export default GenreItem;

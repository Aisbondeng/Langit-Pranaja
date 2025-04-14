import React from "react";
import { Track } from "@shared/schema";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";

interface TrackItemProps {
  track: Track;
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  
  const handleClick = () => {
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  const defaultCover = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop";

  return (
    <div className="track-item group cursor-pointer" onClick={handleClick}>
      <div className="relative rounded-lg overflow-hidden mb-2">
        <img 
          src={track.albumArt || defaultCover} 
          alt={`${track.album} cover`} 
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            {isCurrentTrack && isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      <h3 className="text-white font-medium truncate">{track.title}</h3>
      <p className="text-sm text-gray-400 truncate">{track.artist}</p>
    </div>
  );
};

export default TrackItem;

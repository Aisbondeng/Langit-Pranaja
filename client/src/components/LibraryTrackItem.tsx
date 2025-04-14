import React from "react";
import { Track } from "@shared/schema";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { usePlaylist } from "../contexts/PlaylistContext";
import { Menu, MenuItem } from "@/components/ui/dropdown-menu";

interface LibraryTrackItemProps {
  track: Track;
}

const LibraryTrackItem: React.FC<LibraryTrackItemProps> = ({ track }) => {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();
  const { playlists, addTrackToPlaylist } = usePlaylist();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  
  const handleClick = () => {
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (duration?: number) => {
    if (!duration) return "--:--";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const defaultCover = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=100&fit=crop";

  return (
    <div 
      className={`flex items-center p-3 hover:bg-dark-lighter rounded-md cursor-pointer ${isCurrentTrack ? 'bg-dark-lighter bg-opacity-70' : ''}`}
      onClick={handleClick}
    >
      <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
        <img 
          src={track.albumArt || defaultCover} 
          alt="Song cover" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate ${isCurrentTrack ? 'text-secondary' : 'text-white'}`}>
          {track.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">
          {track.artist} {track.album ? `• ${track.album}` : ""}
        </p>
      </div>
      <div className="text-gray-400 text-sm ml-4">{formatDuration(track.duration)}</div>
      <div className="relative ml-4">
        <button 
          className="p-2 text-gray-400 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            // This would open a dropdown menu in a real implementation
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LibraryTrackItem;

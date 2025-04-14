import React from "react";
import { Playlist, Track } from "@shared/schema";
import { useLocation } from "wouter";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";

interface PlaylistItemProps {
  playlist: Playlist;
  tracks?: Track[];
  duration?: string;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist, tracks = [], duration = "" }) => {
  const [, setLocation] = useLocation();
  const { playPlaylist } = useAudioPlayer();
  
  const handleClick = () => {
    setLocation(`/playlist/${playlist.id}`);
  };
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tracks.length > 0) {
      playPlaylist(tracks);
    }
  };
  
  const defaultCover = "https://images.unsplash.com/photo-1541832676-9b763b0239a6?w=300&h=300&fit=crop";

  return (
    <div className="playlist-item group cursor-pointer bg-dark-lighter rounded-lg p-4 flex items-center" onClick={handleClick}>
      <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
        <img 
          src={playlist.coverArt || defaultCover} 
          alt="Playlist cover" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate">{playlist.name}</h3>
        <p className="text-sm text-gray-400">
          {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
          {duration && ` • ${duration}`}
        </p>
      </div>
      <button 
        className="ml-2 p-2 rounded-full hover:bg-dark-DEFAULT text-gray-400 hover:text-white"
        onClick={handlePlayClick}
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
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
          />
        </svg>
      </button>
    </div>
  );
};

export default PlaylistItem;

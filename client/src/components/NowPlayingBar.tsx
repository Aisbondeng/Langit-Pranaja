import React, { useState } from "react";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";

const NowPlayingBar: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    skipToPrevious, 
    skipToNext,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute
  } = useAudioPlayer();
  
  // Format time from seconds to MM:SS
  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calculate progress for the progress bar
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle progress bar change
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseFloat(e.target.value);
    seek(newPosition * duration / 100);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
  };

  return (
    <div className="bg-dark-DEFAULT border-t border-dark-lighter bg-opacity-95 backdrop-blur-md z-10">
      {/* Mobile Player Controls */}
      {currentTrack && (
        <div className="p-3 flex md:hidden items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded overflow-hidden mr-3">
              <img 
                src={currentTrack.albumArt || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop"} 
                alt="Now playing album cover" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">{currentTrack.title}</h4>
              <p className="text-gray-400 text-xs">{currentTrack.artist}</p>
            </div>
          </div>
          <div className="flex items-center">
            <button className="text-white p-2" onClick={skipToPrevious}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12.066 11.2l5.334-4A1 1 0 0019 6.466V17.54a1 1 0 01-1.6.8l-5.333-4zM4.066 11.2l5.334-4A1 1 0 0011 6.466V17.54a1 1 0 01-1.6.8l-5.334-4z"
                />
              </svg>
            </button>
            <button
              className="bg-white rounded-full w-10 h-10 flex items-center justify-center mx-2"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-dark-DEFAULT"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-dark-DEFAULT"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </button>
            <button className="text-white p-2" onClick={skipToNext}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.933 12.8l-5.334 4A1 1 0 015 17.066V6.934a1 1 0 011.6-.8l5.333 4zM19.933 12.8l-5.334 4A1 1 0 0113 17.066V6.934a1 1 0 011.6-.8l5.334 4z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Full Player */}
      {currentTrack && (
        <div className="hidden md:flex items-center px-4 py-2">
          {/* Now Playing Information */}
          <div className="flex items-center w-1/4">
            <div className="w-14 h-14 rounded overflow-hidden mr-3">
              <img
                src={currentTrack.albumArt || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop"}
                alt="Now playing album cover"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-white font-medium">{currentTrack.title}</h4>
              <p className="text-gray-400 text-sm">{currentTrack.artist} {currentTrack.album ? `• ${currentTrack.album}` : ""}</p>
            </div>
            <button className="ml-4 text-gray-400 hover:text-white">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="flex items-center mb-1">
              <button className="text-gray-400 hover:text-white p-2">
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
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>
              <button
                className="text-gray-400 hover:text-white p-2 mx-2"
                onClick={skipToPrevious}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12.066 11.2l5.334-4A1 1 0 0019 6.466V17.54a1 1 0 01-1.6.8l-5.333-4zM4.066 11.2l5.334-4A1 1 0 0011 6.466V17.54a1 1 0 01-1.6.8l-5.334-4z"
                  />
                </svg>
              </button>
              <button
                className="bg-white rounded-full w-10 h-10 flex items-center justify-center mx-2"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-dark-DEFAULT"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-dark-DEFAULT"
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
              <button
                className="text-gray-400 hover:text-white p-2 mx-2"
                onClick={skipToNext}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.933 12.8l-5.334 4A1 1 0 015 17.066V6.934a1 1 0 011.6-.8l5.333 4zM19.933 12.8l-5.334 4A1 1 0 0113 17.066V6.934a1 1 0 011.6-.8l5.334 4z"
                  />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white p-2">
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
            <div className="w-full flex items-center">
              <span className="text-xs text-gray-400 mr-2">{formatTime(currentTime)}</span>
              <div className="flex-1 mx-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                  className="player-progress w-full h-1 bg-dark-lighter rounded-full appearance-none cursor-pointer"
                />
              </div>
              <span className="text-xs text-gray-400 ml-2">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Extra Controls */}
          <div className="w-1/4 flex items-center justify-end">
            <button className="text-gray-400 hover:text-white p-2">
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
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white p-2 mx-2">
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
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </button>
            <div className="flex items-center ml-2">
              <button
                className="text-gray-400 hover:text-white"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
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
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      clipRule="evenodd"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : volume < 0.5 ? (
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
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      clipRule="evenodd"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.536 8.464a5 5 0 010 7.072"
                    />
                  </svg>
                ) : (
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
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                )}
              </button>
              <div className="w-24 mx-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  className="volume-control w-full h-1 bg-dark-lighter rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NowPlayingBar;

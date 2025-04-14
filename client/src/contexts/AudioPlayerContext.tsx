import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { Track } from "@shared/schema";

interface AudioPlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (track: Track) => void;
  playPlaylist: (tracks: Track[]) => void;
  togglePlayPause: () => void;
  pause: () => void;
  play: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [previousVolume, setPreviousVolume] = useState<number>(0.7);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Set initial volume
    audio.volume = volume;

    // Audio event listeners
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => skipToNext();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      // In a real implementation, we would use the actual file path
      // Here we're using a simulated approach since we can't actually
      // load local files in this environment
      const audio = audioRef.current;
      audio.src = currentTrack.filePath || "";
      audio.load();
      
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Playback error:", error);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrack]);

  // Update audio element when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Add to queue if not already in queue
    const trackIndex = queue.findIndex(t => t.id === track.id);
    if (trackIndex === -1) {
      setQueue([...queue, track]);
      setCurrentIndex(queue.length);
    } else {
      setCurrentIndex(trackIndex);
    }
  };

  const playPlaylist = (tracks: Track[]) => {
    if (tracks.length > 0) {
      setQueue(tracks);
      setCurrentIndex(0);
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (currentTrack) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Playback error:", error);
          });
        }
      }
    }
  };

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  };

  const play = () => {
    if (audioRef.current && !isPlaying && currentTrack) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback error:", error);
        });
      }
    }
  };

  const skipToNext = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentTrack(queue[nextIndex]);
    } else if (queue.length > 0 && currentIndex === queue.length - 1) {
      // Loop back to the beginning
      setCurrentIndex(0);
      setCurrentTrack(queue[0]);
    }
  };

  const skipToPrevious = () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentTrack(queue[prevIndex]);
    } else if (queue.length > 0 && currentIndex === 0) {
      // Loop to the end
      const lastIndex = queue.length - 1;
      setCurrentIndex(lastIndex);
      setCurrentTrack(queue[lastIndex]);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (newVolume >= 0 && newVolume <= 1) {
      setVolume(newVolume);
      if (isMuted && newVolume > 0) {
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
    }
  };

  const addToQueue = (track: Track) => {
    setQueue([...queue, track]);
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(-1);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playTrack,
        playPlaylist,
        togglePlayPause,
        pause,
        play,
        skipToNext,
        skipToPrevious,
        seek,
        setVolume: handleVolumeChange,
        toggleMute,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerContext;

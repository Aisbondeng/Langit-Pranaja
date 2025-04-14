import React, { createContext, useState, useContext, useEffect } from "react";
import { Playlist, InsertPlaylist, PlaylistTrack, Track } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useLibrary } from "./LibraryContext";

interface PlaylistContextType {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  loading: boolean;
  createPlaylist: (name: string) => Promise<Playlist>;
  deletePlaylist: (id: number) => Promise<void>;
  updatePlaylist: (id: number, data: Partial<Playlist>) => Promise<Playlist>;
  addTrackToPlaylist: (playlistId: number, trackId: number, position?: number) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: number, trackId: number) => Promise<void>;
  getPlaylistTracks: (playlistId: number) => Track[];
  setCurrentPlaylist: (playlist: Playlist | null) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};

// Demo data for initial testing
const demoPlaylists: Playlist[] = [
  {
    id: 1,
    name: "Workout Mix",
    userId: 1,
    createdAt: new Date().toISOString(),
    coverArt: "https://images.unsplash.com/photo-1541832676-9b763b0239a6?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Chill Evening",
    userId: 1,
    createdAt: new Date().toISOString(),
    coverArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Focus & Study",
    userId: 1,
    createdAt: new Date().toISOString(),
    coverArt: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=300&h=300&fit=crop",
  },
];

// Demo playlist tracks
const demoPlaylistTracks: { [key: number]: number[] } = {
  1: [1, 3, 5, 7], // Workout Mix contains tracks 1, 3, 5, 7
  2: [2, 4, 6], // Chill Evening contains tracks 2, 4, 6
  3: [8], // Focus & Study contains track 8
};

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { tracks } = useLibrary();
  const [playlists, setPlaylists] = useState<Playlist[]>(demoPlaylists);
  const [playlistTracks, setPlaylistTracks] = useState<{ [key: number]: number[] }>(demoPlaylistTracks);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load playlists on component mount
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        setLoading(true);
        // In a real app, we'd fetch from the API
        // For now, we'll use our demo data
        setPlaylists(demoPlaylists);
      } catch (error) {
        console.error("Error loading playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  const createPlaylist = async (name: string): Promise<Playlist> => {
    try {
      setLoading(true);
      
      // In a real app, we'd send this to the backend
      // For now, just simulate creating a new playlist
      const newPlaylist: Playlist = {
        id: Math.max(0, ...playlists.map((p) => p.id)) + 1,
        name,
        userId: 1, // Hardcoded for demo
        createdAt: new Date().toISOString(),
        coverArt: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=200&fit=crop", // Default cover
      };
      
      setPlaylists((prev) => [...prev, newPlaylist]);
      setPlaylistTracks((prev) => ({ ...prev, [newPlaylist.id]: [] }));
      
      return newPlaylist;
    } catch (error) {
      console.error("Error creating playlist:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      
      // In a real app, we'd send this to the backend
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      
      // Also remove from playlistTracks
      setPlaylistTracks((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      
      // If current playlist is deleted, reset it
      if (currentPlaylist?.id === id) {
        setCurrentPlaylist(null);
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePlaylist = async (
    id: number,
    data: Partial<Playlist>
  ): Promise<Playlist> => {
    try {
      setLoading(true);
      
      // In a real app, we'd send this to the backend
      const updatedPlaylist = playlists.find((p) => p.id === id);
      if (!updatedPlaylist) {
        throw new Error(`Playlist with ID ${id} not found`);
      }
      
      const updated = { ...updatedPlaylist, ...data };
      
      setPlaylists((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      
      // Update current playlist if it's the one being updated
      if (currentPlaylist?.id === id) {
        setCurrentPlaylist(updated);
      }
      
      return updated;
    } catch (error) {
      console.error("Error updating playlist:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addTrackToPlaylist = async (
    playlistId: number,
    trackId: number,
    position?: number
  ): Promise<void> => {
    try {
      setLoading(true);
      
      // In a real app, we'd send this to the backend
      setPlaylistTracks((prev) => {
        const currentTracks = prev[playlistId] || [];
        
        // Skip if track is already in playlist
        if (currentTracks.includes(trackId)) {
          return prev;
        }
        
        const newTracks = [...currentTracks];
        
        if (position !== undefined && position >= 0 && position <= newTracks.length) {
          newTracks.splice(position, 0, trackId);
        } else {
          newTracks.push(trackId);
        }
        
        return { ...prev, [playlistId]: newTracks };
      });
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeTrackFromPlaylist = async (
    playlistId: number,
    trackId: number
  ): Promise<void> => {
    try {
      setLoading(true);
      
      // In a real app, we'd send this to the backend
      setPlaylistTracks((prev) => {
        const currentTracks = prev[playlistId] || [];
        return {
          ...prev,
          [playlistId]: currentTracks.filter((id) => id !== trackId),
        };
      });
    } catch (error) {
      console.error("Error removing track from playlist:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPlaylistTracks = (playlistId: number): Track[] => {
    const trackIds = playlistTracks[playlistId] || [];
    return trackIds
      .map((id) => tracks.find((track) => track.id === id))
      .filter((track): track is Track => !!track);
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        currentPlaylist,
        loading,
        createPlaylist,
        deletePlaylist,
        updatePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        getPlaylistTracks,
        setCurrentPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;

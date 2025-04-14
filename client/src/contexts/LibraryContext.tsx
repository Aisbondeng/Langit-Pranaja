import React, { createContext, useState, useContext, useEffect } from "react";
import { Track, InsertTrack } from "@shared/schema";
import { useFileSystem } from "../hooks/useFileSystem";
import { parseMetadata } from "../lib/metadataParser";
import { apiRequest } from "@/lib/queryClient";

interface Album {
  name: string;
  artist: string;
  albumArt?: string;
}

interface LibraryContextType {
  tracks: Track[];
  recentlyPlayed: Track[];
  albums: Album[];
  artists: string[];
  genres: string[];
  isLoading: boolean;
  importMusic: (files: File[]) => Promise<void>;
  addToLibrary: (track: InsertTrack) => Promise<Track>;
  getTracksByArtist: (artist: string) => Track[];
  getTracksByAlbum: (album: string) => Track[];
  getTracksByGenre: (genre: string) => Track[];
  addToRecentlyPlayed: (track: Track) => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};

// Demo data for initial testing
const demoTracks: Track[] = [
  {
    id: 1,
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: 243,
    filePath: "https://example.com/audio/midnight-city.mp3",
    genre: "Electronic",
    year: "2011",
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop",
    userId: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    filePath: "https://example.com/audio/blinding-lights.mp3",
    genre: "Pop",
    year: "2020",
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop",
    userId: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Circles",
    artist: "Post Malone",
    album: "Hollywood's Bleeding",
    duration: 215,
    filePath: "https://example.com/audio/circles.mp3",
    genre: "Pop",
    year: "2019",
    albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop",
    userId: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Bad Guy",
    artist: "Billie Eilish",
    album: "When We All Fall Asleep, Where Do We Go?",
    duration: 194,
    filePath: "https://example.com/audio/bad-guy.mp3",
    genre: "Pop",
    year: "2019",
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
    userId: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Dancing in the Moonlight",
    artist: "Toploader",
    album: "Onka's Big Moka",
    duration: 232,
    filePath: "https://example.com/audio/dancing-in-the-moonlight.mp3",
    genre: "Rock",
    year: "2000",
    albumArt: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=100&fit=crop",
    userId: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Feel Good Inc",
    artist: "Gorillaz",
    album: "Demon Days",
    duration: 221,
    filePath: "https://example.com/audio/feel-good-inc.mp3",
    genre: "Hip Hop",
    year: "2005",
    albumArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=100&h=100&fit=crop",
    userId: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 7,
    title: "Take on Me",
    artist: "a-ha",
    album: "Hunting High and Low",
    duration: 226,
    filePath: "https://example.com/audio/take-on-me.mp3",
    genre: "Pop",
    year: "1985",
    albumArt: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=100&h=100&fit=crop",
    userId: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 8,
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    album: "Uptown Special",
    duration: 270,
    filePath: "https://example.com/audio/uptown-funk.mp3",
    genre: "Funk",
    year: "2014",
    albumArt: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=100&h=100&fit=crop",
    userId: 1,
    addedAt: new Date().toISOString(),
  },
];

// This is a temporary solution since we can't actually access the file system in this environment
export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tracks, setTracks] = useState<Track[]>(demoTracks);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isSupported } = useFileSystem();

  // Initialize library data
  useEffect(() => {
    const initializeLibrary = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, we would fetch data from the backend
        // For now, we'll just use our demo data

        // Extract unique albums
        const uniqueAlbums = Array.from(
          new Set(tracks.map((track) => `${track.album}||${track.artist}`))
        ).map((key) => {
          const [name, artist] = key.split("||");
          return {
            name,
            artist,
            albumArt: tracks.find((t) => t.album === name)?.albumArt,
          };
        });

        // Extract unique artists
        const uniqueArtists = Array.from(
          new Set(tracks.map((track) => track.artist))
        ).filter(Boolean) as string[];

        // Extract unique genres
        const uniqueGenres = Array.from(
          new Set(tracks.map((track) => track.genre))
        ).filter(Boolean) as string[];

        setAlbums(uniqueAlbums);
        setArtists(uniqueArtists);
        setGenres(uniqueGenres);
        
        // In a real app, we would fetch recently played tracks from the API
        const recentlyPlayedTracks = tracks.slice(0, 4);
        setRecentlyPlayed(recentlyPlayedTracks);
      } catch (error) {
        console.error("Error initializing library:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLibrary();
  }, []);

  const importMusic = async (files: File[]) => {
    try {
      setIsLoading(true);
      const newTracks: Track[] = [];
      const userId = 1; // For demo purposes

      for (const file of files) {
        try {
          // Extract metadata from audio file
          const metadata = await parseMetadata(file);
          
          // Create a new track
          const newTrack: InsertTrack = {
            title: metadata.title || file.name,
            artist: metadata.artist || "Unknown Artist",
            album: metadata.album || "Unknown Album",
            duration: metadata.duration || 0,
            filePath: URL.createObjectURL(file), // In a real app, we'd upload to the server
            genre: metadata.genre || "Unknown",
            year: metadata.year || "",
            albumArt: metadata.albumArt || "",
            userId,
            addedAt: new Date().toISOString(),
          };
          
          // In a real app, we'd save to the backend
          const addedTrack = await addToLibrary(newTrack);
          newTracks.push(addedTrack);
        } catch (error) {
          console.error("Error processing file:", file.name, error);
        }
      }

      // Update state with new tracks
      if (newTracks.length > 0) {
        setTracks((prevTracks) => [...prevTracks, ...newTracks]);
        
        // Update albums, artists, and genres
        const updatedAlbums = Array.from(
          new Set([...tracks, ...newTracks].map((track) => `${track.album}||${track.artist}`))
        ).map((key) => {
          const [name, artist] = key.split("||");
          return {
            name,
            artist,
            albumArt: [...tracks, ...newTracks].find((t) => t.album === name)?.albumArt,
          };
        });
        
        const updatedArtists = Array.from(
          new Set([...tracks, ...newTracks].map((track) => track.artist))
        ).filter(Boolean) as string[];
        
        const updatedGenres = Array.from(
          new Set([...tracks, ...newTracks].map((track) => track.genre))
        ).filter(Boolean) as string[];
        
        setAlbums(updatedAlbums);
        setArtists(updatedArtists);
        setGenres(updatedGenres);
      }
      
      return newTracks;
    } catch (error) {
      console.error("Error importing music:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addToLibrary = async (track: InsertTrack): Promise<Track> => {
    try {
      // In a real app, we'd send the track to the backend
      // For demo purposes, we'll simulate adding it locally
      const newId = Math.max(0, ...tracks.map((t) => t.id)) + 1;
      const newTrack: Track = { ...track, id: newId };
      
      return newTrack;
    } catch (error) {
      console.error("Error adding track to library:", error);
      throw error;
    }
  };

  const getTracksByArtist = (artist: string): Track[] => {
    return tracks.filter((track) => 
      track.artist?.toLowerCase() === artist.toLowerCase()
    );
  };

  const getTracksByAlbum = (album: string): Track[] => {
    return tracks.filter((track) => 
      track.album?.toLowerCase() === album.toLowerCase()
    );
  };

  const getTracksByGenre = (genre: string): Track[] => {
    return tracks.filter((track) => 
      track.genre?.toLowerCase() === genre.toLowerCase()
    );
  };

  const addToRecentlyPlayed = async (track: Track): Promise<void> => {
    try {
      // In a real app, we'd send this to the backend
      // For now, just update the local state
      setRecentlyPlayed((prev) => {
        // Remove if already in list
        const filtered = prev.filter((t) => t.id !== track.id);
        // Add to beginning
        return [track, ...filtered].slice(0, 10);
      });
    } catch (error) {
      console.error("Error adding to recently played:", error);
      throw error;
    }
  };

  return (
    <LibraryContext.Provider
      value={{
        tracks,
        recentlyPlayed,
        albums,
        artists,
        genres,
        isLoading,
        importMusic,
        addToLibrary,
        getTracksByArtist,
        getTracksByAlbum,
        getTracksByGenre,
        addToRecentlyPlayed,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export default LibraryContext;

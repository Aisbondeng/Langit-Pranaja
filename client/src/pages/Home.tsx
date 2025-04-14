import React, { useState } from "react";
import { useLibrary } from "../contexts/LibraryContext";
import { usePlaylist } from "../contexts/PlaylistContext";
import TrackItem from "../components/TrackItem";
import PlaylistItem from "../components/PlaylistItem";
import GenreItem from "../components/GenreItem";
import CreatePlaylistDialog from "../components/CreatePlaylistDialog";

const Home: React.FC = () => {
  const { recentlyPlayed, tracks, genres } = useLibrary();
  const { playlists, getPlaylistTracks } = usePlaylist();
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);

  // Genre images
  const genreImages = {
    "Pop": "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=200&fit=crop",
    "Rock": "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=200&fit=crop",
    "Hip Hop": "https://images.unsplash.com/photo-1557787163-1635e2efb160?w=400&h=200&fit=crop",
    "Electronic": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=200&fit=crop",
    "Jazz": "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=200&fit=crop",
    "Classical": "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=200&fit=crop",
    "R&B": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
    "Country": "https://images.unsplash.com/photo-1605722243979-fe0be8158232?w=400&h=200&fit=crop"
  };

  // Get the first 4 genres or use defaults if not enough
  const displayGenres = genres.length >= 4 
    ? genres.slice(0, 4) 
    : ["Pop", "Rock", "Hip Hop", "Electronic"].slice(0, 4);

  return (
    <div className="px-4 py-5">
      {/* Tagline Section */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-amber-900/30 to-transparent p-4 rounded-lg border-l-4 border-amber-500">
          <p className="text-amber-100 italic font-medium">
            "Musik Bukan Sekadar Suara. Ia Adalah Emosi, Kenangan, dan Harapan — Hadir Bersama Pranaja Arishaf Studio"
          </p>
        </div>
      </section>
      
      {/* Recently Played Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white font-montserrat mb-4">
          Recently Played
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recentlyPlayed.length > 0 ? (
            recentlyPlayed.slice(0, 6).map((track) => (
              <TrackItem key={track.id} track={track} />
            ))
          ) : (
            <p className="text-gray-400 col-span-full py-4">
              Your recently played tracks will appear here.
            </p>
          )}
        </div>
      </section>

      {/* Your Playlists */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white font-montserrat mb-4">
          Your Playlists
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => {
            const playlistTracks = getPlaylistTracks(playlist.id);
            const totalDuration = playlistTracks.reduce((total, track) => total + (track.duration || 0), 0);
            const hours = Math.floor(totalDuration / 3600);
            const minutes = Math.floor((totalDuration % 3600) / 60);
            const durationText = hours > 0 
              ? `${hours} hr ${minutes} min` 
              : `${minutes} min`;
              
            return (
              <PlaylistItem 
                key={playlist.id} 
                playlist={playlist} 
                tracks={playlistTracks}
                duration={durationText}
              />
            );
          })}
          
          {/* Create New Playlist Button */}
          <div 
            className="playlist-item cursor-pointer bg-dark-lighter bg-opacity-50 rounded-lg p-4 flex items-center justify-center border-2 border-dashed border-gray-700 hover:border-secondary"
            onClick={() => setCreatePlaylistOpen(true)}
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-dark-DEFAULT rounded-full flex items-center justify-center mb-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-secondary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
              </div>
              <p className="text-gray-300 font-medium">Create Playlist</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Genre */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white font-montserrat mb-4">
          Browse by Genre
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayGenres.map((genre) => (
            <GenreItem 
              key={genre} 
              genre={genre} 
              imageUrl={genreImages[genre as keyof typeof genreImages] || genreImages["Pop"]} 
            />
          ))}
        </div>
      </section>
      
      {/* Create Playlist Dialog */}
      <CreatePlaylistDialog 
        open={createPlaylistOpen} 
        onOpenChange={setCreatePlaylistOpen} 
      />
    </div>
  );
};

export default Home;

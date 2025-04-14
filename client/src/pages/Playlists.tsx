import React, { useState } from "react";
import { usePlaylist } from "../contexts/PlaylistContext";
import PlaylistItem from "../components/PlaylistItem";
import CreatePlaylistDialog from "../components/CreatePlaylistDialog";
import { Button } from "@/components/ui/button";

const Playlists: React.FC = () => {
  const { playlists, getPlaylistTracks } = usePlaylist();
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white font-montserrat">Your Playlists</h1>
        <Button
          onClick={() => setCreatePlaylistOpen(true)}
          className="bg-secondary hover:bg-secondary-dark text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
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
          Create Playlist
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {playlists.length > 0 ? (
          playlists.map((playlist) => {
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
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <h3 className="font-bold text-white text-lg mb-2">No playlists yet</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Create your first playlist to organize your favorite songs
            </p>
            <Button
              onClick={() => setCreatePlaylistOpen(true)}
              className="bg-secondary hover:bg-secondary-dark text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              Create Playlist
            </Button>
          </div>
        )}
      </div>

      <CreatePlaylistDialog 
        open={createPlaylistOpen}
        onOpenChange={setCreatePlaylistOpen}
      />
    </div>
  );
};

export default Playlists;

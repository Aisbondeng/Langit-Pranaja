import React, { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { usePlaylist } from "../contexts/PlaylistContext";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { useLibrary } from "../contexts/LibraryContext";
import LibraryTrackItem from "../components/LibraryTrackItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Track } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const PlaylistDetail: React.FC = () => {
  const [, params] = useRoute<{ id: string }>("/playlist/:id");
  const playlistId = parseInt(params?.id || "0");
  
  const { toast } = useToast();
  const { playlists, getPlaylistTracks, updatePlaylist, deletePlaylist, removeTrackFromPlaylist, addTrackToPlaylist } = usePlaylist();
  const { tracks } = useLibrary();
  const { playPlaylist } = useAudioPlayer();
  
  const [playlist, setPlaylist] = useState<any>(null);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addTrackDialogOpen, setAddTrackDialogOpen] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<number[]>([]);
  const [availableTracks, setAvailableTracks] = useState<Track[]>([]);

  useEffect(() => {
    // Find playlist by id
    const foundPlaylist = playlists.find(p => p.id === playlistId);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      setEditedName(foundPlaylist.name);
      
      // Get tracks in this playlist
      const tracks = getPlaylistTracks(playlistId);
      setPlaylistTracks(tracks);
      
      // Calculate available tracks (those not in the playlist)
      const playlistTrackIds = tracks.map(t => t.id);
      const availableTracks = tracks.filter(t => !playlistTrackIds.includes(t.id));
      setAvailableTracks(availableTracks);
    }
  }, [playlistId, playlists, getPlaylistTracks]);

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) {
      playPlaylist(playlistTracks);
      
      toast({
        title: "Playing playlist",
        description: `Now playing ${playlist?.name}`,
      });
    } else {
      toast({
        title: "Empty Playlist",
        description: "Add some tracks to this playlist first",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(playlistId);
      toast({
        title: "Playlist Deleted",
        description: `Successfully deleted "${playlist?.name}"`,
      });
      window.history.back();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete playlist",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (editedName.trim() === "") {
      toast({
        title: "Invalid Name",
        description: "Playlist name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updatePlaylist(playlistId, { name: editedName });
      setIsEditing(false);
      toast({
        title: "Playlist Updated",
        description: "Playlist name updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update playlist",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTrack = async (trackId: number) => {
    try {
      await removeTrackFromPlaylist(playlistId, trackId);
      
      // Update the local state
      setPlaylistTracks(prev => prev.filter(t => t.id !== trackId));
      
      toast({
        title: "Track Removed",
        description: "Track removed from playlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove track from playlist",
        variant: "destructive",
      });
    }
  };

  const handleToggleTrackSelection = (trackId: number) => {
    setSelectedTracks(prev => {
      if (prev.includes(trackId)) {
        return prev.filter(id => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  };

  const handleAddSelectedTracks = async () => {
    if (selectedTracks.length === 0) {
      toast({
        title: "No Tracks Selected",
        description: "Please select at least one track to add",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const trackId of selectedTracks) {
        await addTrackToPlaylist(playlistId, trackId);
      }

      // Refresh playlist tracks
      const updatedTracks = getPlaylistTracks(playlistId);
      setPlaylistTracks(updatedTracks);
      
      // Update available tracks
      const playlistTrackIds = updatedTracks.map(t => t.id);
      setAvailableTracks(tracks.filter(t => !playlistTrackIds.includes(t.id)));
      
      // Clear selection
      setSelectedTracks([]);
      
      // Close dialog
      setAddTrackDialogOpen(false);
      
      toast({
        title: "Tracks Added",
        description: `Added ${selectedTracks.length} track(s) to playlist`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tracks to playlist",
        variant: "destructive",
      });
    }
  };

  const totalDuration = playlistTracks.reduce((total, track) => {
    return total + (track.duration || 0);
  }, 0);
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  if (!playlist) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading playlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5">
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
          <img 
            src={playlist.coverArt || "https://images.unsplash.com/photo-1541832676-9b763b0239a6?w=300&h=300&fit=crop"} 
            alt={playlist.name} 
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="text-gray-400 text-sm uppercase tracking-wider">Playlist</span>
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2 mb-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-bold text-white bg-dark-lighter border-secondary"
                autoFocus
              />
              <Button 
                onClick={handleSaveEdit}
                className="bg-secondary hover:bg-secondary-dark"
              >
                Save
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setEditedName(playlist.name);
                }}
                className="bg-transparent border-gray-600 text-white hover:bg-dark-DEFAULT"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{playlist.name}</h1>
          )}
          
          <div className="text-gray-400 mb-4">
            {playlistTracks.length} {playlistTracks.length === 1 ? 'song' : 'songs'} • {formatDuration(totalDuration)}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handlePlayAll}
              className="bg-secondary hover:bg-secondary-dark text-white"
              disabled={playlistTracks.length === 0}
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
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                />
              </svg>
              Play All
            </Button>
            
            {!isEditing && (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="bg-transparent border-gray-600 text-white hover:bg-dark-DEFAULT"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                  />
                </svg>
                Edit
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="bg-transparent border-gray-600 text-white hover:bg-dark-DEFAULT"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
              Delete
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Songs</h2>
        <Button 
          onClick={() => setAddTrackDialogOpen(true)}
          className="bg-dark-lighter hover:bg-dark-DEFAULT text-white"
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
          Add Tracks
        </Button>
      </div>
      
      {playlistTracks.length > 0 ? (
        <div className="space-y-1">
          {playlistTracks.map((track) => (
            <div key={track.id} className="relative group">
              <LibraryTrackItem track={track} />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-lighter text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveTrack(track.id)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
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
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <h3 className="font-bold text-white text-lg mb-2">No songs in this playlist yet</h3>
          <p className="text-gray-400 mb-6 max-w-md">
            Add some songs to start enjoying your playlist
          </p>
          <Button 
            onClick={() => setAddTrackDialogOpen(true)}
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
            Add Tracks
          </Button>
        </div>
      )}
      
      {/* Delete Playlist Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-dark-lighter text-white border-dark-lighter">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Delete Playlist</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete "{playlist.name}"? This action cannot be undone.
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="bg-transparent border-gray-600 text-white hover:bg-dark-DEFAULT"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePlaylist}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tracks Dialog */}
      <Dialog open={addTrackDialogOpen} onOpenChange={setAddTrackDialogOpen}>
        <DialogContent className="bg-dark-lighter text-white border-dark-lighter max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Add Tracks to Playlist</DialogTitle>
          </DialogHeader>
          
          {availableTracks.length > 0 ? (
            <div className="space-y-2 py-4">
              {availableTracks.map((track) => (
                <div key={track.id} className="flex items-center py-2 px-3 hover:bg-dark-DEFAULT rounded-md">
                  <Checkbox 
                    id={`track-${track.id}`}
                    checked={selectedTracks.includes(track.id)}
                    onCheckedChange={() => handleToggleTrackSelection(track.id)}
                    className="mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={`track-${track.id}`} className="text-white cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={track.albumArt || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=100&fit=crop"} 
                            alt="Song cover" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <h3 className="font-medium truncate">{track.title}</h3>
                          <p className="text-sm text-gray-400 truncate">{track.artist} {track.album ? `• ${track.album}` : ""}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-400 mb-4">
                All your tracks are already in this playlist or your library is empty.
              </p>
              <Button 
                onClick={() => setAddTrackDialogOpen(false)}
                className="bg-transparent border-gray-600 text-white hover:bg-dark-DEFAULT"
              >
                Close
              </Button>
            </div>
          )}
          
          {availableTracks.length > 0 && (
            <DialogFooter className="flex justify-end space-x-2">
              <div className="flex-1 text-sm text-gray-400">
                {selectedTracks.length} track(s) selected
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedTracks([]);
                  setAddTrackDialogOpen(false);
                }}
                className="bg-transparent border-gray-600 text-white hover:bg-dark-DEFAULT"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddSelectedTracks}
                className="bg-secondary hover:bg-secondary-dark text-white"
                disabled={selectedTracks.length === 0}
              >
                Add Selected
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaylistDetail;

import React, { useState } from "react";
import { useLibrary } from "../contexts/LibraryContext";
import LibraryTrackItem from "../components/LibraryTrackItem";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useFileSystem } from "../hooks/useFileSystem";
import { useToast } from "@/hooks/use-toast";

const Library: React.FC = () => {
  const { tracks, albums, artists, importMusic } = useLibrary();
  const { pickFiles } = useFileSystem();
  const { toast } = useToast();
  const [tabValue, setTabValue] = useState("songs");
  const [isImporting, setIsImporting] = useState(false);

  const handleImportMusic = async () => {
    try {
      setIsImporting(true);
      const files = await pickFiles();
      
      if (files && files.length > 0) {
        await importMusic(files);
        toast({
          title: "Music Imported",
          description: `Successfully imported ${files.length} music files.`,
        });
      }
    } catch (error) {
      console.error("Error importing music:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing your music files.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white font-montserrat">Your Library</h1>
        <Button
          onClick={handleImportMusic}
          className="bg-secondary hover:bg-secondary-dark text-white"
          disabled={isImporting}
        >
          {isImporting ? "Importing..." : "Import Music"}
        </Button>
      </div>

      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="flex border-b border-dark-lighter mb-6 bg-transparent space-x-4">
          <TabsTrigger 
            value="songs" 
            className={`px-4 py-2 border-b-2 ${tabValue === 'songs' 
              ? 'border-secondary text-white' 
              : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Songs
          </TabsTrigger>
          <TabsTrigger 
            value="albums" 
            className={`px-4 py-2 border-b-2 ${tabValue === 'albums' 
              ? 'border-secondary text-white' 
              : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Albums
          </TabsTrigger>
          <TabsTrigger 
            value="artists" 
            className={`px-4 py-2 border-b-2 ${tabValue === 'artists' 
              ? 'border-secondary text-white' 
              : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Artists
          </TabsTrigger>
          <TabsTrigger 
            value="folders" 
            className={`px-4 py-2 border-b-2 ${tabValue === 'folders' 
              ? 'border-secondary text-white' 
              : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Folders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="space-y-1 mt-0">
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <LibraryTrackItem key={track.id} track={track} />
            ))
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
              <h3 className="font-bold text-white text-lg mb-2">No songs yet</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Import your music to start building your library
              </p>
              <Button
                onClick={handleImportMusic}
                className="bg-secondary hover:bg-secondary-dark text-white"
                disabled={isImporting}
              >
                {isImporting ? "Importing..." : "Import Music"}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="albums" className="mt-0">
          {albums.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {albums.map((album, index) => (
                <div key={index} className="album-item group cursor-pointer">
                  <div className="relative rounded-lg overflow-hidden mb-2">
                    <img
                      src={album.albumArt || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop"}
                      alt={`${album.name} cover`}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
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
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white font-medium truncate">{album.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{album.artist}</p>
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <h3 className="font-bold text-white text-lg mb-2">No albums yet</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Import your music to view your albums
              </p>
              <Button
                onClick={handleImportMusic}
                className="bg-secondary hover:bg-secondary-dark text-white"
                disabled={isImporting}
              >
                {isImporting ? "Importing..." : "Import Music"}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="artists" className="mt-0">
          {artists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {artists.map((artist, index) => (
                <div key={index} className="artist-item group cursor-pointer">
                  <div className="relative rounded-full overflow-hidden mb-2 aspect-square">
                    <img
                      src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop"
                      alt={`${artist} image`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
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
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white font-medium truncate text-center">{artist}</h3>
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h3 className="font-bold text-white text-lg mb-2">No artists yet</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Import your music to view your artists
              </p>
              <Button
                onClick={handleImportMusic}
                className="bg-secondary hover:bg-secondary-dark text-white"
                disabled={isImporting}
              >
                {isImporting ? "Importing..." : "Import Music"}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="folders" className="mt-0">
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
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <h3 className="font-bold text-white text-lg mb-2">Folder view</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Browse your music by folder structure
            </p>
            <Button
              onClick={handleImportMusic}
              className="bg-secondary hover:bg-secondary-dark text-white"
              disabled={isImporting}
            >
              {isImporting ? "Importing..." : "Import Music"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;

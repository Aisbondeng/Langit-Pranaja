import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLibrary } from "../contexts/LibraryContext";
import TrackItem from "../components/TrackItem";
import GenreItem from "../components/GenreItem";

const Browse: React.FC = () => {
  const [location] = useLocation();
  const { genres, tracks, getTracksByGenre } = useLibrary();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filteredTracks, setFilteredTracks] = useState(tracks);

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

  useEffect(() => {
    // Parse genre from URL if present
    const params = new URLSearchParams(location.split('?')[1]);
    const genreParam = params.get('genre');
    
    if (genreParam) {
      setSelectedGenre(genreParam);
      setFilteredTracks(getTracksByGenre(genreParam));
    } else {
      setSelectedGenre(null);
      setFilteredTracks(tracks);
    }
  }, [location, tracks, getTracksByGenre]);

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    setFilteredTracks(getTracksByGenre(genre));
  };

  return (
    <div className="px-4 py-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-montserrat mb-6">
          {selectedGenre ? `Browse ${selectedGenre}` : "Browse Music"}
        </h1>
        
        {!selectedGenre && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {genres.length > 0 ? (
              genres.map((genre) => (
                <GenreItem 
                  key={genre} 
                  genre={genre} 
                  imageUrl={genreImages[genre as keyof typeof genreImages] || genreImages["Pop"]}
                />
              ))
            ) : (
              ["Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical"].map((genre) => (
                <GenreItem 
                  key={genre} 
                  genre={genre} 
                  imageUrl={genreImages[genre as keyof typeof genreImages]}
                />
              ))
            )}
          </div>
        )}
      </div>

      {selectedGenre && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <button
              className="text-gray-400 hover:text-white mr-3"
              onClick={() => {
                setSelectedGenre(null);
                setFilteredTracks(tracks);
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-white font-montserrat">
              {selectedGenre}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredTracks.length > 0 ? (
              filteredTracks.map((track) => (
                <TrackItem key={track.id} track={track} />
              ))
            ) : (
              <p className="text-gray-400 col-span-full py-4">
                No tracks found in this genre. Import some music or browse another genre.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;

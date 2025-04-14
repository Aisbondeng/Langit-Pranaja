// Type definition for audio metadata
export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  year?: string;
  duration?: number;
  albumArt?: string;
}

/**
 * Parses metadata from an audio file
 * In a real implementation, this would use libraries like music-metadata-browser
 * or jsmediatags to extract actual metadata from audio files.
 * 
 * For this demo, we're simulating the process.
 */
export const parseMetadata = async (file: File): Promise<AudioMetadata> => {
  return new Promise((resolve) => {
    // In a real implementation, we would use audio metadata libraries
    // For this demo, we'll extract basic info from the filename
    
    // Simulate processing time
    setTimeout(() => {
      const fileName = file.name;
      const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
      
      // Try to parse artist - title format
      let artist = "Unknown Artist";
      let title = fileNameWithoutExt;
      
      if (fileNameWithoutExt.includes(" - ")) {
        const parts = fileNameWithoutExt.split(" - ");
        artist = parts[0].trim();
        title = parts[1].trim();
      }
      
      // Generate a random album art URL from Unsplash
      const imageIds = [
        "photo-1470225620780-dba8ba36b745",
        "photo-1511735111819-9a3f7709049c",
        "photo-1514525253161-7a46d19cd819",
        "photo-1493225457124-a3eb161ffa5f",
        "photo-1516450360452-9312f5e86fc7",
        "photo-1498038432885-c6f3f1b912ee",
        "photo-1499364615650-ec38552f4f34",
        "photo-1619983081563-430f63602796"
      ];
      
      const randomImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
      const albumArt = `https://images.unsplash.com/${randomImageId}?w=300&h=300&fit=crop`;
      
      // Simulate extracting duration
      const duration = Math.floor(Math.random() * 300) + 120; // Random duration between 2-7 minutes
      
      // Determine genre based on filename patterns (very naive approach)
      let genre = "Unknown";
      const lowerFileName = fileName.toLowerCase();
      if (lowerFileName.includes("rock") || lowerFileName.includes("guitar")) {
        genre = "Rock";
      } else if (lowerFileName.includes("pop") || lowerFileName.includes("hit")) {
        genre = "Pop";
      } else if (lowerFileName.includes("hip") || lowerFileName.includes("rap")) {
        genre = "Hip Hop";
      } else if (lowerFileName.includes("elec") || lowerFileName.includes("dance")) {
        genre = "Electronic";
      } else if (lowerFileName.includes("jazz")) {
        genre = "Jazz";
      } else if (lowerFileName.includes("class")) {
        genre = "Classical";
      } else {
        // Use random genre for demo purposes
        const genres = ["Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical", "R&B", "Country"];
        genre = genres[Math.floor(Math.random() * genres.length)];
      }
      
      // Generate album name if not found
      const album = `${artist} Album`;
      
      // Get current year as string
      const year = new Date().getFullYear().toString();
      
      resolve({
        title,
        artist,
        album,
        genre,
        year,
        duration,
        albumArt
      });
    }, 200); // Simulate processing time
  });
};

/**
 * Gets the duration of an audio file
 */
export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(objectUrl);
        resolve(audio.duration);
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Error loading audio file'));
      });
      
      audio.src = objectUrl;
    } catch (error) {
      reject(error);
    }
  });
};

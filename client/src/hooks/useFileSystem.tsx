import { useState, useCallback, useEffect } from "react";

interface UseFileSystemReturn {
  isSupported: boolean;
  pickFiles: () => Promise<File[] | null>;
  pickDirectory: () => Promise<FileSystemDirectoryHandle | null>;
  listMusicFiles: (dirHandle: FileSystemDirectoryHandle) => Promise<File[]>;
}

// Helper function to check if a file is a music file
const isMusicFile = (file: File): boolean => {
  const musicTypes = [
    'audio/mpeg', // MP3
    'audio/wav', // WAV
    'audio/ogg', // OGG
    'audio/flac', // FLAC
    'audio/aac', // AAC
    'audio/mp4', // M4A
    'audio/webm', // WEBM audio
    'audio/x-m4a', // M4A (alternative MIME type)
  ];
  
  // First check the file's MIME type
  if (musicTypes.includes(file.type)) {
    return true;
  }
  
  // If MIME type is not recognized, check file extension
  const musicExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.webm', '.wma', '.aiff'];
  const fileName = file.name.toLowerCase();
  return musicExtensions.some(ext => fileName.endsWith(ext));
};

export const useFileSystem = (): UseFileSystemReturn => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if File System Access API is supported
    setIsSupported(
      typeof window !== 'undefined' && 
      'showOpenFilePicker' in window &&
      'showDirectoryPicker' in window
    );
  }, []);

  const pickFiles = useCallback(async (): Promise<File[] | null> => {
    if (!isSupported) {
      console.warn("File System Access API is not supported in this browser");
      // Fallback to traditional file input
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.mp3,.wav,.ogg,.flac,.aac,.m4a,.webm,.wma,.aiff';
        
        input.onchange = () => {
          const files = Array.from(input.files || []);
          const musicFiles = files.filter(isMusicFile);
          resolve(musicFiles);
        };
        
        input.oncancel = () => resolve(null);
        input.click();
      });
    }

    try {
      // Show file picker with the File System Access API
      const fileHandles = await window.showOpenFilePicker({
        multiple: true,
        types: [
          {
            description: 'Audio Files',
            accept: {
              'audio/*': ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.webm', '.wma', '.aiff'],
            },
          },
        ],
      });

      if (!fileHandles || fileHandles.length === 0) {
        return null;
      }

      // Get File objects from handles
      const files = await Promise.all(
        fileHandles.map((handle) => handle.getFile())
      );

      // Filter out non-music files
      const musicFiles = files.filter(isMusicFile);
      
      return musicFiles;
    } catch (error) {
      // User cancelled or other error
      console.error("Error picking files:", error);
      return null;
    }
  }, [isSupported]);

  const pickDirectory = useCallback(async (): Promise<FileSystemDirectoryHandle | null> => {
    if (!isSupported) {
      console.warn("File System Access API is not supported in this browser");
      return null;
    }

    try {
      // Show directory picker
      const dirHandle = await window.showDirectoryPicker();
      return dirHandle;
    } catch (error) {
      // User cancelled or other error
      console.error("Error picking directory:", error);
      return null;
    }
  }, [isSupported]);

  const listMusicFiles = useCallback(
    async (dirHandle: FileSystemDirectoryHandle): Promise<File[]> => {
      const files: File[] = [];

      async function processEntry(entry: FileSystemDirectoryHandle | FileSystemFileHandle, path = "") {
        if (entry.kind === 'file') {
          try {
            const file = await (entry as FileSystemFileHandle).getFile();
            if (isMusicFile(file)) {
              // Create a new File object with the path info
              const fileWithPath = new File(
                [file],
                path ? `${path}/${file.name}` : file.name,
                { type: file.type }
              );
              
              // Add custom property to store the file path for later reference
              Object.defineProperty(fileWithPath, 'fullPath', {
                value: path ? `${path}/${file.name}` : file.name,
                writable: false
              });
              
              files.push(fileWithPath);
            }
          } catch (error) {
            console.error(`Error processing file ${entry.name}:`, error);
          }
        } else if (entry.kind === 'directory') {
          try {
            // Process all entries in the directory
            const directoryHandle = entry as FileSystemDirectoryHandle;
            for await (const childEntry of directoryHandle.values()) {
              const newPath = path ? `${path}/${entry.name}` : entry.name;
              await processEntry(
                childEntry,
                newPath
              );
            }
          } catch (error) {
            console.error(`Error processing directory ${entry.name}:`, error);
          }
        }
      }

      try {
        await processEntry(dirHandle);
        return files;
      } catch (error) {
        console.error("Error listing music files:", error);
        return [];
      }
    },
    []
  );

  return {
    isSupported,
    pickFiles,
    pickDirectory,
    listMusicFiles,
  };
};

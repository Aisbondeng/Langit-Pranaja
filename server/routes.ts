import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertTrackSchema,
  insertPlaylistSchema,
  insertPlaylistTrackSchema,
  insertRecentlyPlayedSchema
} from "@shared/schema";
import { setupAuth } from "./auth";
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

export async function registerRoutes(app: Express): Promise<Server> {
  // Inisialisasi akun Admin jika belum ada
  const createAdminAccount = async () => {
    try {
      // Cek apakah admin sudah ada
      const adminUser = await storage.getUserByUsername("admin");
      
      if (!adminUser) {
        console.log("Creating admin account...");
        
        const scryptAsync = promisify(scrypt);
        const salt = randomBytes(16).toString('hex');
        
        const buf = await scryptAsync("adminpass", salt, 64) as Buffer;
        const hashedPassword = `${buf.toString('hex')}.${salt}`;
        
        // Buat akun admin
        const now = new Date().toISOString();
        
        await storage.createUser({
          username: "admin",
          password: hashedPassword,
          email: "admin@pranajaarishaf.com",
          userType: "admin",
          registeredAt: now,
        });
        
        console.log("Admin account created successfully");
      } else {
        console.log("Admin account already exists");
      }
    } catch (error) {
      console.error("Error creating admin account:", error);
    }
  };
  
  // Panggil fungsi untuk membuat akun admin
  await createAdminAccount();
  
  // Setup auth routes
  setupAuth(app);
  
  // Tracks
  app.get("/api/tracks", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      
      const tracks = await storage.getTracks(userId);
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tracks" });
    }
  });

  app.post("/api/tracks", async (req, res) => {
    try {
      const track = insertTrackSchema.parse(req.body);
      const newTrack = await storage.createTrack(track);
      res.status(201).json(newTrack);
    } catch (error) {
      res.status(400).json({ message: "Invalid track data" });
    }
  });

  app.get("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid track ID" });
      }
      
      const track = await storage.getTrack(id);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      
      res.json(track);
    } catch (error) {
      res.status(500).json({ message: "Error fetching track" });
    }
  });

  app.get("/api/tracks/artist/:artist", async (req, res) => {
    try {
      const { artist } = req.params;
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      
      const tracks = await storage.getTracksByArtist(artist, userId);
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tracks by artist" });
    }
  });

  app.get("/api/tracks/album/:album", async (req, res) => {
    try {
      const { album } = req.params;
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      
      const tracks = await storage.getTracksByAlbum(album, userId);
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tracks by album" });
    }
  });

  app.get("/api/tracks/genre/:genre", async (req, res) => {
    try {
      const { genre } = req.params;
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      
      const tracks = await storage.getTracksByGenre(genre, userId);
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tracks by genre" });
    }
  });

  // Playlists
  app.get("/api/playlists", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      
      const playlists = await storage.getPlaylists(userId);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: "Error fetching playlists" });
    }
  });

  app.post("/api/playlists", async (req, res) => {
    try {
      const playlist = insertPlaylistSchema.parse(req.body);
      const newPlaylist = await storage.createPlaylist(playlist);
      res.status(201).json(newPlaylist);
    } catch (error) {
      res.status(400).json({ message: "Invalid playlist data" });
    }
  });

  app.get("/api/playlists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid playlist ID" });
      }
      
      const playlist = await storage.getPlaylist(id);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Error fetching playlist" });
    }
  });

  app.put("/api/playlists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid playlist ID" });
      }
      
      const updateData = req.body;
      const updatedPlaylist = await storage.updatePlaylist(id, updateData);
      
      if (!updatedPlaylist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(500).json({ message: "Error updating playlist" });
    }
  });

  app.delete("/api/playlists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid playlist ID" });
      }
      
      const success = await storage.deletePlaylist(id);
      if (!success) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting playlist" });
    }
  });

  // Playlist tracks
  app.get("/api/playlists/:id/tracks", async (req, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      if (isNaN(playlistId)) {
        return res.status(400).json({ message: "Invalid playlist ID" });
      }
      
      const playlistTracks = await storage.getPlaylistTracks(playlistId);
      
      // Get the track details for each playlist track
      const trackIds = playlistTracks.map(pt => pt.trackId);
      const tracks = await storage.getTracksByIds(trackIds);
      
      // Combine playlist track info with track details
      const result = playlistTracks.map(pt => {
        const track = tracks.find(t => t.id === pt.trackId);
        return {
          ...pt,
          track
        };
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching playlist tracks" });
    }
  });

  app.post("/api/playlists/:id/tracks", async (req, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      if (isNaN(playlistId)) {
        return res.status(400).json({ message: "Invalid playlist ID" });
      }
      
      const data = {
        ...req.body,
        playlistId
      };
      
      const playlistTrack = insertPlaylistTrackSchema.parse(data);
      const newPlaylistTrack = await storage.addTrackToPlaylist(playlistTrack);
      
      res.status(201).json(newPlaylistTrack);
    } catch (error) {
      res.status(400).json({ message: "Invalid playlist track data" });
    }
  });

  app.delete("/api/playlists/:playlistId/tracks/:trackId", async (req, res) => {
    try {
      const playlistId = parseInt(req.params.playlistId);
      const trackId = parseInt(req.params.trackId);
      
      if (isNaN(playlistId) || isNaN(trackId)) {
        return res.status(400).json({ message: "Invalid playlist or track ID" });
      }
      
      const success = await storage.removeTrackFromPlaylist(playlistId, trackId);
      if (!success) {
        return res.status(404).json({ message: "Playlist track not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing track from playlist" });
    }
  });

  // Recently played
  app.get("/api/recently-played", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      
      const recentlyPlayed = await storage.getRecentlyPlayed(userId, limit);
      
      // Get the track details for each recently played entry
      const trackIds = recentlyPlayed.map(rp => rp.trackId);
      const tracks = await storage.getTracksByIds(trackIds);
      
      // Combine recently played info with track details
      const result = recentlyPlayed.map(rp => {
        const track = tracks.find(t => t.id === rp.trackId);
        return {
          ...rp,
          track
        };
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recently played tracks" });
    }
  });

  app.post("/api/recently-played", async (req, res) => {
    try {
      const recentlyPlayed = insertRecentlyPlayedSchema.parse(req.body);
      const newRecentlyPlayed = await storage.addRecentlyPlayed(recentlyPlayed);
      res.status(201).json(newRecentlyPlayed);
    } catch (error) {
      res.status(400).json({ message: "Invalid recently played data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

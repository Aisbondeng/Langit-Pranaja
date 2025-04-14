// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  tracks;
  playlists;
  playlistTracks;
  recentPlays;
  premiumFeaturesMap;
  premiumSubscriptionsMap;
  currentUserId;
  currentTrackId;
  currentPlaylistId;
  currentPlaylistTrackId;
  currentRecentlyPlayedId;
  currentPremiumFeatureId;
  currentPremiumSubscriptionId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.tracks = /* @__PURE__ */ new Map();
    this.playlists = /* @__PURE__ */ new Map();
    this.playlistTracks = /* @__PURE__ */ new Map();
    this.recentPlays = /* @__PURE__ */ new Map();
    this.premiumFeaturesMap = /* @__PURE__ */ new Map();
    this.premiumSubscriptionsMap = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentTrackId = 1;
    this.currentPlaylistId = 1;
    this.currentPlaylistTrackId = 1;
    this.currentRecentlyPlayedId = 1;
    this.currentPremiumFeatureId = 1;
    this.currentPremiumSubscriptionId = 1;
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = {
      ...insertUser,
      id,
      userType: insertUser.userType || "free",
      premiumExpiry: null,
      lastLoginAt: null,
      profilePicture: insertUser.profilePicture || null
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, userData) {
    const existingUser = this.users.get(id);
    if (!existingUser) return void 0;
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async deleteUser(id) {
    return this.users.delete(id);
  }
  async isUserPremium(userId) {
    const user = await this.getUser(userId);
    if (!user) return false;
    if (user.userType === "admin") return true;
    if (user.userType !== "premium") return false;
    if (user.premiumExpiry) {
      const expiryDate = new Date(user.premiumExpiry);
      const now = /* @__PURE__ */ new Date();
      if (expiryDate < now) {
        await this.updateUser(userId, {
          userType: "free",
          premiumExpiry: null
        });
        return false;
      }
      return true;
    }
    return false;
  }
  async getUserType(userId) {
    const user = await this.getUser(userId);
    if (!user) return "unknown";
    if (user.userType === "premium") {
      if (user.premiumExpiry) {
        const expiryDate = new Date(user.premiumExpiry);
        const now = /* @__PURE__ */ new Date();
        if (expiryDate < now) {
          await this.updateUser(userId, {
            userType: "free",
            premiumExpiry: null
          });
          return "free";
        }
      }
    }
    return user.userType;
  }
  async isUserAdmin(userId) {
    const user = await this.getUser(userId);
    return user?.userType === "admin";
  }
  // Track operations
  async createTrack(insertTrack) {
    const id = this.currentTrackId++;
    const track = {
      ...insertTrack,
      id,
      artist: insertTrack.artist || null,
      album: insertTrack.album || null,
      duration: insertTrack.duration || null,
      genre: insertTrack.genre || null,
      year: insertTrack.year || null,
      albumArt: insertTrack.albumArt || null,
      userId: insertTrack.userId || null,
      isPremium: insertTrack.isPremium || false,
      quality: insertTrack.quality || "standard"
    };
    this.tracks.set(id, track);
    return track;
  }
  async getTrack(id) {
    return this.tracks.get(id);
  }
  async getTracks(userId) {
    return Array.from(this.tracks.values()).filter(
      (track) => track.userId === userId || track.userId === void 0 || track.userId === null
    );
  }
  async getTracksByIds(ids) {
    return Array.from(this.tracks.values()).filter(
      (track) => ids.includes(track.id)
    );
  }
  async getTracksByArtist(artist, userId) {
    return Array.from(this.tracks.values()).filter(
      (track) => (track.userId === userId || track.userId === void 0 || track.userId === null) && track.artist?.toLowerCase() === artist.toLowerCase()
    );
  }
  async getTracksByAlbum(album, userId) {
    return Array.from(this.tracks.values()).filter(
      (track) => (track.userId === userId || track.userId === void 0 || track.userId === null) && track.album?.toLowerCase() === album.toLowerCase()
    );
  }
  async getTracksByGenre(genre, userId) {
    return Array.from(this.tracks.values()).filter(
      (track) => (track.userId === userId || track.userId === void 0 || track.userId === null) && track.genre?.toLowerCase() === genre.toLowerCase()
    );
  }
  async getPremiumTracks() {
    return Array.from(this.tracks.values()).filter(
      (track) => track.isPremium === true
    );
  }
  async updateTrack(id, track) {
    const existingTrack = this.tracks.get(id);
    if (!existingTrack) return void 0;
    const updatedTrack = { ...existingTrack, ...track };
    this.tracks.set(id, updatedTrack);
    return updatedTrack;
  }
  async deleteTrack(id) {
    return this.tracks.delete(id);
  }
  // Playlist operations
  async createPlaylist(insertPlaylist) {
    const id = this.currentPlaylistId++;
    const playlist = { ...insertPlaylist, id };
    this.playlists.set(id, playlist);
    return playlist;
  }
  async getPlaylist(id) {
    return this.playlists.get(id);
  }
  async getPlaylists(userId) {
    return Array.from(this.playlists.values()).filter(
      (playlist) => playlist.userId === userId
    );
  }
  async updatePlaylist(id, playlist) {
    const existingPlaylist = this.playlists.get(id);
    if (!existingPlaylist) return void 0;
    const updatedPlaylist = { ...existingPlaylist, ...playlist };
    this.playlists.set(id, updatedPlaylist);
    return updatedPlaylist;
  }
  async deletePlaylist(id) {
    Array.from(this.playlistTracks.values()).filter((pt) => pt.playlistId === id).forEach((pt) => this.playlistTracks.delete(pt.id));
    return this.playlists.delete(id);
  }
  // Playlist track operations
  async addTrackToPlaylist(insertPlaylistTrack) {
    const id = this.currentPlaylistTrackId++;
    const playlistTrack = { ...insertPlaylistTrack, id };
    this.playlistTracks.set(id, playlistTrack);
    return playlistTrack;
  }
  async getPlaylistTracks(playlistId) {
    return Array.from(this.playlistTracks.values()).filter((pt) => pt.playlistId === playlistId).sort((a, b) => a.position - b.position);
  }
  async removeTrackFromPlaylist(playlistId, trackId) {
    const entry = Array.from(this.playlistTracks.entries()).find(
      ([_, pt]) => pt.playlistId === playlistId && pt.trackId === trackId
    );
    if (!entry) return false;
    return this.playlistTracks.delete(entry[0]);
  }
  async updateTrackPosition(id, position) {
    const playlistTrack = this.playlistTracks.get(id);
    if (!playlistTrack) return void 0;
    const updatedPlaylistTrack = { ...playlistTrack, position };
    this.playlistTracks.set(id, updatedPlaylistTrack);
    return updatedPlaylistTrack;
  }
  // Recently played operations
  async addRecentlyPlayed(insertRecentlyPlayed) {
    const existing = Array.from(this.recentPlays.values()).find(
      (rp) => rp.userId === insertRecentlyPlayed.userId && rp.trackId === insertRecentlyPlayed.trackId
    );
    if (existing) {
      const updated = { ...existing, playedAt: insertRecentlyPlayed.playedAt };
      this.recentPlays.set(existing.id, updated);
      return updated;
    }
    const id = this.currentRecentlyPlayedId++;
    const recentlyPlayed2 = { ...insertRecentlyPlayed, id };
    this.recentPlays.set(id, recentlyPlayed2);
    return recentlyPlayed2;
  }
  async getRecentlyPlayed(userId, limit = 10) {
    return Array.from(this.recentPlays.values()).filter((rp) => rp.userId === userId).sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()).slice(0, limit);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  userType: text("user_type").notNull().default("free"),
  // "free", "premium", "admin"
  premiumExpiry: text("premium_expiry"),
  // ISO date string, null for free users
  registeredAt: text("registered_at").notNull(),
  // ISO date string
  lastLoginAt: text("last_login_at"),
  // ISO date string
  profilePicture: text("profile_picture")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  userType: true,
  registeredAt: true,
  profilePicture: true
});
var tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  album: text("album"),
  duration: integer("duration"),
  // Duration in seconds
  filePath: text("file_path").notNull(),
  genre: text("genre"),
  year: text("year"),
  albumArt: text("album_art"),
  userId: integer("user_id").references(() => users.id),
  addedAt: text("added_at").notNull(),
  // ISO date string
  isPremium: boolean("is_premium").notNull().default(false),
  // True if track is only for premium users
  quality: text("quality").notNull().default("standard")
  // "standard", "high", "ultra"
});
var insertTrackSchema = createInsertSchema(tracks).omit({
  id: true
});
var playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: text("created_at").notNull(),
  // ISO date string
  coverArt: text("cover_art"),
  isPublic: boolean("is_public").notNull().default(true)
  // Premium users can make private playlists
});
var insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true
});
var playlistTracks = pgTable("playlist_tracks", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").references(() => playlists.id).notNull(),
  trackId: integer("track_id").references(() => tracks.id).notNull(),
  position: integer("position").notNull()
});
var insertPlaylistTrackSchema = createInsertSchema(playlistTracks).omit({
  id: true
});
var recentlyPlayed = pgTable("recently_played", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  trackId: integer("track_id").references(() => tracks.id).notNull(),
  playedAt: text("played_at").notNull()
  // ISO date string
});
var insertRecentlyPlayedSchema = createInsertSchema(recentlyPlayed).omit({
  id: true
});
var premiumFeatures = pgTable("premium_features", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  isActive: boolean("is_active").notNull().default(true)
});
var premiumSubscriptions = pgTable("premium_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startDate: text("start_date").notNull(),
  // ISO date string
  endDate: text("end_date").notNull(),
  // ISO date string
  amount: text("amount").notNull(),
  // Amount paid for subscription
  status: text("status").notNull(),
  // "active", "expired", "cancelled"
  createdAt: text("created_at").notNull()
  // ISO date string
});
var insertPremiumFeaturesSchema = createInsertSchema(premiumFeatures).omit({
  id: true
});
var insertPremiumSubscriptionsSchema = createInsertSchema(premiumSubscriptions).omit({
  id: true
});

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import MemoryStore from "memorystore";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const MemorySessionStore = MemoryStore(session);
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "pranaja-musik-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      httpOnly: true,
      sameSite: "lax"
    },
    store: new MemorySessionStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    })
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          const now = (/* @__PURE__ */ new Date()).toISOString();
          await storage.updateUser(user.id, {
            // @ts-ignore
            lastLoginAt: now
          });
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username sudah digunakan" });
      }
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email sudah digunakan" });
      }
      const hashedPassword = await hashPassword(req.body.password);
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const userData = {
        ...req.body,
        password: hashedPassword,
        userType: req.body.userType || "free",
        registeredAt: req.body.registeredAt || now,
        lastLoginAt: now
      };
      const user = await storage.createUser(userData);
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...safeUser } = user;
        res.status(201).json(safeUser);
      });
    } catch (err) {
      next(err);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Username atau password salah" });
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const { password, ...safeUser } = user;
        return res.status(200).json(safeUser);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...safeUser } = req.user;
    res.json(safeUser);
  });
}

// server/routes.ts
import { scrypt as scrypt2, randomBytes as randomBytes2 } from "crypto";
import { promisify as promisify2 } from "util";
async function registerRoutes(app2) {
  const createAdminAccount = async () => {
    try {
      const adminUser = await storage.getUserByUsername("admin");
      if (!adminUser) {
        console.log("Creating admin account...");
        const scryptAsync2 = promisify2(scrypt2);
        const salt = randomBytes2(16).toString("hex");
        const buf = await scryptAsync2("adminpass", salt, 64);
        const hashedPassword = `${buf.toString("hex")}.${salt}`;
        const now = (/* @__PURE__ */ new Date()).toISOString();
        await storage.createUser({
          username: "admin",
          password: hashedPassword,
          email: "admin@pranajaarishaf.com",
          userType: "admin",
          registeredAt: now
        });
        console.log("Admin account created successfully");
      } else {
        console.log("Admin account already exists");
      }
    } catch (error) {
      console.error("Error creating admin account:", error);
    }
  };
  await createAdminAccount();
  setupAuth(app2);
  app2.get("/api/tracks", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      const tracks2 = await storage.getTracks(userId);
      res.json(tracks2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tracks" });
    }
  });
  app2.post("/api/tracks", async (req, res) => {
    try {
      const track = insertTrackSchema.parse(req.body);
      const newTrack = await storage.createTrack(track);
      res.status(201).json(newTrack);
    } catch (error) {
      res.status(400).json({ message: "Invalid track data" });
    }
  });
  app2.get("/api/tracks/:id", async (req, res) => {
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
  app2.get("/api/tracks/artist/:artist", async (req, res) => {
    try {
      const { artist } = req.params;
      const userId = parseInt(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      const tracks2 = await storage.getTracksByArtist(artist, userId);
      res.json(tracks2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tracks by artist" });
    }
  });
  app2.get("/api/tracks/album/:album", async (req, res) => {
    try {
      const { album } = req.params;
      const userId = parseInt(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      const tracks2 = await storage.getTracksByAlbum(album, userId);
      res.json(tracks2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tracks by album" });
    }
  });
  app2.get("/api/tracks/genre/:genre", async (req, res) => {
    try {
      const { genre } = req.params;
      const userId = parseInt(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      const tracks2 = await storage.getTracksByGenre(genre, userId);
      res.json(tracks2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tracks by genre" });
    }
  });
  app2.get("/api/playlists", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      const playlists2 = await storage.getPlaylists(userId);
      res.json(playlists2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching playlists" });
    }
  });
  app2.post("/api/playlists", async (req, res) => {
    try {
      const playlist = insertPlaylistSchema.parse(req.body);
      const newPlaylist = await storage.createPlaylist(playlist);
      res.status(201).json(newPlaylist);
    } catch (error) {
      res.status(400).json({ message: "Invalid playlist data" });
    }
  });
  app2.get("/api/playlists/:id", async (req, res) => {
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
  app2.put("/api/playlists/:id", async (req, res) => {
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
  app2.delete("/api/playlists/:id", async (req, res) => {
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
  app2.get("/api/playlists/:id/tracks", async (req, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      if (isNaN(playlistId)) {
        return res.status(400).json({ message: "Invalid playlist ID" });
      }
      const playlistTracks2 = await storage.getPlaylistTracks(playlistId);
      const trackIds = playlistTracks2.map((pt) => pt.trackId);
      const tracks2 = await storage.getTracksByIds(trackIds);
      const result = playlistTracks2.map((pt) => {
        const track = tracks2.find((t) => t.id === pt.trackId);
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
  app2.post("/api/playlists/:id/tracks", async (req, res) => {
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
  app2.delete("/api/playlists/:playlistId/tracks/:trackId", async (req, res) => {
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
  app2.get("/api/recently-played", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      const recentlyPlayed2 = await storage.getRecentlyPlayed(userId, limit);
      const trackIds = recentlyPlayed2.map((rp) => rp.trackId);
      const tracks2 = await storage.getTracksByIds(trackIds);
      const result = recentlyPlayed2.map((rp) => {
        const track = tracks2.find((t) => t.id === rp.trackId);
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
  app2.post("/api/recently-played", async (req, res) => {
    try {
      const recentlyPlayed2 = insertRecentlyPlayedSchema.parse(req.body);
      const newRecentlyPlayed = await storage.addRecentlyPlayed(recentlyPlayed2);
      res.status(201).json(newRecentlyPlayed);
    } catch (error) {
      res.status(400).json({ message: "Invalid recently played data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/create-admin.ts
var adminData = {
  username: "admin",
  password: "0a5a718eb2572162afa60cddc01a4e2801046a69a87219875c85a3be13e0cdcbc578af67172742e2475949d5d6edb797c8cb110aac3c8452c2260e7a466bd3fa.66d502b3f8000b5e0cb1839807c8c8bb",
  email: "admin@pranajaarishaf.com",
  userType: "admin",
  registeredAt: (/* @__PURE__ */ new Date()).toISOString()
};
async function createAdminAccountDirectly() {
  try {
    const existingAdmin = await storage.getUserByUsername("admin");
    if (existingAdmin) {
      console.log("Admin account already exists, updating password...");
      await storage.updateUser(existingAdmin.id, {
        password: adminData.password
      });
      console.log("Admin password updated successfully");
    } else {
      console.log("Creating new admin account...");
      await storage.createUser(adminData);
      console.log("Admin account created successfully");
    }
    console.log("\u2705 Admin credential: username='admin' password='adminpass'");
  } catch (error) {
    console.error("Error managing admin account:", error);
  }
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await createAdminAccountDirectly();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

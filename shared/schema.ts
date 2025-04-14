import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  userType: text("user_type").notNull().default("free"), // "free", "premium", "admin"
  premiumExpiry: text("premium_expiry"), // ISO date string, null for free users
  registeredAt: text("registered_at").notNull(), // ISO date string
  lastLoginAt: text("last_login_at"), // ISO date string
  profilePicture: text("profile_picture"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  userType: true,
  registeredAt: true,
  profilePicture: true,
});

// Tracks table
export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  album: text("album"),
  duration: integer("duration"), // Duration in seconds
  filePath: text("file_path").notNull(),
  genre: text("genre"),
  year: text("year"),
  albumArt: text("album_art"),
  userId: integer("user_id").references(() => users.id),
  addedAt: text("added_at").notNull(), // ISO date string
  isPremium: boolean("is_premium").notNull().default(false), // True if track is only for premium users
  quality: text("quality").notNull().default("standard"), // "standard", "high", "ultra"
});

export const insertTrackSchema = createInsertSchema(tracks).omit({ 
  id: true
});

// Playlists table
export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: text("created_at").notNull(), // ISO date string
  coverArt: text("cover_art"),
  isPublic: boolean("is_public").notNull().default(true), // Premium users can make private playlists
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true
});

// Playlist tracks junction table
export const playlistTracks = pgTable("playlist_tracks", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").references(() => playlists.id).notNull(),
  trackId: integer("track_id").references(() => tracks.id).notNull(),
  position: integer("position").notNull(),
});

export const insertPlaylistTrackSchema = createInsertSchema(playlistTracks).omit({
  id: true
});

// Recently played tracks
export const recentlyPlayed = pgTable("recently_played", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  trackId: integer("track_id").references(() => tracks.id).notNull(),
  playedAt: text("played_at").notNull(), // ISO date string
});

export const insertRecentlyPlayedSchema = createInsertSchema(recentlyPlayed).omit({
  id: true
});

// Premium features table
export const premiumFeatures = pgTable("premium_features", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// Premium subscription table
export const premiumSubscriptions = pgTable("premium_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startDate: text("start_date").notNull(), // ISO date string
  endDate: text("end_date").notNull(), // ISO date string
  amount: text("amount").notNull(), // Amount paid for subscription
  status: text("status").notNull(), // "active", "expired", "cancelled"
  createdAt: text("created_at").notNull(), // ISO date string
});

export const insertPremiumFeaturesSchema = createInsertSchema(premiumFeatures).omit({
  id: true
});

export const insertPremiumSubscriptionsSchema = createInsertSchema(premiumSubscriptions).omit({
  id: true
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;

export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;

export type InsertPlaylistTrack = z.infer<typeof insertPlaylistTrackSchema>;
export type PlaylistTrack = typeof playlistTracks.$inferSelect;

export type InsertRecentlyPlayed = z.infer<typeof insertRecentlyPlayedSchema>;
export type RecentlyPlayed = typeof recentlyPlayed.$inferSelect;

export type InsertPremiumFeatures = z.infer<typeof insertPremiumFeaturesSchema>;
export type PremiumFeature = typeof premiumFeatures.$inferSelect;

export type InsertPremiumSubscription = z.infer<typeof insertPremiumSubscriptionsSchema>;
export type PremiumSubscription = typeof premiumSubscriptions.$inferSelect;

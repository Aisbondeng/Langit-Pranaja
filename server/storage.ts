import { 
  users, type User, type InsertUser,
  tracks, type Track, type InsertTrack,
  playlists, type Playlist, type InsertPlaylist,
  playlistTracks, type PlaylistTrack, type InsertPlaylistTrack,
  recentlyPlayed, type RecentlyPlayed, type InsertRecentlyPlayed,
  premiumFeatures, type PremiumFeature, type InsertPremiumFeatures,
  premiumSubscriptions, type PremiumSubscription, type InsertPremiumSubscription
} from "@shared/schema";

// Define the storage interface with all needed CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Track operations
  createTrack(track: InsertTrack): Promise<Track>;
  getTrack(id: number): Promise<Track | undefined>;
  getTracks(userId: number): Promise<Track[]>;
  getTracksByIds(ids: number[]): Promise<Track[]>;
  getTracksByArtist(artist: string, userId: number): Promise<Track[]>;
  getTracksByAlbum(album: string, userId: number): Promise<Track[]>;
  getTracksByGenre(genre: string, userId: number): Promise<Track[]>;
  getPremiumTracks(): Promise<Track[]>;
  updateTrack(id: number, track: Partial<InsertTrack>): Promise<Track | undefined>;
  deleteTrack(id: number): Promise<boolean>;
  
  // Playlist operations
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  getPlaylists(userId: number): Promise<Playlist[]>;
  getPublicPlaylists(): Promise<Playlist[]>;
  updatePlaylist(id: number, playlist: Partial<InsertPlaylist>): Promise<Playlist | undefined>;
  deletePlaylist(id: number): Promise<boolean>;
  
  // Playlist track operations
  addTrackToPlaylist(playlistTrack: InsertPlaylistTrack): Promise<PlaylistTrack>;
  getPlaylistTracks(playlistId: number): Promise<PlaylistTrack[]>;
  removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<boolean>;
  updateTrackPosition(id: number, position: number): Promise<PlaylistTrack | undefined>;
  
  // Recently played operations
  addRecentlyPlayed(recentlyPlayed: InsertRecentlyPlayed): Promise<RecentlyPlayed>;
  getRecentlyPlayed(userId: number, limit?: number): Promise<RecentlyPlayed[]>;
  
  // Premium features operations
  createPremiumFeature(feature: InsertPremiumFeatures): Promise<PremiumFeature>;
  getPremiumFeatures(): Promise<PremiumFeature[]>;
  getPremiumFeature(id: number): Promise<PremiumFeature | undefined>;
  updatePremiumFeature(id: number, feature: Partial<InsertPremiumFeatures>): Promise<PremiumFeature | undefined>;
  deletePremiumFeature(id: number): Promise<boolean>;
  
  // Premium subscriptions operations
  createPremiumSubscription(subscription: InsertPremiumSubscription): Promise<PremiumSubscription>;
  getPremiumSubscription(id: number): Promise<PremiumSubscription | undefined>;
  getUserSubscriptions(userId: number): Promise<PremiumSubscription[]>;
  getActiveSubscription(userId: number): Promise<PremiumSubscription | undefined>;
  updatePremiumSubscription(id: number, subscription: Partial<InsertPremiumSubscription>): Promise<PremiumSubscription | undefined>;
  deletePremiumSubscription(id: number): Promise<boolean>;
  
  // User premium status check
  isUserPremium(userId: number): Promise<boolean>;
  getUserType(userId: number): Promise<string>;
  isUserAdmin(userId: number): Promise<boolean>;
}

// Implement the in-memory storage
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tracks: Map<number, Track>;
  private playlists: Map<number, Playlist>;
  private playlistTracks: Map<number, PlaylistTrack>;
  private recentPlays: Map<number, RecentlyPlayed>;
  private premiumFeaturesMap: Map<number, PremiumFeature>;
  private premiumSubscriptionsMap: Map<number, PremiumSubscription>;
  
  currentUserId: number;
  currentTrackId: number;
  currentPlaylistId: number;
  currentPlaylistTrackId: number;
  currentRecentlyPlayedId: number;
  currentPremiumFeatureId: number;
  currentPremiumSubscriptionId: number;

  constructor() {
    this.users = new Map();
    this.tracks = new Map();
    this.playlists = new Map();
    this.playlistTracks = new Map();
    this.recentPlays = new Map();
    this.premiumFeaturesMap = new Map();
    this.premiumSubscriptionsMap = new Map();
    
    this.currentUserId = 1;
    this.currentTrackId = 1;
    this.currentPlaylistId = 1;
    this.currentPlaylistTrackId = 1;
    this.currentRecentlyPlayedId = 1;
    this.currentPremiumFeatureId = 1;
    this.currentPremiumSubscriptionId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      userType: insertUser.userType || 'free',
      premiumExpiry: null,
      lastLoginAt: null,
      profilePicture: insertUser.profilePicture || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
  
  async isUserPremium(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;
    
    if (user.userType === 'admin') return true;
    if (user.userType !== 'premium') return false;
    
    // Check if premium has expired
    if (user.premiumExpiry) {
      const expiryDate = new Date(user.premiumExpiry);
      const now = new Date();
      if (expiryDate < now) {
        // Premium expired, update user type to free
        await this.updateUser(userId, { 
          userType: 'free',
          premiumExpiry: null
        });
        return false;
      }
      return true;
    }
    
    return false;
  }
  
  async getUserType(userId: number): Promise<string> {
    const user = await this.getUser(userId);
    if (!user) return 'unknown';
    
    if (user.userType === 'premium') {
      // Check if premium has expired
      if (user.premiumExpiry) {
        const expiryDate = new Date(user.premiumExpiry);
        const now = new Date();
        if (expiryDate < now) {
          // Premium expired, update user type to free
          await this.updateUser(userId, { 
            userType: 'free',
            premiumExpiry: null
          });
          return 'free';
        }
      }
    }
    
    return user.userType;
  }
  
  async isUserAdmin(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    return user?.userType === 'admin';
  }

  // Track operations
  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = this.currentTrackId++;
    const track: Track = {
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
      quality: insertTrack.quality || 'standard'
    };
    this.tracks.set(id, track);
    return track;
  }

  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async getTracks(userId: number): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(
      (track) => track.userId === userId || track.userId === undefined || track.userId === null
    );
  }

  async getTracksByIds(ids: number[]): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(
      (track) => ids.includes(track.id)
    );
  }

  async getTracksByArtist(artist: string, userId: number): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(
      (track) => (track.userId === userId || track.userId === undefined || track.userId === null) && 
                track.artist?.toLowerCase() === artist.toLowerCase()
    );
  }

  async getTracksByAlbum(album: string, userId: number): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(
      (track) => (track.userId === userId || track.userId === undefined || track.userId === null) && 
                track.album?.toLowerCase() === album.toLowerCase()
    );
  }

  async getTracksByGenre(genre: string, userId: number): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(
      (track) => (track.userId === userId || track.userId === undefined || track.userId === null) && 
                track.genre?.toLowerCase() === genre.toLowerCase()
    );
  }
  
  async getPremiumTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(
      (track) => track.isPremium === true
    );
  }

  async updateTrack(id: number, track: Partial<InsertTrack>): Promise<Track | undefined> {
    const existingTrack = this.tracks.get(id);
    if (!existingTrack) return undefined;
    
    const updatedTrack = { ...existingTrack, ...track };
    this.tracks.set(id, updatedTrack);
    return updatedTrack;
  }

  async deleteTrack(id: number): Promise<boolean> {
    return this.tracks.delete(id);
  }

  // Playlist operations
  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = this.currentPlaylistId++;
    const playlist: Playlist = { ...insertPlaylist, id };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async getPlaylists(userId: number): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).filter(
      (playlist) => playlist.userId === userId
    );
  }

  async updatePlaylist(id: number, playlist: Partial<InsertPlaylist>): Promise<Playlist | undefined> {
    const existingPlaylist = this.playlists.get(id);
    if (!existingPlaylist) return undefined;
    
    const updatedPlaylist = { ...existingPlaylist, ...playlist };
    this.playlists.set(id, updatedPlaylist);
    return updatedPlaylist;
  }

  async deletePlaylist(id: number): Promise<boolean> {
    // Delete all playlist tracks first
    Array.from(this.playlistTracks.values())
      .filter(pt => pt.playlistId === id)
      .forEach(pt => this.playlistTracks.delete(pt.id));
    
    return this.playlists.delete(id);
  }

  // Playlist track operations
  async addTrackToPlaylist(insertPlaylistTrack: InsertPlaylistTrack): Promise<PlaylistTrack> {
    const id = this.currentPlaylistTrackId++;
    const playlistTrack: PlaylistTrack = { ...insertPlaylistTrack, id };
    this.playlistTracks.set(id, playlistTrack);
    return playlistTrack;
  }

  async getPlaylistTracks(playlistId: number): Promise<PlaylistTrack[]> {
    return Array.from(this.playlistTracks.values())
      .filter(pt => pt.playlistId === playlistId)
      .sort((a, b) => a.position - b.position);
  }

  async removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<boolean> {
    const entry = Array.from(this.playlistTracks.entries()).find(
      ([_, pt]) => pt.playlistId === playlistId && pt.trackId === trackId
    );
    
    if (!entry) return false;
    return this.playlistTracks.delete(entry[0]);
  }

  async updateTrackPosition(id: number, position: number): Promise<PlaylistTrack | undefined> {
    const playlistTrack = this.playlistTracks.get(id);
    if (!playlistTrack) return undefined;
    
    const updatedPlaylistTrack = { ...playlistTrack, position };
    this.playlistTracks.set(id, updatedPlaylistTrack);
    return updatedPlaylistTrack;
  }

  // Recently played operations
  async addRecentlyPlayed(insertRecentlyPlayed: InsertRecentlyPlayed): Promise<RecentlyPlayed> {
    // Check if track is already in recently played for this user
    const existing = Array.from(this.recentPlays.values()).find(
      rp => rp.userId === insertRecentlyPlayed.userId && rp.trackId === insertRecentlyPlayed.trackId
    );
    
    // If it exists, update the played time and return
    if (existing) {
      const updated = { ...existing, playedAt: insertRecentlyPlayed.playedAt };
      this.recentPlays.set(existing.id, updated);
      return updated;
    }
    
    // Otherwise create a new entry
    const id = this.currentRecentlyPlayedId++;
    const recentlyPlayed: RecentlyPlayed = { ...insertRecentlyPlayed, id };
    this.recentPlays.set(id, recentlyPlayed);
    return recentlyPlayed;
  }

  async getRecentlyPlayed(userId: number, limit = 10): Promise<RecentlyPlayed[]> {
    return Array.from(this.recentPlays.values())
      .filter(rp => rp.userId === userId)
      .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { config } from '../config/index.js';
import type { SongResult, AudDResponse } from '../types/index.js';

export class SongRecognitionService {
  private readonly apiUrl = 'https://api.audd.io/';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = config.auddApiKey;
    if (!this.apiKey || this.apiKey === 'test') {
      console.warn('⚠️  AudD API key not configured. Song recognition will not work.');
    }
  }

  /**
   * Identify a song from an audio file
   * @param audioPath - Path to the audio file
   * @returns Song metadata
   */
  async identifySong(audioPath: string): Promise<SongResult> {
    if (!this.apiKey || this.apiKey === 'test') {
      throw new Error('AudD API key not configured. Please set AUDD_API_KEY in your .env file.');
    }

    try {
      // Create form data with the audio file
      const form = new FormData();
      form.append('api_token', this.apiKey);
      form.append('file', fs.createReadStream(audioPath));

      // Send request to AudD API
      const response = await axios.post<AudDResponse>(this.apiUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
        timeout: 30000, // 30 second timeout
      });

      // Check if song was found
      if (response.data.status !== 'success' || !response.data.result) {
        throw new Error('NO_MATCH');
      }

      // Normalize the response to our SongResult format
      return this.normalizeSongData(response.data.result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid AudD API key');
        }
        if (error.response?.status === 429) {
          throw new Error('AudD API rate limit exceeded - please try again later');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Song recognition timeout - please try again');
        }
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Song recognition failed');
    }
  }

  /**
   * Normalize AudD API response to our SongResult format
   */
  private normalizeSongData(data: NonNullable<AudDResponse['result']>): SongResult {
    return {
      title: data.title,
      artist: data.artist,
      album: data.album,
      releaseDate: data.release_date,
      albumArt: this.getAlbumArt(data),
      externalLinks: {
        spotify: data.spotify?.external_urls?.spotify,
        appleMusic: data.apple_music?.url,
        youtube: data.song_link,
      },
    };
  }

  /**
   * Extract album art URL from AudD response
   * Note: AudD API doesn't always provide album art in the basic response
   * You may need to use additional API endpoints or fallback to external services
   */
  private getAlbumArt(data: NonNullable<AudDResponse['result']>): string | undefined {
    // AudD doesn't provide album art in the basic response
    // You can use Spotify or Apple Music URLs to fetch album art
    // For now, returning undefined - can be enhanced later
    return undefined;
  }
}

export const songRecognition = new SongRecognitionService();

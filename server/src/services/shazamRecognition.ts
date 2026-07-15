import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/index.js';
import type { SongResult } from '../types/index.js';

const execPromise = promisify(exec);

interface ShazamDetectResponse {
  matches?: Array<{ id: string }>;
  track?: {
    title: string;
    subtitle: string; // artist
    images?: {
      coverart?: string;
      background?: string;
    };
    hub?: {
      providers?: Array<{
        type: string;
        actions?: Array<{ uri?: string }>;
      }>;
      options?: Array<{
        actions?: Array<{ uri?: string }>;
      }>;
    };
    sections?: Array<{
      type: string;
      metadata?: Array<{ title: string; text: string }>;
    }>;
    url?: string;
  };
}

/**
 * Song recognition via Shazam (RapidAPI).
 * The detect endpoint expects base64-encoded raw audio:
 * 44100 Hz, 1 channel, signed 16-bit PCM little-endian, max ~500KB (~5s).
 */
export class ShazamRecognitionService {
  private readonly apiHost = 'shazam.p.rapidapi.com';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = config.rapidApiKey;
    if (!this.apiKey) {
      console.warn('⚠️  RAPIDAPI_KEY not configured. Shazam recognition will not work.');
    }
  }

  async identifySong(audioPath: string): Promise<SongResult> {
    if (!this.apiKey) {
      throw new Error('RapidAPI key not configured. Please set RAPIDAPI_KEY.');
    }

    // Shazam needs a short raw PCM sample. Try a couple of offsets within
    // the extracted segment in case the first seconds have no clear music.
    const offsets = [0, 5];
    for (const offset of offsets) {
      const rawPath = await this.convertToRawPcm(audioPath, offset);
      try {
        const base64Audio = await fs.readFile(rawPath, { encoding: 'base64' });
        const result = await this.detect(base64Audio);
        if (result) return result;
      } finally {
        await fs.unlink(rawPath).catch(() => {});
      }
    }

    throw new Error('NO_MATCH');
  }

  /**
   * Convert a slice of the input audio to raw PCM (44.1kHz mono s16le).
   * 5 seconds ≈ 441KB, just under the endpoint's ~500KB limit.
   */
  private async convertToRawPcm(audioPath: string, startOffset: number): Promise<string> {
    const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
    const rawPath = path.join(
      path.dirname(audioPath),
      `${path.basename(audioPath, path.extname(audioPath))}_${startOffset}.raw`
    );
    const command = `${ffmpegPath} -y -i "${audioPath}" -ss ${startOffset} -t 5 -ac 1 -ar 44100 -f s16le "${rawPath}"`;
    await execPromise(command, { timeout: 60000 });
    return rawPath;
  }

  private async detect(base64Audio: string): Promise<SongResult | null> {
    try {
      const response = await axios.post<ShazamDetectResponse>(
        `https://${this.apiHost}/songs/v2/detect`,
        base64Audio,
        {
          headers: {
            'content-type': 'text/plain',
            'x-rapidapi-host': this.apiHost,
            'x-rapidapi-key': this.apiKey,
          },
          timeout: 30000,
        }
      );

      const track = response.data?.track;
      if (!track) return null; // no match — caller decides whether to retry

      return this.normalizeSongData(track);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error('Invalid RapidAPI key or not subscribed to the Shazam API');
        }
        if (error.response?.status === 429) {
          throw new Error('Shazam API monthly quota exceeded - please try again later');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Song recognition timeout - please try again');
        }
      }
      throw error;
    }
  }

  private normalizeSongData(track: NonNullable<ShazamDetectResponse['track']>): SongResult {
    // Album and release date live in the metadata section
    const metadata = track.sections?.find(s => s.type === 'SONG')?.metadata || [];
    const album = metadata.find(m => m.title === 'Album')?.text;
    const released = metadata.find(m => m.title === 'Released')?.text;

    // Apple Music link from hub options
    const appleMusic = track.hub?.options?.[0]?.actions?.find(a => a.uri?.startsWith('https://'))?.uri;
    // Spotify search link from providers
    const spotifyProvider = track.hub?.providers?.find(p => p.type === 'SPOTIFY');
    const spotify = spotifyProvider?.actions?.[0]?.uri;

    return {
      title: track.title,
      artist: track.subtitle,
      ...(album && { album }),
      ...(released && { releaseDate: released }),
      ...(track.images?.coverart && { albumArt: track.images.coverart }),
      externalLinks: {
        ...(spotify && { spotify }),
        ...(appleMusic && { appleMusic }),
        ...(track.url && { youtube: track.url }),
      },
    };
  }
}

export const shazamRecognition = new ShazamRecognitionService();

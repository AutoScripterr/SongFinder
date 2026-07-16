import axios from 'axios';
import { config } from '../config/index.js';

interface AutolinkMedia {
  url: string;
  type: string; // 'video' | 'audio' | 'image'
  quality?: string;
  extension?: string;
}

interface AutolinkResponse {
  error?: boolean;
  title?: string;
  author?: string;
  medias?: AutolinkMedia[];
}

/**
 * Resolves a social video URL (TikTok, Instagram, etc.) to a direct
 * CDN media URL via the "Social Download All In One" RapidAPI.
 * Datacenter IPs are blocked by TikTok/Instagram, so we can't use
 * yt-dlp for those platforms in production — this API does the
 * resolution from its own infrastructure.
 */
export class MediaResolverService {
  private readonly apiHost = 'social-download-all-in-one.p.rapidapi.com';

  isConfigured(): boolean {
    return !!config.rapidApiKey;
  }

  /**
   * Returns a direct media URL (audio preferred, else video) or null
   * if the API can't resolve the link.
   */
  async resolveDirectMediaUrl(videoUrl: string): Promise<string | null> {
    if (!this.isConfigured()) return null;

    // The autolink API is flaky (sometimes returns empty medias on the
    // first hit, especially for Instagram) — retry a few times.
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const url = await this.tryResolve(videoUrl);
      if (url) return url;
      console.log(`Media resolver: empty result (attempt ${attempt}/${MAX_ATTEMPTS})`);
      if (attempt < MAX_ATTEMPTS) {
        await new Promise(r => setTimeout(r, 1500 * attempt));
      }
    }
    return null;
  }

  private async tryResolve(videoUrl: string): Promise<string | null> {
    try {
      const response = await axios.post<AutolinkResponse>(
        `https://${this.apiHost}/v1/social/autolink`,
        { url: videoUrl },
        {
          headers: {
            'content-type': 'application/json',
            'x-rapidapi-host': this.apiHost,
            'x-rapidapi-key': config.rapidApiKey,
          },
          timeout: 45000,
        }
      );

      const medias = response.data?.medias || [];
      if (response.data?.error || medias.length === 0) return null;

      // Prefer an audio-only track (TikTok exposes the music directly),
      // fall back to the lowest-bandwidth video.
      const audio = medias.find(m => m.type === 'audio' && m.url);
      if (audio) return audio.url;

      const video = medias.find(m => m.type === 'video' && m.url);
      return video?.url || null;
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      console.error(`Media resolver failed (status ${status ?? 'n/a'}):`,
        error instanceof Error ? error.message : error);
      if (status === 401 || status === 403) {
        throw new Error('DOWNLOADER_NOT_SUBSCRIBED');
      }
      if (status === 429) {
        throw new Error('Download service quota exceeded - please try again later');
      }
      return null; // other failures: let caller try remaining strategies
    }
  }
}

export const mediaResolver = new MediaResolverService();

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
  private readonly ytMp3Host = 'youtube-mp36.p.rapidapi.com';

  isConfigured(): boolean {
    return !!config.rapidApiKey;
  }

  /**
   * YouTube-specific resolver: the youtube-mp36 API serves the mp3 from
   * its own CDN, so the link is downloadable from any IP (googlevideo
   * URLs from autolink are IP-locked and useless from a datacenter).
   * Returns null if the video can't be converted or on quota/auth errors
   * (caller falls back to other strategies).
   */
  async resolveYoutubeMp3(videoUrl: string): Promise<string | null> {
    if (!this.isConfigured()) return null;
    const videoId = this.extractYoutubeId(videoUrl);
    if (!videoId) return null;

    // Conversion is async on their side: poll while status is 'processing'
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const response = await axios.get(`https://${this.ytMp3Host}/dl`, {
          params: { id: videoId },
          headers: {
            'x-rapidapi-host': this.ytMp3Host,
            'x-rapidapi-key': config.rapidApiKey,
          },
          timeout: 30000,
        });
        const { status, link } = response.data || {};
        if (status === 'ok' && link) return link;
        if (status !== 'processing') {
          console.log(`youtube-mp36: status=${status} for ${videoId}`);
          return null;
        }
      } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        console.error(`youtube-mp36 failed (status ${status ?? 'n/a'}):`,
          error instanceof Error ? error.message : error);
        return null;
      }
      await new Promise(r => setTimeout(r, 3000));
    }
    return null;
  }

  private extractYoutubeId(videoUrl: string): string | null {
    try {
      const u = new URL(videoUrl);
      const host = u.hostname.replace(/^www\.|^m\./, '');
      if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null;
      if (host === 'youtube.com' || host === 'music.youtube.com') {
        const v = u.searchParams.get('v');
        if (v) return v;
        const m = u.pathname.match(/^\/(shorts|embed|live)\/([\w-]{5,})/);
        if (m?.[2]) return m[2];
      }
      return null;
    } catch {
      return null;
    }
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

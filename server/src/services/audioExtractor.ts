import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { TEMP_DIR } from '../config/index.js';
import { mediaResolver } from './mediaResolver.js';

// execFile: no shell involved, so URLs are passed as-is — immune to
// command injection without needing to mangle them.
const execFilePromise = promisify(execFile);

// TikTok/Instagram block datacenter IPs, so yt-dlp is useless for them
// in production — go straight to the RapidAPI resolver for those.
const BLOCKED_FOR_YTDLP = /(^|\.)(tiktok\.com|instagram\.com)$/i;

export class AudioExtractor {
  /**
   * Extract audio from a video URL.
   * Strategy: RapidAPI resolver for TikTok/Instagram, yt-dlp for the rest,
   * each falling back to the other on failure.
   * @param videoUrl - The video URL to extract audio from
   * @param startTime - Start time in seconds (default: 0)
   * @returns Path to the extracted audio file
   */
  async extractAudio(videoUrl: string, startTime: number = 0): Promise<string> {
    // Validate URL
    if (!this.isValidUrl(videoUrl)) {
      throw new Error('Invalid URL provided');
    }

    // Ensure temp directory exists
    await fs.mkdir(TEMP_DIR, { recursive: true });

    // Generate unique filename
    const filename = `${Date.now()}-${uuidv4()}.mp3`;
    const outputPath = path.join(TEMP_DIR, filename);

    const preferResolver = this.isYtDlpBlocked(videoUrl) && mediaResolver.isConfigured();
    const strategies = preferResolver
      ? [() => this.extractViaResolver(videoUrl, startTime, outputPath),
         () => this.extractViaYtDlp(videoUrl, startTime, outputPath)]
      : [() => this.extractViaYtDlp(videoUrl, startTime, outputPath),
         () => this.extractViaResolver(videoUrl, startTime, outputPath)];

    let lastError: unknown = null;
    for (const strategy of strategies) {
      try {
        return await strategy();
      } catch (error) {
        lastError = error;
        await fs.unlink(outputPath).catch(() => {});
      }
    }

    throw this.toUserError(lastError);
  }

  /**
   * Extract with yt-dlp (works for YouTube; blocked by TikTok/IG on
   * datacenter IPs).
   */
  private async extractViaYtDlp(videoUrl: string, startTime: number, outputPath: string): Promise<string> {
    // Extract audio as MP3 from specified start time
    // -x: Extract audio only
    // --audio-format mp3: Convert to MP3
    // --audio-quality 0: Best quality (important for recognition)
    // --postprocessor-args: FFmpeg args to extract 60 second segment
    const ytDlpPath = process.env.YT_DLP_PATH || 'yt-dlp';
    await execFilePromise(ytDlpPath, [
      '-x', '--audio-format', 'mp3', '--audio-quality', '0',
      '--postprocessor-args', `ffmpeg:-ss ${startTime} -t 60`,
      '-o', outputPath,
      videoUrl,
    ], { timeout: 300000 });

    if (!(await this.fileExists(outputPath))) {
      throw new Error('Failed to extract audio - file not created');
    }
    return outputPath;
  }

  /**
   * Resolve a direct CDN URL via RapidAPI and convert with ffmpeg.
   */
  private async extractViaResolver(videoUrl: string, startTime: number, outputPath: string): Promise<string> {
    const directUrl = await mediaResolver.resolveDirectMediaUrl(videoUrl);
    if (!directUrl) {
      throw new Error('Could not resolve a downloadable media URL');
    }

    const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
    // Browser-like UA: some CDNs reject default ffmpeg user agents
    await execFilePromise(ffmpegPath, [
      '-y',
      '-user_agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      '-ss', String(startTime), '-t', '60',
      '-i', directUrl,
      '-vn', '-acodec', 'libmp3lame', '-q:a', '2',
      outputPath,
    ], { timeout: 300000 });

    if (!(await this.fileExists(outputPath))) {
      throw new Error('Failed to extract audio - file not created');
    }
    return outputPath;
  }

  private isYtDlpBlocked(videoUrl: string): boolean {
    try {
      const host = new URL(videoUrl).hostname.replace(/^www\./, '');
      return BLOCKED_FOR_YTDLP.test(host);
    } catch {
      return false;
    }
  }

  /**
   * Map internal errors to clean, user-safe messages. Full details are
   * logged server-side only — never leak commands/paths to the client.
   */
  private toUserError(error: unknown): Error {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Audio extraction failed:', message);

    if (message === 'DOWNLOADER_NOT_SUBSCRIBED') {
      return new Error('Download service is not available right now');
    }
    if (message.includes('Unsupported URL')) {
      return new Error('Video platform not supported');
    }
    if (message.includes('Video unavailable') || message.includes('This post may not be comfortable')) {
      return new Error('Video is unavailable or private');
    }
    if (message.includes('IP address is blocked') || message.includes('Sign in to confirm')) {
      return new Error('This platform is temporarily blocking downloads - please try again later');
    }
    if (message.includes('timeout')) {
      return new Error('Download timeout - video may be too large or connection is slow');
    }
    if (message.includes('quota exceeded')) {
      return new Error(message);
    }
    return new Error('Could not download this video - please check the link and try again');
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export const audioExtractor = new AudioExtractor();

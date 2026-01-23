import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { TEMP_DIR } from '../config/index.js';

const execPromise = promisify(exec);

export class AudioExtractor {
  /**
   * Extract audio from a video URL using yt-dlp
   * @param videoUrl - The video URL to extract audio from
   * @param startTime - Start time in seconds (default: 0)
   * @returns Path to the extracted audio file
   */
  async extractAudio(videoUrl: string, startTime: number = 0): Promise<string> {
    // Validate URL
    if (!this.isValidUrl(videoUrl)) {
      throw new Error('Invalid URL provided');
    }

    // Generate unique filename
    const filename = `${Date.now()}-${uuidv4()}.mp3`;
    const outputPath = path.join(TEMP_DIR, filename);

    try {
      // Ensure temp directory exists
      await fs.mkdir(TEMP_DIR, { recursive: true });

      // Extract 30 seconds of audio as MP3 from specified start time
      // -x: Extract audio
      // --audio-format mp3: Convert to MP3
      // --postprocessor-args: FFmpeg args to extract segment
      const ytDlpPath = process.env.YT_DLP_PATH || '/Users/oscmm/Library/Python/3.14/bin/yt-dlp';
      const ffmpegPath = process.env.FFMPEG_PATH || '/Users/oscmm/.local/bin/ffmpeg';
      const command = `${ytDlpPath} --ffmpeg-location "${ffmpegPath}" -x --audio-format mp3 --postprocessor-args "ffmpeg:-ss ${startTime} -t 30" -o "${outputPath}" "${this.sanitizeUrl(videoUrl)}"`;

      // Execute with 5-minute timeout
      await execPromise(command, { timeout: 300000 });

      // Verify file was created
      const fileExists = await this.fileExists(outputPath);
      if (!fileExists) {
        throw new Error('Failed to extract audio - file not created');
      }

      return outputPath;
    } catch (error) {
      // Clean up file if it exists
      try {
        await fs.unlink(outputPath);
      } catch {
        // Ignore cleanup errors
      }

      if (error instanceof Error) {
        // Parse yt-dlp errors for better user messages
        if (error.message.includes('Unsupported URL')) {
          throw new Error('Video platform not supported');
        }
        if (error.message.includes('Video unavailable')) {
          throw new Error('Video is unavailable or private');
        }
        if (error.message.includes('timeout')) {
          throw new Error('Download timeout - video may be too large or connection is slow');
        }
        throw new Error(`Audio extraction failed: ${error.message}`);
      }
      throw error;
    }
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
   * Sanitize URL to prevent command injection
   */
  private sanitizeUrl(url: string): string {
    // Remove any characters that could be used for command injection
    return url.replace(/[`$();&|<>]/g, '');
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

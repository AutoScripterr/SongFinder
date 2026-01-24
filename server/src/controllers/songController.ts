import type { Request, Response } from 'express';
import { z } from 'zod';
import { audioExtractor } from '../services/audioExtractor.js';
import { songRecognition } from '../services/songRecognition.js';
import { audioAnalyzer } from '../services/audioAnalyzer.js';
import { musicRecommendations } from '../services/musicRecommendations.js';
import { cleanupService } from '../services/cleanup.js';
import type { IdentifyRequest, IdentifyResponse } from '../types/index.js';

// Validation schema
const identifySchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export class SongController {
  /**
   * Identify song from video URL
   * POST /api/identify
   */
  async identify(req: Request, res: Response): Promise<void> {
    const audioPaths: string[] = [];
    let audioAnalysis: any = null;

    try {
      // Validate request body
      const validationResult = identifySchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: validationResult.error.issues[0]?.message || 'Invalid request',
        } as IdentifyResponse);
        return;
      }

      const { url } = validationResult.data as IdentifyRequest;

      console.log(`Processing video URL: ${url}`);

      // Try multiple segments from different parts of the video
      // Typically music is clearest at the start or middle of short videos
      const segments = [0, 15]; // Start and 15s in
      let songData = null;

      for (const startTime of segments) {
        try {
          // Step 1: Extract audio segment
          console.log(`Extracting audio from ${startTime}s...`);
          const audioPath = await audioExtractor.extractAudio(url, startTime);
          audioPaths.push(audioPath);
          console.log(`Audio extracted to: ${audioPath}`);

          // Step 2: Try to identify song immediately (skip analysis for speed)
          console.log('Identifying song...');
          songData = await songRecognition.identifySong(audioPath);
          console.log(`Song identified: ${songData.artist} - ${songData.title}`);

          // Success! Break out of loop
          break;
        } catch (error) {
          if (error instanceof Error && error.message === 'NO_MATCH') {
            console.log(`No match at ${startTime}s, trying next segment...`);
            continue; // Try next segment
          }
          throw error; // Re-throw other errors
        }
      }

      // If we found a song, return it
      if (songData) {
        res.json({
          success: true,
          data: songData,
        } as IdentifyResponse);
        return;
      }

      // If no song found after all attempts, throw NO_MATCH
      throw new Error('NO_MATCH');

    } catch (error) {
      console.error('Error identifying song:', error);

      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred';

      // Special handling for "no match" errors - provide helpful suggestions
      if (errorMessage === 'NO_MATCH') {
        res.status(200).json({
          success: false,
          error: 'Could not identify the song in this video',
          suggestions: [
            'Try a video with clearer music',
            'The song might be too new or not in our database',
            'Background music in videos with lots of talking is harder to identify'
          ],
        } as IdentifyResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: errorMessage,
      } as IdentifyResponse);

    } finally {
      // Step 4: Cleanup temp files
      for (const audioPath of audioPaths) {
        await cleanupService.deleteFile(audioPath);
      }
    }
  }

  /**
   * Health check endpoint
   * GET /api/health
   */
  async health(req: Request, res: Response): Promise<void> {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}

export const songController = new SongController();

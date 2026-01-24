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

      // Try multiple segments to find clearest music
      // More segments = better chance to find part with less speech
      const segments = [0, 10, 20, 30];
      let songData = null;

      for (const startTime of segments) {
        try {
          // Step 1: Extract audio segment
          console.log(`Extracting audio from ${startTime}s...`);
          const audioPath = await audioExtractor.extractAudio(url, startTime);
          audioPaths.push(audioPath);
          console.log(`Audio extracted to: ${audioPath}`);

          // Step 2: Analyze audio characteristics (only once)
          if (!audioAnalysis) {
            console.log('Analyzing audio...');
            audioAnalysis = await audioAnalyzer.analyzeAudio(audioPath);
            console.log(`Audio analysis: music-like=${audioAnalysis.hasMusicLikeCharacteristics}, confidence=${audioAnalysis.confidence}`);
          }

          // Step 3: Try to identify song
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
        let errorMsg = 'Song not found in our database';
        let suggestions: string[] = [];

        // Provide different feedback based on audio analysis
        if (audioAnalysis && !audioAnalysis.hasMusicLikeCharacteristics) {
          errorMsg = 'No music detected in this video';
          suggestions = [
            'This video appears to contain only background noise or speech',
            'Try a video with clear, recognizable music playing',
            'Music should be the primary audio, not background sound',
            'Look for music videos, concerts, or videos with prominent songs'
          ];
        } else {
          // Music detected but not recognized - provide recommendations
          errorMsg = 'Music detected but not identified (tried multiple segments)';
          suggestions = [
            'This might be ambient, lofi, or trending social media music',
            '---',
            ...musicRecommendations.formatRecommendationsAsSuggestions(true)
          ];
        }

        res.status(200).json({
          success: false,
          error: errorMsg,
          suggestions,
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

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export interface AudioAnalysis {
  hasMusicLikeCharacteristics: boolean;
  confidence: number;
  details: {
    meanVolume: number;
    maxVolume: number;
    silenceRatio: number;
  };
}

export class AudioAnalyzer {
  /**
   * Analyze audio file to determine if it contains music-like characteristics
   * @param audioPath - Path to the audio file
   * @returns Analysis results
   */
  async analyzeAudio(audioPath: string): Promise<AudioAnalysis> {
    try {
      const ffmpegPath = process.env.FFMPEG_PATH || '/Users/oscmm/.local/bin/ffmpeg';

      // Get audio statistics using ffmpeg
      // -af volumedetect: Analyzes volume levels
      // -f null: No output file needed
      const command = `${ffmpegPath} -i "${audioPath}" -af "volumedetect" -f null - 2>&1`;

      const { stdout, stderr } = await execPromise(command, { timeout: 30000 });
      const output = stdout + stderr;

      // Parse volume information
      const meanVolumeMatch = output.match(/mean_volume:\s*([-\d.]+)\s*dB/);
      const maxVolumeMatch = output.match(/max_volume:\s*([-\d.]+)\s*dB/);

      const meanVolume = meanVolumeMatch ? parseFloat(meanVolumeMatch[1]) : -100;
      const maxVolume = maxVolumeMatch ? parseFloat(maxVolumeMatch[1]) : -100;

      // Detect silence ratio
      const silenceCommand = `${ffmpegPath} -i "${audioPath}" -af "silencedetect=noise=-30dB:d=0.5" -f null - 2>&1`;
      const silenceOutput = await execPromise(silenceCommand, { timeout: 30000 });
      const silenceMatches = (silenceOutput.stdout + silenceOutput.stderr).match(/silence_/g);
      const silenceCount = silenceMatches ? silenceMatches.length : 0;

      // Calculate silence ratio (rough estimate)
      const silenceRatio = silenceCount / 60; // Assuming ~60 seconds of audio

      // Heuristics for music detection
      // Music typically has:
      // 1. Higher average volume (> -40 dB)
      // 2. Good dynamic range (max > -10 dB)
      // 3. Lower silence ratio (< 0.3)

      let hasMusicLikeCharacteristics = false;
      let confidence = 0;

      if (meanVolume > -40 && maxVolume > -10 && silenceRatio < 0.3) {
        hasMusicLikeCharacteristics = true;
        confidence = 0.7;
      } else if (meanVolume > -50 && maxVolume > -15) {
        hasMusicLikeCharacteristics = true;
        confidence = 0.5;
      } else if (meanVolume < -60 || silenceRatio > 0.5) {
        hasMusicLikeCharacteristics = false;
        confidence = 0.8; // High confidence it's NOT music
      }

      return {
        hasMusicLikeCharacteristics,
        confidence,
        details: {
          meanVolume,
          maxVolume,
          silenceRatio,
        },
      };
    } catch (error) {
      console.error('Error analyzing audio:', error);
      // If analysis fails, return neutral result
      return {
        hasMusicLikeCharacteristics: true, // Assume music by default
        confidence: 0.3,
        details: {
          meanVolume: -50,
          maxVolume: -10,
          silenceRatio: 0.2,
        },
      };
    }
  }
}

export const audioAnalyzer = new AudioAnalyzer();

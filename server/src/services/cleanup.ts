import fs from 'fs/promises';
import path from 'path';
import { TEMP_DIR } from '../config/index.js';

export class CleanupService {
  /**
   * Delete a specific file
   * @param filePath - Path to the file to delete
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
    }
  }

  /**
   * Clean up old temporary files
   * Deletes files older than the specified age in minutes
   * @param olderThanMinutes - Delete files older than this many minutes (default: 60)
   */
  async cleanupOldFiles(olderThanMinutes: number = 60): Promise<void> {
    try {
      const files = await fs.readdir(TEMP_DIR);
      const now = Date.now();
      const maxAge = olderThanMinutes * 60 * 1000; // Convert to milliseconds

      for (const file of files) {
        const filePath = path.join(TEMP_DIR, file);

        try {
          const stats = await fs.stat(filePath);

          // Check if file is older than maxAge
          if (now - stats.mtimeMs > maxAge) {
            await fs.unlink(filePath);
            console.log(`Deleted old temp file: ${file}`);
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old files:', error);
    }
  }

  /**
   * Start periodic cleanup task
   * Runs cleanup every specified interval
   * @param intervalMinutes - How often to run cleanup (default: 30)
   * @param fileAgeMinutes - Delete files older than this (default: 60)
   */
  startPeriodicCleanup(intervalMinutes: number = 30, fileAgeMinutes: number = 60): void {
    const intervalMs = intervalMinutes * 60 * 1000;

    // Run cleanup immediately on start
    this.cleanupOldFiles(fileAgeMinutes);

    // Schedule periodic cleanup
    setInterval(() => {
      this.cleanupOldFiles(fileAgeMinutes);
    }, intervalMs);

    console.log(`Started periodic cleanup: running every ${intervalMinutes} minutes, deleting files older than ${fileAgeMinutes} minutes`);
  }

  /**
   * Cleanup all files in temp directory
   * Use with caution - typically only for shutdown or testing
   */
  async cleanupAll(): Promise<void> {
    try {
      const files = await fs.readdir(TEMP_DIR);

      for (const file of files) {
        const filePath = path.join(TEMP_DIR, file);
        await fs.unlink(filePath);
      }

      console.log(`Cleaned up ${files.length} temp files`);
    } catch (error) {
      console.error('Error cleaning up all files:', error);
    }
  }
}

export const cleanupService = new CleanupService();

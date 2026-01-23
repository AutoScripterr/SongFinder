export interface SongResult {
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  albumArt?: string;
  externalLinks?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
  };
  confidence?: number;
}

export interface IdentifyResponse {
  success: boolean;
  data?: SongResult;
  error?: string;
  suggestions?: string[];
}

export type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; song: SongResult }
  | { status: 'error'; message: string; suggestions?: string[] };

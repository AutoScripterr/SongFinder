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

export interface IdentifyRequest {
  url: string;
}

export interface IdentifyResponse {
  success: boolean;
  data?: SongResult;
  error?: string;
  suggestions?: string[];
}

export interface AudDResponse {
  status: string;
  result: {
    artist: string;
    title: string;
    album?: string;
    release_date?: string;
    song_link?: string;
    apple_music?: {
      url?: string;
    };
    spotify?: {
      external_urls?: {
        spotify?: string;
      };
    };
  } | null;
}

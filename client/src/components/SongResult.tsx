import type { SongResult as SongData } from '../types';
import { useState, useEffect } from 'react';

interface SongResultProps {
  song: SongData;
  onTryAnother: () => void;
}

export function SongResult({ song, onTryAnother }: SongResultProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 2 seconds
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      {/* Confetti effect (brief celebration) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-pink-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
        </div>
      )}

      {/* Success badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card">
          <svg className="w-6 h-6" style={{color: 'var(--success)'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold text-white">Song Found!</span>
        </div>
      </div>

      {/* Main card with Spotify-style design */}
      <div className="glass-card overflow-hidden hover-lift">
        {/* Album art section with blur background - Spotify style */}
        {song.albumArt && (
          <div className="relative h-80 overflow-hidden">
            {/* Blurred background */}
            <div
              className="absolute inset-0 scale-110 blur-2xl opacity-60"
              style={{
                backgroundImage: `url(${song.albumArt})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>

            {/* Album art - centered and elevated */}
            <div className="relative h-full flex items-center justify-center p-8">
              <img
                src={song.albumArt}
                alt={`${song.album || song.title} album art`}
                className="max-h-full w-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}

        {/* Song info section */}
        <div className="p-6 md:p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            {song.title}
          </h2>
          <p className="text-xl md:text-2xl mb-4" style={{color: 'var(--text-secondary)'}}>
            {song.artist}
          </p>

          {song.album && (
            <p className="text-base mb-2" style={{color: 'var(--text-secondary)'}}>
              <span className="opacity-60">Album:</span> {song.album}
            </p>
          )}
          {song.releaseDate && (
            <p className="text-sm mb-6" style={{color: 'var(--text-disabled)'}}>
              Released: {song.releaseDate}
            </p>
          )}

          {/* Streaming platform buttons */}
          {song.externalLinks && (
            <div className="mt-8 space-y-4">
              <p className="text-sm font-semibold" style={{color: 'var(--text-secondary)'}}>
                Listen now:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {song.externalLinks.spotify && (
                  <a
                    href={song.externalLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all hover-lift"
                    style={{
                      background: '#1DB954',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(29, 185, 84, 0.3)'
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Spotify
                  </a>
                )}
                {song.externalLinks.appleMusic && (
                  <a
                    href={song.externalLinks.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all hover-lift"
                    style={{
                      background: 'linear-gradient(135deg, #FA2D48 0%, #FA6D86 100%)',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(250, 45, 72, 0.3)'
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 0 0-.1 1.18c0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 0 0 1.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 0 0 2.028-2.48c.22-.63.292-1.29.323-1.964.025-.535.025-1.068.025-1.603.007-4.061.007-8.122 0-12.183z"/>
                    </svg>
                    Apple Music
                  </a>
                )}
                {song.externalLinks.youtube && (
                  <a
                    href={song.externalLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all hover-lift"
                    style={{
                      background: '#FF0000',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(255, 0, 0, 0.3)'
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Try Another Button */}
          <button
            onClick={onTryAnother}
            className="mt-10 w-full py-4 px-6 rounded-xl font-semibold transition-all hover-lift"
            style={{
              background: 'var(--surface-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)'
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Another Song
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

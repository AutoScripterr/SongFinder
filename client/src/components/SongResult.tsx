import type { SongResult as SongData } from '../types';
import { useState, useEffect } from 'react';

interface SongResultProps {
  song: SongData;
  onTryAnother: () => void;
}

export function SongResult({ song, onTryAnother }: SongResultProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ maxWidth: '720px', margin: '40px auto', padding: '0 16px' }}>
      {/* Confetti effect */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
          <div style={{ position: 'absolute', top: '25%', left: '25%', width: '16px', height: '16px', background: '#a855f7', borderRadius: '50%', animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
          <div style={{ position: 'absolute', top: '33%', right: '25%', width: '12px', height: '12px', background: '#ec4899', borderRadius: '50%', animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.2s' }}></div>
        </div>
      )}

      {/* Success badge */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{ color: '#1DB954', fontSize: '20px' }}>✓</span>
          <span style={{ fontWeight: 600, color: '#fff' }}>Song Found!</span>
        </div>
      </div>

      {/* Main card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {/* Album art */}
        {song.albumArt && (
          <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${song.albumArt})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px)',
              transform: 'scale(1.1)',
              opacity: 0.6
            }}></div>
            <div style={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px'
            }}>
              <img
                src={song.albumArt}
                alt={`${song.album || song.title} album art`}
                style={{ maxHeight: '100%', width: 'auto', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
              />
            </div>
          </div>
        )}

        {/* Song info */}
        <div style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
            {song.title}
          </h2>
          <p style={{ fontSize: '1.5rem', color: '#B3B3B3', marginBottom: '16px' }}>
            {song.artist}
          </p>

          {song.album && (
            <p style={{ fontSize: '1rem', color: '#B3B3B3', marginBottom: '8px' }}>
              <span style={{ opacity: 0.6 }}>Album:</span> {song.album}
            </p>
          )}
          {song.releaseDate && (
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '24px' }}>
              Released: {song.releaseDate}
            </p>
          )}

          {/* Streaming links */}
          {song.externalLinks && (
            <div style={{ marginTop: '32px' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#B3B3B3', marginBottom: '16px' }}>
                Listen now:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                {song.externalLinks.spotify && (
                  <a
                    href={song.externalLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      background: '#1DB954',
                      color: 'white',
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(29, 185, 84, 0.3)'
                    }}
                  >
                    Spotify
                  </a>
                )}
                {song.externalLinks.appleMusic && (
                  <a
                    href={song.externalLinks.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #FA2D48 0%, #FA6D86 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(250, 45, 72, 0.3)'
                    }}
                  >
                    Apple Music
                  </a>
                )}
                {song.externalLinks.youtube && (
                  <a
                    href={song.externalLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      background: '#FF0000',
                      color: 'white',
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(255, 0, 0, 0.3)'
                    }}
                  >
                    YouTube
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Try another button */}
          <button
            onClick={onTryAnother}
            style={{
              marginTop: '40px',
              width: '100%',
              padding: '16px 24px',
              borderRadius: '12px',
              fontWeight: 600,
              background: 'rgba(255,255,255,0.1)',
              color: '#B3B3B3',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer'
            }}
          >
            🔍 Find Another Song
          </button>
        </div>
      </div>
    </div>
  );
}

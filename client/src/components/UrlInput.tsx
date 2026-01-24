import { useState } from 'react';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
      {/* Logo */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <span style={{ fontSize: '36px' }}>🎵</span>
        </div>
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
        Identify Any Song<br />
        <span style={{
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          From Any Video
        </span>
      </h1>

      {/* Subheadline */}
      <p style={{ fontSize: '1.1rem', color: '#B3B3B3', marginBottom: '32px' }}>
        Paste a TikTok, Instagram or YouTube link.<br />
        <strong style={{ color: '#fff' }}>Get the song name in under 30 seconds.</strong>
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          padding: '6px'
        }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="🔗 Paste video URL here…"
            disabled={isLoading}
            autoFocus
            style={{
              width: '100%',
              padding: '22px 18px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '1.1rem'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          style={{
            width: '100%',
            padding: '20px 32px',
            borderRadius: '16px',
            fontSize: '1.25rem',
            fontWeight: 800,
            background: isLoading || !url.trim() ? '#282828' : 'linear-gradient(135deg, #1E88E5, #42A5F5)',
            color: '#fff',
            border: 'none',
            cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
            boxShadow: isLoading || !url.trim() ? 'none' : '0 12px 32px rgba(30,136,229,0.45)',
            opacity: isLoading || !url.trim() ? 0.5 : 1
          }}
        >
          {isLoading ? '⏳ Analyzing audio…' : '🔍 Find Song Now'}
        </button>

        <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
          No signup • 100% free • Works instantly
        </div>
      </form>

      {/* Platforms */}
      <div style={{
        marginTop: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px',
        fontSize: '0.85rem',
        color: '#B3B3B3'
      }}>
        <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>📱 TikTok</span>
        <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>📷 Instagram</span>
        <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>▶️ YouTube</span>
        <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>+1000 platforms</span>
      </div>

      {/* Stats */}
      <div style={{
        marginTop: '40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px'
      }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>100% Free</div>
          <div style={{ fontSize: '0.8rem', color: '#B3B3B3' }}>No signup</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>&lt; 30s</div>
          <div style={{ fontSize: '0.8rem', color: '#B3B3B3' }}>Average result</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>1000+</div>
          <div style={{ fontSize: '0.8rem', color: '#B3B3B3' }}>Platforms</div>
        </div>
      </div>
    </div>
  );
}

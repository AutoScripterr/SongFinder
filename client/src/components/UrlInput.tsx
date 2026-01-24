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
    <div className="w-full max-w-4xl mx-auto text-center px-4">
      {/* Logo/Icon with animation */}
      <div className="mb-10 inline-block relative">
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl hover-lift">
          <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
      </div>

      {/* Title with gradient */}
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
        <span className="gradient-text">Song Identifier</span>
      </h1>

      <p className="text-base md:text-lg lg:text-xl mb-10 max-w-2xl mx-auto" style={{color: 'var(--text-secondary)'}}>
        Find any song from <span className="text-white font-semibold">TikTok, YouTube, Instagram</span> videos
      </p>

      {/* Input Form with Glassmorphism */}
      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
        <div className="glass-card p-1.5 hover-lift">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="🔗 Paste video URL here..."
            className="w-full px-5 py-4 md:px-6 md:py-5 bg-transparent text-white placeholder-gray-400 text-base md:text-lg outline-none"
            style={{caretColor: 'var(--primary)'}}
            disabled={isLoading}
            required
            autoFocus
          />
        </div>

        {/* Shazam-style Big Button */}
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="relative w-full py-4 md:py-5 px-6 md:px-8 rounded-2xl font-bold text-lg md:text-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift"
          style={{
            background: isLoading || !url.trim()
              ? 'var(--surface-elevated)'
              : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            color: 'white',
            boxShadow: isLoading || !url.trim()
              ? 'none'
              : '0 8px 32px rgba(30, 136, 229, 0.4)'
          }}
        >
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>

          <span className="relative flex items-center justify-center gap-2.5 md:gap-3">
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Identify Song
              </>
            )}
          </span>
        </button>
      </form>

      {/* Platform badges */}
      <div className="mt-10 md:mt-14 flex flex-wrap justify-center gap-3 text-sm md:text-base" style={{color: 'var(--text-secondary)'}}>
        <div className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full glass-card float-animation">
          <span className="text-base md:text-lg">📱</span>
          <span>TikTok</span>
        </div>
        <div className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full glass-card float-animation" style={{animationDelay: '0.2s'}}>
          <span className="text-base md:text-lg">📷</span>
          <span>Instagram</span>
        </div>
        <div className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full glass-card float-animation" style={{animationDelay: '0.4s'}}>
          <span className="text-base md:text-lg">▶️</span>
          <span>YouTube</span>
        </div>
        <div className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full glass-card float-animation" style={{animationDelay: '0.6s'}}>
          <span className="text-base md:text-lg">🌐</span>
          <span>1000+ more</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center max-w-3xl mx-auto">
        <div className="glass-card p-5 md:p-6 rounded-xl hover-lift">
          <div className="text-2xl md:text-3xl font-bold gradient-text mb-1 md:mb-2">100% Free</div>
          <div className="text-xs md:text-sm" style={{color: 'var(--text-secondary)'}}>No signup required</div>
        </div>
        <div className="glass-card p-5 md:p-6 rounded-xl hover-lift">
          <div className="text-2xl md:text-3xl font-bold gradient-text mb-1 md:mb-2">&lt; 30s</div>
          <div className="text-xs md:text-sm" style={{color: 'var(--text-secondary)'}}>Average identification time</div>
        </div>
        <div className="glass-card p-5 md:p-6 rounded-xl hover-lift">
          <div className="text-2xl md:text-3xl font-bold gradient-text mb-1 md:mb-2">1000+</div>
          <div className="text-xs md:text-sm" style={{color: 'var(--text-secondary)'}}>Platforms supported</div>
        </div>
      </div>
    </div>
  );
}

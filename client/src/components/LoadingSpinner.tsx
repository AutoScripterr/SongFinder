import { useState, useEffect } from 'react';

export function LoadingSpinner() {
  const [loadingText, setLoadingText] = useState('Extracting audio');
  const [dots, setDots] = useState('');

  // Animated loading messages
  useEffect(() => {
    const messages = [
      'Extracting audio',
      'Analyzing frequency patterns',
      'Filtering background noise',
      'Searching millions of songs',
      'Almost there',
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Shazam-style circular waves */}
      <div className="relative w-32 h-32 mb-8">
        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
            <svg className="w-10 h-10 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        </div>

        {/* Animated circular waves - contained */}
        <div className="absolute inset-0">
          <div
            className="wave-contained absolute top-0 left-0 w-full h-full rounded-full border-2 opacity-70"
            style={{
              borderColor: 'var(--primary)',
            }}
          ></div>
        </div>
        <div className="absolute inset-0">
          <div
            className="wave-contained absolute top-0 left-0 w-full h-full rounded-full border-2 opacity-60"
            style={{
              borderColor: 'var(--accent-start)',
              animationDelay: '0.3s'
            }}
          ></div>
        </div>
        <div className="absolute inset-0">
          <div
            className="wave-contained absolute top-0 left-0 w-full h-full rounded-full border-2 opacity-50"
            style={{
              borderColor: 'var(--accent-end)',
              animationDelay: '0.6s'
            }}
          ></div>
        </div>
        <div className="absolute inset-0">
          <div
            className="wave-contained absolute top-0 left-0 w-full h-full rounded-full border-2 opacity-40"
            style={{
              borderColor: 'var(--primary-light)',
              animationDelay: '0.9s'
            }}
          ></div>
        </div>
      </div>

      {/* Loading text with animation */}
      <div className="text-center space-y-3 max-w-md mx-auto">
        <p className="text-xl font-semibold text-white">
          {loadingText}
          <span className="inline-block w-8 text-left" style={{color: 'var(--primary)'}}>
            {dots}
          </span>
        </p>
        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
          Analyzing multiple segments for best results
        </p>
      </div>

      {/* Progress indicators */}
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
      </div>
    </div>
  );
}

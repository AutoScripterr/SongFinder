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
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 text-gray-900">
        Song Identifier
      </h1>
      <p className="text-base md:text-lg text-center text-gray-600 mb-8">
        Identify songs from any video URL
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here (YouTube, Vimeo, TikTok, Instagram...)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
        >
          {isLoading ? 'Identifying...' : 'Identify Song'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p className="font-medium mb-2">Supported platforms:</p>
        <p>YouTube, Vimeo, TikTok, Instagram, Facebook, and 1000+ more</p>
      </div>
    </div>
  );
}

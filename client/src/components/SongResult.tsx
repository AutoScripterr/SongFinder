import type { SongResult as SongData } from '../types';

interface SongResultProps {
  song: SongData;
  onTryAnother: () => void;
}

export function SongResult({ song, onTryAnother }: SongResultProps) {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Album Art */}
        {song.albumArt && (
          <div className="w-full h-64 bg-gray-200">
            <img
              src={song.albumArt}
              alt={`${song.album} album art`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Song Info */}
        <div className="p-4 md:p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {song.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-1">{song.artist}</p>
          {song.album && (
            <p className="text-gray-600 mb-4">Album: {song.album}</p>
          )}
          {song.releaseDate && (
            <p className="text-gray-500 text-sm mb-4">
              Released: {song.releaseDate}
            </p>
          )}

          {/* External Links */}
          {song.externalLinks && (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Listen on:
              </p>
              <div className="flex flex-wrap gap-3">
                {song.externalLinks.spotify && (
                  <a
                    href={song.externalLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
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
                    className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 0 0-.1 1.18c0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 0 0 1.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 0 0 2.028-2.48c.22-.63.292-1.29.323-1.964.025-.535.025-1.068.025-1.603.007-4.061.007-8.122 0-12.183zM12.258 4.15c.463-.02.93-.01 1.396.062.793.123 1.46.463 1.94 1.15.29.413.437.88.448 1.38.011.522-.13.996-.43 1.42-.48.674-1.145.99-1.934 1.1-.195.026-.39.043-.587.038-.543-.013-1.043-.17-1.497-.473-.51-.34-.86-.798-1.027-1.37-.125-.425-.125-.853.015-1.278a2.64 2.64 0 0 1 1.677-1.978 3.03 3.03 0 0 1 1-.05zm6.195 11.237c-.015.397-.103.788-.256 1.163-.31.758-.802 1.328-1.53 1.7-.597.304-1.238.44-1.906.448-.98.013-1.96.013-2.94-.01-.863-.02-1.69-.187-2.474-.556-.715-.337-1.286-.82-1.72-1.48a3.957 3.957 0 0 1-.54-1.66c-.027-.276-.027-.553-.015-.828.02-.483.15-.947.404-1.372.31-.52.755-.903 1.323-1.128a3.397 3.397 0 0 1 1.472-.285c.723.015 1.446.067 2.168.13.68.06 1.36.135 2.04.22.31.04.617.098.925.162.35.073.69.18 1.017.326.55.246.995.61 1.323 1.11.348.528.524 1.113.524 1.74-.003.44-.003.88-.01 1.32z"/>
                    </svg>
                    Apple Music
                  </a>
                )}
                {song.externalLinks.youtube && (
                  <a
                    href={song.externalLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
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
            className="mt-8 w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Try Another Video
          </button>
        </div>
      </div>
    </div>
  );
}

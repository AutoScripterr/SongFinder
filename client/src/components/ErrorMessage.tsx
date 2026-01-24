interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  suggestions?: string[];
}

export function ErrorMessage({ message, onRetry, suggestions }: ErrorMessageProps) {
  return (
    <div className="max-w-2xl mx-auto mt-6 md:mt-8 px-4">
      <div className="glass-card border-red-500/30 p-5 md:p-6" style={{background: 'rgba(239, 68, 68, 0.05)'}}>
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 md:h-6 md:w-6"
              style={{color: '#EF4444'}}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm md:text-base font-semibold text-white mb-2">Song Not Found</h3>
            <p className="text-sm md:text-base" style={{color: 'var(--text-secondary)'}}>{message}</p>

            {suggestions && suggestions.length > 0 && (
              <div className="mt-4 md:mt-5">
                <h4 className="text-xs md:text-sm font-semibold text-white mb-2">💡 Suggestions:</h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm" style={{color: 'var(--text-secondary)'}}>
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={onRetry}
              className="mt-5 md:mt-6 px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base text-white transition-all hover-lift"
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
              }}
            >
              Try Another Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

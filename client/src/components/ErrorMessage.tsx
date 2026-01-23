interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  suggestions?: string[];
}

export function ErrorMessage({ message, onRetry, suggestions }: ErrorMessageProps) {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
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
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">Song Not Found</h3>
            <p className="mt-2 text-sm text-red-700">{message}</p>

            {suggestions && suggestions.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">💡 Suggestions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={onRetry}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Another Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

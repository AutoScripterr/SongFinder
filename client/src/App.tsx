import { useSongIdentifier } from './hooks/useSongIdentifier';
import { UrlInput } from './components/UrlInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { SongResult } from './components/SongResult';
import { FAQ } from './components/FAQ';

function App() {
  const { state, identify, reset } = useSongIdentifier();

  return (
    <div className="min-h-screen py-6 md:py-10 lg:py-12 px-4">
      {/* Gradient background overlay */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-pink-500/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto">
        {state.status === 'idle' && (
          <div className="fade-in">
            <UrlInput onSubmit={identify} isLoading={false} />
          </div>
        )}

        {state.status === 'loading' && (
          <div className="scale-in">
            <UrlInput onSubmit={identify} isLoading={true} />
            <LoadingSpinner />
          </div>
        )}

        {state.status === 'success' && (
          <div className="fade-in">
            <SongResult song={state.song} onTryAnother={reset} />
          </div>
        )}

        {state.status === 'error' && (
          <div className="fade-in">
            <UrlInput onSubmit={identify} isLoading={false} />
            <ErrorMessage message={state.message} onRetry={reset} suggestions={state.suggestions} />
          </div>
        )}

        {/* Always show FAQ for SEO */}
        {(state.status === 'idle' || state.status === 'error') && (
          <div className="mt-20 fade-in">
            <FAQ />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

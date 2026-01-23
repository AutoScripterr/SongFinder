import { useSongIdentifier } from './hooks/useSongIdentifier';
import { UrlInput } from './components/UrlInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { SongResult } from './components/SongResult';
import { FAQ } from './components/FAQ';

function App() {
  const { state, identify, reset } = useSongIdentifier();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {state.status === 'idle' && (
          <UrlInput onSubmit={identify} isLoading={false} />
        )}

        {state.status === 'loading' && (
          <>
            <UrlInput onSubmit={identify} isLoading={true} />
            <LoadingSpinner />
          </>
        )}

        {state.status === 'success' && (
          <SongResult song={state.song} onTryAnother={reset} />
        )}

        {state.status === 'error' && (
          <>
            <UrlInput onSubmit={identify} isLoading={false} />
            <ErrorMessage message={state.message} onRetry={reset} suggestions={state.suggestions} />
          </>
        )}

        {/* Always show FAQ for SEO */}
        {(state.status === 'idle' || state.status === 'error') && <FAQ />}
      </div>
    </div>
  );
}

export default App;

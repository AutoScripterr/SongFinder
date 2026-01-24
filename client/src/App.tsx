import { useSongIdentifier } from './hooks/useSongIdentifier';
import { UrlInput } from './components/UrlInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { SongResult } from './components/SongResult';
import { FAQ } from './components/FAQ';

function App() {
  const { state, identify, reset } = useSongIdentifier();

  return (
    <div style={{ minHeight: '100vh', padding: '40px 16px' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(147,51,234,0.18), transparent, rgba(236,72,153,0.18))'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '320px',
          height: '320px',
          background: 'rgba(139,92,246,0.12)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '20%',
          width: '320px',
          height: '320px',
          background: 'rgba(236,72,153,0.12)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {state.status === 'idle' && (
          <>
            <UrlInput onSubmit={identify} isLoading={false} />
            <FAQ />
          </>
        )}

        {state.status === 'loading' && (
          <>
            <UrlInput onSubmit={identify} isLoading={true} />
            <LoadingSpinner />
          </>
        )}

        {state.status === 'success' && (
          <>
            <SongResult song={state.song} onTryAnother={reset} />
          </>
        )}

        {state.status === 'error' && (
          <>
            <UrlInput onSubmit={identify} isLoading={false} />
            <ErrorMessage message={state.message} onRetry={reset} suggestions={state.suggestions} />
            <FAQ />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

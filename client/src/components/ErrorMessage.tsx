interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  suggestions?: string[];
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div style={{ marginTop: '24px', color: '#F87171', textAlign: 'center' }}>
      ❌ Could not identify the song. Try another video.
      <br />
      <button
        onClick={onRetry}
        style={{
          marginTop: '16px',
          padding: '12px 24px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        Try Another Video
      </button>
    </div>
  );
}

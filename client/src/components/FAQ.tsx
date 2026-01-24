export function FAQ() {
  return (
    <div style={{ marginTop: '80px', maxWidth: '720px', marginInline: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>FAQ</h2>

      <details style={{ marginBottom: '12px' }}>
        <summary>Is this free?</summary>
        <p>Yes. No signup, no limits.</p>
      </details>

      <details style={{ marginBottom: '12px' }}>
        <summary>Which platforms are supported?</summary>
        <p>TikTok, Instagram Reels, YouTube and over 1000 more.</p>
      </details>

      <details>
        <summary>How accurate is it?</summary>
        <p>We analyze multiple audio segments for best match.</p>
      </details>
    </div>
  );
}

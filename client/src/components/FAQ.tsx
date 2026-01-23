export function FAQ() {
  const faqs = [
    {
      question: "How do I identify a song from a TikTok video?",
      answer: "Simply copy the TikTok video URL, paste it into our song identifier tool, and click 'Identify Song'. Our system will analyze the audio and tell you the song name, artist, and provide links to listen on Spotify and Apple Music."
    },
    {
      question: "Is this song finder free to use?",
      answer: "Yes! Our song identifier is completely free. You can identify songs from TikTok, Instagram, YouTube, and over 1000 other platforms without any cost."
    },
    {
      question: "What video platforms are supported?",
      answer: "We support over 1000 platforms including TikTok, Instagram Reels, YouTube, Vimeo, Facebook, Twitter, and many more. If it's a video URL, we can likely identify the music."
    },
    {
      question: "How accurate is the song identification?",
      answer: "Our tool uses advanced audio recognition technology with access to millions of songs. We try multiple segments of the video to ensure the best match, giving you accurate results for most popular music."
    },
    {
      question: "Can I identify songs from Instagram Reels?",
      answer: "Yes! Instagram Reels are fully supported. Just copy the Reel URL and paste it into our tool to instantly identify the background music."
    }
  ];

  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-700">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* SEO Footer Text */}
      <div className="mt-12 text-center text-sm text-gray-600 max-w-2xl mx-auto">
        <p className="mb-4">
          <strong>Song Identifier Tool</strong> - The best free online tool to identify songs from any video.
          Find music from TikTok videos, Instagram Reels, YouTube clips, and over 1000 other platforms instantly.
          No registration required, completely free, and works on all devices.
        </p>
        <p>
          Popular searches: tiktok song finder, instagram reel music finder, youtube song identifier,
          what song is this, identify song from video, find song name from video, music recognition tool
        </p>
      </div>
    </div>
  );
}

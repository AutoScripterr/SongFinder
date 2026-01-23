export interface MusicRecommendation {
  title: string;
  artist: string;
  genre: string;
  spotifySearch: string;
}

export class MusicRecommendationService {
  /**
   * Get popular ambient/background music recommendations
   * These are commonly used in social media videos
   */
  getPopularAmbientMusic(): MusicRecommendation[] {
    return [
      { title: "Lofi Hip Hop", artist: "Various Artists", genre: "Lofi", spotifySearch: "lofi hip hop beats" },
      { title: "Aesthetic", artist: "Xilo", genre: "Ambient", spotifySearch: "aesthetic xilo" },
      { title: "Buttercup", artist: "Jack Stauber", genre: "Indie", spotifySearch: "buttercup jack stauber" },
      { title: "Snowfall", artist: "Øneheart x reidenshi", genre: "Ambient", spotifySearch: "snowfall oneheart" },
      { title: "Drive Forever", artist: "Sergio Valentino", genre: "Phonk", spotifySearch: "drive forever sergio valentino" },
      { title: "Resonance", artist: "HOME", genre: "Synthwave", spotifySearch: "resonance home" },
      { title: "A Lovely Night", artist: "Kazukii", genre: "Lofi", spotifySearch: "a lovely night kazukii" },
      { title: "Lacrimosa", artist: "Wolfgang Amadeus Mozart", genre: "Classical", spotifySearch: "lacrimosa mozart" },
      { title: "Metamorphosis", artist: "INTERWORLD", genre: "Phonk", spotifySearch: "metamorphosis interworld" },
      { title: "After Dark", artist: "Mr.Kitty", genre: "Darkwave", spotifySearch: "after dark mr kitty" }
    ];
  }

  /**
   * Get trending TikTok/Instagram sounds
   */
  getTrendingSocialMediaSounds(): MusicRecommendation[] {
    return [
      { title: "Original Sound", artist: "Various Creators", genre: "Trending", spotifySearch: "trending tiktok songs" },
      { title: "Sped Up Versions", artist: "Various Artists", genre: "Sped Up", spotifySearch: "sped up songs" },
      { title: "Slowed + Reverb", artist: "Various Artists", genre: "Slowed", spotifySearch: "slowed reverb songs" },
      { title: "Viral Dance Music", artist: "Various Artists", genre: "Dance", spotifySearch: "viral dance songs 2024" },
      { title: "Anime OST", artist: "Various Composers", genre: "Anime", spotifySearch: "popular anime openings" }
    ];
  }

  /**
   * Format recommendations as suggestion strings
   */
  formatRecommendationsAsSuggestions(includeAmbient: boolean = true): string[] {
    const suggestions: string[] = [];

    if (includeAmbient) {
      suggestions.push('🎵 This might be one of these popular tracks:');
      const ambient = this.getPopularAmbientMusic().slice(0, 8);
      ambient.forEach(track => {
        suggestions.push(`   • "${track.title}" by ${track.artist}`);
      });
    }

    return suggestions;
  }
}

export const musicRecommendations = new MusicRecommendationService();

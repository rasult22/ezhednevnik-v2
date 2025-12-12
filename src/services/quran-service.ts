import type { QuranChapter, QuranChapterInfo, QuranVerse } from '@/types';

/**
 * Quran Service - Handles fetching and caching Quran data from quran-json CDN
 */
class QuranService {
  private readonly QURAN_JSON_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist';

  private arabicData: QuranChapter[] | null = null;
  private russianData: QuranChapter[] | null = null;
  private chaptersInfo: QuranChapterInfo[] | null = null;

  private loadingPromises: {
    arabic?: Promise<QuranChapter[]>;
    russian?: Promise<QuranChapter[]>;
    chapters?: Promise<QuranChapterInfo[]>;
  } = {};

  /**
   * Fetch Arabic text from quran-json
   */
  private async fetchArabicText(): Promise<QuranChapter[]> {
    if (this.arabicData) {
      return this.arabicData;
    }

    if (this.loadingPromises.arabic) {
      return this.loadingPromises.arabic;
    }

    this.loadingPromises.arabic = fetch(`${this.QURAN_JSON_URL}/quran.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch Arabic Quran text');
        }
        return response.json() as Promise<QuranChapter[]>;
      })
      .then((data) => {
        this.arabicData = data;
        delete this.loadingPromises.arabic;
        return data;
      });

    return this.loadingPromises.arabic;
  }

  /**
   * Fetch Russian translation from quran_ru.json
   */
  private async fetchRussianTranslation(): Promise<QuranChapter[]> {
    if (this.russianData) {
      return this.russianData;
    }

    if (this.loadingPromises.russian) {
      return this.loadingPromises.russian;
    }

    this.loadingPromises.russian = fetch(`${this.QURAN_JSON_URL}/quran_ru.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch Russian Quran translation');
        }
        return response.json() as Promise<QuranChapter[]>;
      })
      .then((data) => {
        this.russianData = data;
        console.log('✅ Loaded Russian translation, sample:', data[0]?.verses[0]);
        delete this.loadingPromises.russian;
        return data;
      });

    return this.loadingPromises.russian;
  }

  /**
   * Fetch chapters metadata
   */
  private async fetchChaptersInfo(): Promise<QuranChapterInfo[]> {
    if (this.chaptersInfo) {
      return this.chaptersInfo;
    }

    if (this.loadingPromises.chapters) {
      return this.loadingPromises.chapters;
    }

    this.loadingPromises.chapters = fetch(`${this.QURAN_JSON_URL}/chapters/ru/index.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch Quran chapters info');
        }
        return response.json() as Promise<QuranChapterInfo[]>;
      })
      .then((data) => {
        this.chaptersInfo = data;
        delete this.loadingPromises.chapters;
        return data;
      });

    return this.loadingPromises.chapters;
  }

  /**
   * Get all chapters info
   */
  async getChaptersInfo(): Promise<QuranChapterInfo[]> {
    return this.fetchChaptersInfo();
  }

  /**
   * Get a specific chapter with both Arabic and Russian
   */
  async getChapter(chapterId: number): Promise<{
    info: QuranChapterInfo;
    arabic: QuranChapter;
    russian: QuranChapter;
  }> {
    const [arabic, russian, chaptersInfo] = await Promise.all([
      this.fetchArabicText(),
      this.fetchRussianTranslation(),
      this.fetchChaptersInfo(),
    ]);

    const arabicChapter = arabic.find((ch) => ch.id === chapterId);
    const russianChapter = russian.find((ch) => ch.id === chapterId);
    const info = chaptersInfo.find((ch) => ch.id === chapterId);

    if (!arabicChapter || !russianChapter || !info) {
      throw new Error(`Chapter ${chapterId} not found`);
    }

    return {
      info,
      arabic: arabicChapter,
      russian: russianChapter,
    };
  }

  /**
   * Get a random verse with translation
   */
  async getRandomVerse(): Promise<{
    chapterInfo: QuranChapterInfo;
    arabic: QuranVerse;
    russian: QuranVerse;
  }> {
    const [arabic, russian, chaptersInfo] = await Promise.all([
      this.fetchArabicText(),
      this.fetchRussianTranslation(),
      this.fetchChaptersInfo(),
    ]);

    // Pick random chapter
    const randomChapterIndex = Math.floor(Math.random() * arabic.length);
    const arabicChapter = arabic[randomChapterIndex];
    const russianChapter = russian[randomChapterIndex];

    if (!arabicChapter || !russianChapter) {
      throw new Error('Failed to get random chapter');
    }

    // Pick random verse from that chapter
    const randomVerseIndex = Math.floor(Math.random() * arabicChapter.verses.length);
    const arabicVerse = arabicChapter.verses[randomVerseIndex];
    const russianVerse = russianChapter.verses[randomVerseIndex];

    const chapterInfo = chaptersInfo.find((ch) => ch.id === arabicChapter.id);

    if (!arabicVerse || !russianVerse || !chapterInfo) {
      throw new Error('Failed to get random verse');
    }

    return {
      chapterInfo,
      arabic: arabicVerse,
      russian: russianVerse,
    };
  }

  /**
   * Get verses by page number (each page contains multiple verses)
   */
  async getVersesByPage(pageNumber: number): Promise<{
    verses: Array<{
      chapterInfo: QuranChapterInfo;
      arabic: QuranVerse;
      russian: QuranVerse;
    }>;
  }> {
    const [arabic, russian, chaptersInfo] = await Promise.all([
      this.fetchArabicText(),
      this.fetchRussianTranslation(),
      this.fetchChaptersInfo(),
    ]);

    const verses: Array<{
      chapterInfo: QuranChapterInfo;
      arabic: QuranVerse;
      russian: QuranVerse;
    }> = [];

    // Find chapters that include this page
    for (const chapterInfo of chaptersInfo) {
      if (!chapterInfo.pages) continue;

      const [startPage, endPage] = chapterInfo.pages;
      if (pageNumber >= startPage && pageNumber <= endPage) {
        const arabicChapter = arabic.find((ch) => ch.id === chapterInfo.id);
        const russianChapter = russian.find((ch) => ch.id === chapterInfo.id);

        if (arabicChapter && russianChapter) {
          // For simplicity, return all verses from chapters on this page
          // In a real implementation, you'd need verse-to-page mapping
          for (let i = 0; i < arabicChapter.verses.length; i++) {
            const arabicVerse = arabicChapter.verses[i];
            const russianVerse = russianChapter.verses[i];

            if (arabicVerse && russianVerse) {
              verses.push({
                chapterInfo,
                arabic: arabicVerse,
                russian: russianVerse,
              });
            }
          }
        }
      }
    }

    return { verses };
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.arabicData = null;
    this.russianData = null;
    this.chaptersInfo = null;
    this.loadingPromises = {};
  }
}

export const quranService = new QuranService();

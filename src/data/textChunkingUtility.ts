/**
 * Context-Aware Text Chunking Utility for 1st Baccalaureate Literary Translation
 * 
 * Splits long French text excerpts (full pages, multi-paragraph scenes, dialogues)
 * into smaller, semantically coherent, context-aware blocks before submitting them
 * to translation APIs or processing pipelines.
 */

export interface TextChunk {
  chunkIndex: number;
  totalChunks: number;
  text: string;
  precedingContext?: string;
  followingContext?: string;
  wordCount: number;
  charCount: number;
  isFirstChunk: boolean;
  isLastChunk: boolean;
  paragraphIndex?: number;
}

export interface ChunkingOptions {
  maxWordsPerChunk?: number; // default: 85 words
  maxCharsPerChunk?: number; // default: 500 characters
  preserveParagraphs?: boolean; // default: true
}

/**
 * Splits text into individual sentences while respecting quotes, abbreviations, and dialogue dashes.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text || !text.trim()) return [];

  // Match sentences ending in punctuation (. ! ?) followed by whitespace or quote
  const rawSentences = text.split(/(?<=[.!?…»])\s+(?=[A-ZÀ-Ÿa-z0-9«"–—-])/g);
  
  const cleanSentences: string[] = [];
  for (const s of rawSentences) {
    const trimmed = s.trim();
    if (trimmed.length > 0) {
      cleanSentences.push(trimmed);
    }
  }

  return cleanSentences.length > 0 ? cleanSentences : [text.trim()];
}

/**
 * Splits a text into semantically cohesive, context-aware chunks.
 * Ensures natural paragraph and sentence boundaries are never broken abruptly.
 */
export function splitTextIntoContextAwareChunks(
  text: string,
  options: ChunkingOptions = {}
): TextChunk[] {
  const {
    maxWordsPerChunk = 85,
    maxCharsPerChunk = 520,
    preserveParagraphs = true,
  } = options;

  const trimmed = text.trim();
  if (!trimmed) return [];

  // If text is short, return single chunk
  const totalWords = trimmed.split(/\s+/).filter(Boolean).length;
  if (totalWords <= maxWordsPerChunk && trimmed.length <= maxCharsPerChunk && !trimmed.includes('\n\n')) {
    return [
      {
        chunkIndex: 0,
        totalChunks: 1,
        text: trimmed,
        wordCount: totalWords,
        charCount: trimmed.length,
        isFirstChunk: true,
        isLastChunk: true,
        paragraphIndex: 0,
      },
    ];
  }

  // 1. Group by Paragraphs
  const rawParagraphs = preserveParagraphs
    ? trimmed.split(/\r?\n+/).map((p) => p.trim()).filter((p) => p.length > 0)
    : [trimmed];

  const intermediateBlocks: { text: string; paragraphIndex: number }[] = [];

  rawParagraphs.forEach((para, pIdx) => {
    const paraWords = para.split(/\s+/).filter(Boolean).length;

    if (paraWords <= maxWordsPerChunk && para.length <= maxCharsPerChunk) {
      // Paragraph fits inside single chunk
      intermediateBlocks.push({ text: para, paragraphIndex: pIdx });
    } else {
      // Paragraph is long; split by sentence boundaries while keeping sentences whole
      const sentences = splitIntoSentences(para);
      let currentChunkSentences: string[] = [];
      let currentWords = 0;
      let currentChars = 0;

      sentences.forEach((sent) => {
        const sentWords = sent.split(/\s+/).filter(Boolean).length;
        const sentChars = sent.length;

        if (
          currentChunkSentences.length > 0 &&
          (currentWords + sentWords > maxWordsPerChunk || currentChars + sentChars > maxCharsPerChunk)
        ) {
          // Flush current chunk
          intermediateBlocks.push({
            text: currentChunkSentences.join(' '),
            paragraphIndex: pIdx,
          });
          currentChunkSentences = [sent];
          currentWords = sentWords;
          currentChars = sentChars;
        } else {
          currentChunkSentences.push(sent);
          currentWords += sentWords;
          currentChars += sentChars + 1;
        }
      });

      if (currentChunkSentences.length > 0) {
        intermediateBlocks.push({
          text: currentChunkSentences.join(' '),
          paragraphIndex: pIdx,
        });
      }
    }
  });

  const totalChunks = intermediateBlocks.length;

  // 2. Decorate chunks with preceding & following context snippets
  return intermediateBlocks.map((block, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === totalChunks - 1;

    // Extract last sentence of previous block as preceding context
    let precedingContext: string | undefined;
    if (!isFirst) {
      const prevSentences = splitIntoSentences(intermediateBlocks[idx - 1].text);
      precedingContext = prevSentences[prevSentences.length - 1];
    }

    // Extract first sentence of next block as following context
    let followingContext: string | undefined;
    if (!isLast) {
      const nextSentences = splitIntoSentences(intermediateBlocks[idx + 1].text);
      followingContext = nextSentences[0];
    }

    const words = block.text.split(/\s+/).filter(Boolean).length;

    return {
      chunkIndex: idx,
      totalChunks,
      text: block.text,
      precedingContext,
      followingContext,
      wordCount: words,
      charCount: block.text.length,
      isFirstChunk: isFirst,
      isLastChunk: isLast,
      paragraphIndex: block.paragraphIndex,
    };
  });
}

/**
 * Reassembles translated chunk results into a cohesive, structured text with paragraph preservation.
 */
export function reassembleTranslatedChunks(
  translatedChunks: {
    chunkIndex: number;
    originalText: string;
    arabicTranslation: string;
    paragraphIndex?: number;
  }[]
): {
  fullArabicText: string;
  chunkPairs: { index: number; french: string; arabic: string }[];
} {
  if (!translatedChunks || translatedChunks.length === 0) {
    return { fullArabicText: '', chunkPairs: [] };
  }

  // Sort by chunk index to guarantee sequence integrity
  const sorted = [...translatedChunks].sort((a, b) => a.chunkIndex - b.chunkIndex);

  // Group by paragraph index if provided, otherwise join with spacing
  const paragraphMap = new Map<number, string[]>();

  sorted.forEach((chunk, i) => {
    const pIdx = chunk.paragraphIndex ?? i;
    if (!paragraphMap.has(pIdx)) {
      paragraphMap.set(pIdx, []);
    }
    const cleanAr = chunk.arabicTranslation.trim();
    if (cleanAr) {
      paragraphMap.get(pIdx)!.push(cleanAr);
    }
  });

  const fullArabicParagraphs: string[] = [];
  paragraphMap.forEach((paraChunks) => {
    fullArabicParagraphs.push(paraChunks.join(' '));
  });

  const fullArabicText = fullArabicParagraphs.join('\n\n');

  const chunkPairs = sorted.map((c) => ({
    index: c.chunkIndex,
    french: c.originalText,
    arabic: c.arabicTranslation,
  }));

  return {
    fullArabicText,
    chunkPairs,
  };
}

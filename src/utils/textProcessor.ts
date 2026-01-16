/**
 * Calculate the Optimal Recognition Point (ORP) index for a word.
 * The ORP is the character position where the eye should focus for fastest recognition.
 * Research suggests this is typically around 1/3 into the word.
 */
export function getORPIndex(word: string): number {
  const len = word.length;

  if (len <= 1) return 0;
  if (len <= 3) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return Math.floor(len / 4);
}

/**
 * Split text into an array of words, preserving punctuation attached to words.
 */
export function splitIntoWords(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
}

/**
 * Split a word into three parts: before ORP, the ORP character, and after ORP.
 */
export function splitWordAtORP(word: string): { before: string; orp: string; after: string } {
  const orpIndex = getORPIndex(word);

  return {
    before: word.slice(0, orpIndex),
    orp: word[orpIndex] || '',
    after: word.slice(orpIndex + 1),
  };
}

/**
 * Calculate the delay in milliseconds for a given WPM (words per minute).
 */
export function wpmToDelay(wpm: number): number {
  return Math.round(60000 / wpm);
}

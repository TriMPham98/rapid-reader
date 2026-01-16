import { useState, useCallback, useRef, useEffect } from 'react';
import { splitIntoWords, wpmToDelay, getPauseMultiplier } from '../utils/textProcessor';

export interface RapidReaderState {
  words: string[];
  currentIndex: number;
  isPlaying: boolean;
  wpm: number;
}

export interface RapidReaderActions {
  setText: (text: string) => void;
  play: () => void;
  pause: () => void;
  restart: () => void;
  setWpm: (wpm: number) => void;
  goToWord: (index: number) => void;
}

export function useRapidReader(initialWpm: number = 300): RapidReaderState & RapidReaderActions {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpmState] = useState(initialWpm);

  const timeoutRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const setText = useCallback((text: string) => {
    clearTimer();
    const newWords = splitIntoWords(text);
    setWords(newWords);
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [clearTimer]);

  const play = useCallback(() => {
    if (words.length === 0) return;

    // If at the end, restart from beginning
    if (currentIndex >= words.length) {
      setCurrentIndex(0);
    }

    setIsPlaying(true);
  }, [words.length, currentIndex]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const restart = useCallback(() => {
    clearTimer();
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [clearTimer]);

  const setWpm = useCallback((newWpm: number) => {
    setWpmState(Math.max(50, Math.min(1000, newWpm)));
  }, []);

  const goToWord = useCallback((index: number) => {
    if (index >= 0 && index < words.length) {
      setCurrentIndex(index);
    }
  }, [words.length]);

  // Effect to handle word advancement with variable delays
  useEffect(() => {
    if (isPlaying && words.length > 0 && currentIndex < words.length) {
      const baseDelay = wpmToDelay(wpm);
      const currentWord = words[currentIndex];
      const pauseMultiplier = getPauseMultiplier(currentWord);
      const delay = Math.round(baseDelay * pauseMultiplier);

      timeoutRef.current = window.setTimeout(() => {
        if (currentIndex >= words.length - 1) {
          setIsPlaying(false);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, delay);

      return () => clearTimer();
    }
  }, [isPlaying, wpm, words, currentIndex, clearTimer]);

  return {
    words,
    currentIndex,
    isPlaying,
    wpm,
    setText,
    play,
    pause,
    restart,
    setWpm,
    goToWord,
  };
}

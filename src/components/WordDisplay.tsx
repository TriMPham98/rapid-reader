import { splitWordAtORP } from '../utils/textProcessor';

interface WordDisplayProps {
  word: string;
}

export function WordDisplay({ word }: WordDisplayProps) {
  if (!word) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-900 rounded-lg">
        <span className="text-gray-500 text-2xl">Load text to begin</span>
      </div>
    );
  }

  const { before, orp, after } = splitWordAtORP(word);

  return (
    <div className="flex items-center justify-center h-40 bg-gray-900 rounded-lg relative">
      {/* Focal point indicator line */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-red-500" />
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-red-500" />

      {/* Word display with ORP highlighting */}
      <div className="font-mono text-5xl tracking-wider">
        <span className="text-white">{before}</span>
        <span className="text-red-500 font-bold">{orp}</span>
        <span className="text-white">{after}</span>
      </div>
    </div>
  );
}

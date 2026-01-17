import { useState } from 'react';
import { useRapidReader } from './hooks/useRapidReader';
import { WordDisplay } from './components/WordDisplay';
import { Controls } from './components/Controls';
import { TextInput } from './components/TextInput';
import { FileUpload } from './components/FileUpload';
import { ProgressBar } from './components/ProgressBar';

function App() {
  const {
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
  } = useRapidReader(300);

  const [focusMode, setFocusMode] = useState(false);

  const currentWord = words[currentIndex] || '';
  const hasText = words.length > 0;

  // Auto-enable focus mode when playing, but allow manual override
  const showInputSection = !focusMode && !isPlaying;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className={`max-w-2xl mx-auto p-6 w-full transition-all duration-300 ${isPlaying || focusMode ? 'flex-1 flex flex-col justify-center' : ''}`}>
        {/* Header - hidden in focus mode */}
        {!focusMode && !isPlaying && (
          <h1 className="text-3xl font-bold text-center mb-8">Rapid Reader</h1>
        )}

        {/* Word Display */}
        <div className="mb-6">
          <WordDisplay word={currentWord} />
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar
            current={currentIndex}
            total={words.length}
            onSeek={goToWord}
          />
        </div>

        {/* Controls */}
        <div className="mb-8">
          <Controls
            isPlaying={isPlaying}
            wpm={wpm}
            onPlay={play}
            onPause={pause}
            onRestart={restart}
            onWpmChange={setWpm}
            disabled={!hasText}
          />
        </div>

        {/* Focus Mode Toggle */}
        {hasText && !isPlaying && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {focusMode ? 'Show text input' : 'Hide text input'}
            </button>
          </div>
        )}

        {/* Text Input Section - hidden when playing or in focus mode */}
        {showInputSection && (
          <>
            <hr className="border-gray-800 mb-8" />
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Load Text</h2>
              <TextInput onTextSubmit={setText} />
              <FileUpload onFileLoad={setText} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

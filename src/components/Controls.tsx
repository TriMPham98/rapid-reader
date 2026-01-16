interface ControlsProps {
  isPlaying: boolean;
  wpm: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onWpmChange: (wpm: number) => void;
  disabled: boolean;
}

export function Controls({
  isPlaying,
  wpm,
  onPlay,
  onPause,
  onRestart,
  onWpmChange,
  disabled,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Playback buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onRestart}
          disabled={disabled}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors"
        >
          Restart
        </button>

        {isPlaying ? (
          <button
            onClick={onPause}
            disabled={disabled}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors font-semibold"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={disabled}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors font-semibold"
          >
            Play
          </button>
        )}
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-4">
        <label className="text-gray-400 min-w-20">Speed:</label>
        <input
          type="range"
          min="50"
          max="1000"
          step="25"
          value={wpm}
          onChange={e => onWpmChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-white min-w-24 text-right">{wpm} WPM</span>
      </div>
    </div>
  );
}

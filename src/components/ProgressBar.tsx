interface ProgressBarProps {
  current: number;
  total: number;
  onSeek: (index: number) => void;
}

export function ProgressBar({ current, total, onSeek }: ProgressBarProps) {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (total === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newIndex = Math.floor(percentage * total);
    onSeek(Math.max(0, Math.min(total - 1, newIndex)));
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-2 bg-gray-700 rounded-full cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        <div
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Word {total > 0 ? current + 1 : 0} of {total}</span>
        <span>{total > 0 ? Math.round(progress) : 0}%</span>
      </div>
    </div>
  );
}

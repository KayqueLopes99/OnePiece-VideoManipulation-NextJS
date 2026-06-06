import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaBackward, FaForward } from "react-icons/fa";
import { FilterType } from "./video-types";

interface VideoControlsProps {
  isPlaying: boolean;
  onPrevious: () => void;
  onRewind: () => void;
  onTogglePlay: () => void;
  onForward: () => void;
  onNext: () => void;
  onFilterChange: (filter: FilterType) => void;
}

export function VideoControls({ isPlaying, onPrevious, onRewind, onTogglePlay, onForward, onNext, onFilterChange }: VideoControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <button onClick={onPrevious} className="text-zinc-500 hover:text-white"><FaStepBackward size={18} /></button>
        <button onClick={onRewind} className="text-zinc-500 hover:text-amber-400"><FaBackward size={16} /></button>
        
        <button onClick={onTogglePlay} className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
        </button>

        <button onClick={onForward} className="text-zinc-500 hover:text-amber-400"><FaForward size={16} /></button>
        <button onClick={onNext} className="text-zinc-500 hover:text-white"><FaStepForward size={18} /></button>
      </div>

      <div className="flex gap-2">
        {(['none', 'grayscale', 'red', 'green', 'blue'] as FilterType[]).map((f) => (
          <button key={f} onClick={() => onFilterChange(f)} className="px-3 py-1 bg-zinc-800 text-white rounded text-[10px] uppercase font-bold hover:bg-zinc-700">
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
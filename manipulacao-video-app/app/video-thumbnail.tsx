import { VideoData } from "./video-types";

interface VideoThumbnailProps {
  video: VideoData;
  isSelected: boolean;
  onSelect: (video: VideoData) => void;
}

export function VideoThumbnail({ video, isSelected, onSelect }: VideoThumbnailProps) {
  return (
    <button
      onClick={() => onSelect(video)}
      className={`flex w-full items-center justify-center rounded-xl border p-4 transition-all duration-300 ${
        isSelected 
          ? "border-red-600 bg-zinc-800 shadow-[0_0_15px_rgba(220,38,38,0.3)]" 
          : "border-white/5 bg-zinc-900/50 hover:border-white/20 hover:bg-zinc-800"
      }`}
    >
      <span className="text-xs font-bold text-white uppercase tracking-wider text-center">
        {video.name}
      </span>
    </button>
  );
}
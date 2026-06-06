"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FaVolumeUp } from "react-icons/fa";
import { VIDEO_PLAYLIST } from "./video-data";
import { VideoData, FilterType } from "./video-types";
import { VideoControls } from "./video-controls";
import { VideoThumbnail } from "./video-thumbnail";

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [selectedVideo, setSelectedVideo] = useState<VideoData>(VIDEO_PLAYLIST[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [filter, setFilter] = useState<FilterType>('none');
  const [isScrubbing, setIsScrubbing] = useState(false); 

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Função: Capturar frame do vídeo, aplicar filtro de cor e desenhar no canvas
  const drawFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (filter !== 'none') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (filter === 'grayscale') {
          const avg = (r + g + b) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        } else if (filter === 'red') { data[i + 1] = 0; data[i + 2] = 0; }
        else if (filter === 'green') { data[i] = 0; data[i + 2] = 0; }
        else if (filter === 'blue') { data[i] = 0; data[i + 1] = 0; }
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }, [filter]);

  // Função: Loop contínuo para atualizar o canvas enquanto o vídeo toca
  useEffect(() => {
    let animationId: number;
    const render = () => {
      drawFrame();
      animationId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationId);
  }, [drawFrame]);

  // Função: Alternar entre Play e Pause
  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // Função: Ajustar o volume do vídeo
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
  };

  // Função: Arrastar a barra de progresso (Seekbar) para mudar o tempo
  const handleTimeSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) videoRef.current.currentTime = val;
  };

  // Função: Atualizar o tempo atual visualmente, pausando a atualização se estiver arrastando a barra
  const handleTimeUpdate = () => {
    if (videoRef.current && !isScrubbing) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Função: Trocar de vídeo na playlist
  const changeVideo = (video: VideoData) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  // Função: Formatar segundos brutos para o formato MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex w-full max-w-[500px] flex-col items-center rounded-[2rem] border border-white/10 bg-zinc-900/90 p-6 shadow-2xl">
      <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">One Piece Project</h2>
      
      <video 
        key={selectedVideo.url}
        ref={videoRef} 
        src={selectedVideo.url} 
        className="hidden" 
        preload="metadata"
        onLoadedMetadata={(e) => setTotalDuration(e.currentTarget.duration)} 
        onTimeUpdate={handleTimeUpdate} 
      />
      
      <canvas ref={canvasRef} width={640} height={360} className="w-full rounded-xl bg-black" />

      <div className="w-full mt-4">
        <input 
          type="range" 
          max={totalDuration} 
          value={currentTime} 
          onChange={handleTimeSeek}
          onMouseDown={() => setIsScrubbing(true)}
          onMouseUp={() => setIsScrubbing(false)}
          onTouchStart={() => setIsScrubbing(true)}
          onTouchEnd={() => setIsScrubbing(false)}
          className="w-full h-1.5 accent-red-600 cursor-pointer" 
        />
        <div className="flex justify-between text-[10px] text-zinc-500 mt-1">{formatTime(currentTime)} / {formatTime(totalDuration)}</div>
      </div>

      <VideoControls 
        isPlaying={isPlaying} 
        onTogglePlay={togglePlay} 
        onRewind={() => videoRef.current && (videoRef.current.currentTime -= 10)}
        onForward={() => videoRef.current && (videoRef.current.currentTime += 10)}
        onNext={() => {
            const idx = VIDEO_PLAYLIST.findIndex(v => v.id === selectedVideo.id);
            changeVideo(VIDEO_PLAYLIST[(idx + 1) % VIDEO_PLAYLIST.length]);
        }}
        onPrevious={() => {
            const idx = VIDEO_PLAYLIST.findIndex(v => v.id === selectedVideo.id);
            changeVideo(VIDEO_PLAYLIST[(idx - 1 + VIDEO_PLAYLIST.length) % VIDEO_PLAYLIST.length]);
        }}
        onFilterChange={setFilter}
      />

      <div className="mt-8 flex w-full flex-col items-center gap-3 border-t border-white/5 pt-6">
        <div className="flex items-center gap-3 text-zinc-500">
          <FaVolumeUp size={14} />
          <span className="text-[10px] font-bold tabular-nums">{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-red-600"
        />
      </div>

      <div className="mt-8 grid w-full grid-cols-2 gap-4 px-2">
        {VIDEO_PLAYLIST.map((video) => (
          <VideoThumbnail
            key={video.id}
            video={video}
            isSelected={selectedVideo.id === video.id}
            onSelect={changeVideo}
          />
        ))}
      </div>
      
    </div>
  );
}
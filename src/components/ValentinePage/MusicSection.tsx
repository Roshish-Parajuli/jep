import { Music, Play, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface MusicSectionProps {
  musicUrl: string | null;
  autoPlay?: boolean;
}

export function MusicSection({ musicUrl, autoPlay }: MusicSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (musicUrl) {
      const audio = new Audio(musicUrl);
      audio.loop = true;
      audioRef.current = audio;

      if (autoPlay) {
        // Many browsers require interaction before autoplay. 
        // We assume interaction happened via the 'Explore' button in the parent.
        const playAudio = async () => {
          try {
            await audio.play();
            setIsPlaying(true);
          } catch (err) {
            console.log("Autoplay was blocked or failed:", err);
          }
        };
        playAudio();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musicUrl, autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!musicUrl) return null;

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <button
        onClick={togglePlay}
        className="group relative bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" fill="currentColor" />
        ) : (
          <Play className="w-6 h-6" fill="currentColor" />
        )}

        <div className="absolute -top-12 right-0 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          {isPlaying ? 'Pause Music' : 'Play Music'}
        </div>

        {isPlaying && (
          <div className="absolute inset-0 rounded-full">
            <Music className="w-4 h-4 text-white absolute -top-2 -right-2 animate-bounce" />
          </div>
        )}
      </button>
    </div>
  );
}

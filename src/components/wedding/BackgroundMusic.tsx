import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BackgroundMusicProps {
  src: string;
  volume?: number;
}

const BackgroundMusic = ({ src, volume = 0.3 }: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume
    audio.volume = volume;

    // Auto-play on mount (with user interaction fallback)
    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        // Auto-play was blocked, wait for user interaction
        console.log("Auto-play blocked, waiting for user interaction");
      }
    };

    // Try to play after a short delay
    const timer = setTimeout(tryPlay, 500);

    // Play on first user interaction if auto-play was blocked
    const handleFirstInteraction = async () => {
      if (!isPlaying && audio.paused) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Failed to play audio:", error);
        }
      }
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    // Handle audio events
    const handleEnded = () => {
      // Loop the music
      audio.currentTime = 0;
      audio.play();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [isPlaying, volume]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch (error) {
        console.error("Failed to play audio:", error);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="flex gap-2">
          <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 bg-card/80 backdrop-blur-sm border-gold/20 hover:bg-card hover:border-gold/40 shadow-lg"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="playing"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"
                />
              ) : (
                <motion.div
                  key="paused"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5 border-l-8 border-t-4 border-b-4 border-transparent border-l-gold ml-1"
                />
              )}
            </AnimatePresence>
          </Button>
          <Button
            onClick={toggleMute}
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 bg-card/80 backdrop-blur-sm border-gold/20 hover:bg-card hover:border-gold/40 shadow-lg"
            aria-label={isMuted ? "Unmute music" : "Mute music"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gold" />
            ) : (
              <Volume2 className="w-5 h-5 text-gold" />
            )}
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default BackgroundMusic;


import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BackgroundMusicProps {
  src: string;
  volume?: number;
  type?: "audio" | "anghami"; // Support for Anghami embed
}

const BackgroundMusic = ({ src, volume = 0.3, type = "audio" }: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (type === "anghami") {
      // For Anghami, we'll use iframe embed
      // Anghami embeds handle their own playback
      setIsPlaying(true);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    // Set volume
    audio.volume = volume;

    // Handle audio load errors
    const handleError = () => {
      setError("Failed to load audio. Please check the URL.");
      console.error("Audio load error:", audio.error);
    };

    audio.addEventListener("error", handleError);

    // Auto-play on mount (with user interaction fallback)
    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setError(null);
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
          setError(null);
        } catch (error) {
          console.error("Failed to play audio:", error);
          setError("Could not play audio. Browser may require user interaction.");
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

    const handlePlay = () => {
      setIsPlaying(true);
      setError(null);
    };
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
      audio.removeEventListener("error", handleError);
    };
  }, [isPlaying, volume, type]);

  const toggleMute = () => {
    if (type === "anghami") {
      // Anghami iframe handles its own volume
      setIsMuted(!isMuted);
      return;
    }

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
    if (type === "anghami") {
      // Anghami iframe handles its own playback
      setIsPlaying(!isPlaying);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
        setError(null);
      } catch (error) {
        console.error("Failed to play audio:", error);
        setError("Could not play audio. Browser may require user interaction.");
      }
    }
  };

  if (type === "anghami") {
    // Extract iframe src from Anghami embed code or convert song URL to embed URL
    let iframeSrc = src;
    
    // If it's an iframe HTML code, extract the src
    if (src.includes("<iframe")) {
      iframeSrc = src.match(/src="([^"]+)"/)?.[1] || src;
    }
    // If it's a song page URL, try to convert it to embed URL format
    else if (src.includes("/song/")) {
      const songId = src.match(/\/song\/(\d+)/)?.[1];
      if (songId) {
        // Try Anghami embed URL format
        iframeSrc = `https://play.anghami.com/embed/song/${songId}`;
      }
    }
    // If it already looks like an embed URL, use it directly
    else if (src.includes("/embed/")) {
      iframeSrc = src;
    }

    return (
      <>
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            height: "80px",
            border: "none",
            borderRadius: "12px",
            opacity: isPlaying ? 1 : 0.5,
            pointerEvents: isPlaying ? "auto" : "none",
            zIndex: 50,
          }}
          allow="autoplay"
          title="Anghami Music Player"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="flex flex-col gap-2 items-end">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/90 text-card px-3 py-2 rounded-lg text-xs flex items-center gap-2 max-w-xs"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}
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
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        crossOrigin="anonymous"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="flex flex-col gap-2 items-end">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/90 text-card px-3 py-2 rounded-lg text-xs flex items-center gap-2 max-w-xs"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}
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
        </div>
      </motion.div>
    </>
  );
};

export default BackgroundMusic;


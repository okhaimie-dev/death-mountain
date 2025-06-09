import { useGameDirector } from '@/contexts/GameDirector';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function VideoPlayer() {
  const { video, setVideo, videoQueue } = useGameDirector();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  useEffect(() => {
    if (video.src && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
      setIsVideoVisible(true);
    }
  }, [video.src]);

  const handleVideoEnd = () => {
    setIsVideoVisible(false);
    setVideo({ ...video, playing: false });
  };

  return (
    <AnimatePresence>
      {video.src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoVisible ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <video
            ref={videoRef}
            muted
            playsInline
            loop={video.src === '/videos/explore.mp4' && videoQueue.length === 0}
            className="videoContainer"
            onEnded={handleVideoEnd}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

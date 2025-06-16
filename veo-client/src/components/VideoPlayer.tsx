import { useGameDirector } from "@/contexts/GameDirector";
import { useGameStore } from "@/stores/gameStore";
import { prefetchStream } from "@/utils/assetLoader";
import { streamIds } from "@/utils/cloudflare";
import { Stream, StreamPlayerApi } from "@cloudflare/stream-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { transitionVideos } from "@/utils/events";
import { useSound } from "@/contexts/Sound";

const CUSTOMER_CODE = import.meta.env.VITE_PUBLIC_CLOUDFLARE_ID;

export default function VideoPlayer() {
  const { videoQueue, setVideoQueue } = useGameDirector();
  const { setShowOverlay } = useGameStore();
  const { hasInteracted } = useSound();

  const playerRef = useRef<StreamPlayerApi | undefined>(undefined);
  const [videoReady, setVideoReady] = useState(false);

  /**  Prefetch the first segment of the *next* video while the current one plays */
  useEffect(() => {
    const nextId = videoQueue[1];
    if (!nextId) return;

    prefetchStream(nextId);
  }, [videoQueue]);


  const handleEnded = () => {
    let overlay = !transitionVideos.includes(videoQueue[0]);

    setVideoReady(false);
    setShowOverlay(overlay);

    setTimeout(() => {
      setVideoQueue(videoQueue.slice(1));
    }, overlay ? 500 : 0);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={videoQueue[0]}
        initial={false}
        animate={{ opacity: videoReady ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Stream
          className="videoContainer"
          src={videoQueue[0]}
          customerCode={CUSTOMER_CODE}
          streamRef={playerRef}
          loop={videoQueue[0] === streamIds.explore && videoQueue.length === 1}
          autoplay
          preload="auto"
          controls={false}
          muted={!hasInteracted}
          onEnded={handleEnded}
          onCanPlayThrough={() => setVideoReady(true)}
        />
      </motion.div>
    </AnimatePresence>
  );
}

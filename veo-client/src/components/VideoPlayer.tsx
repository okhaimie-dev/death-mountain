import { useGameDirector } from "@/contexts/GameDirector";
import { useSound } from "@/contexts/Sound";
import { useGameStore } from "@/stores/gameStore";
import { streamIds } from "@/utils/cloudflare";
import { transitionVideos } from "@/utils/events";
import { Stream, StreamPlayerApi } from "@cloudflare/stream-react";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CUSTOMER_CODE = import.meta.env.VITE_PUBLIC_CLOUDFLARE_ID;

export default function VideoPlayer() {
  const { videoQueue, setVideoQueue } = useGameDirector();
  const { setShowOverlay } = useGameStore();
  const { hasInteracted } = useSound();

  const playerRef = useRef<StreamPlayerApi | undefined>(undefined);
  const [videoReady, setVideoReady] = useState(false);
  const [nextVideoReady, setNextVideoReady] = useState(false);

  const handleEnded = () => {
    if (videoQueue[0] === streamIds.explore && !nextVideoReady) {
      return;
    }

    let isLastVideo = !transitionVideos.includes(videoQueue[0]) && videoQueue.length === 1;
    setShowOverlay(isLastVideo);
    setVideoReady(false);

    setTimeout(() => {
      setVideoQueue(videoQueue.slice(1));
      setNextVideoReady(false);
    }, !isLastVideo ? 0 : 500);
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={videoQueue[0]}
          initial={false}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: videoQueue[0] ? 1000 : 0 }}
        >
          {videoQueue[0] && (
            <Stream
              className="videoContainer"
              src={videoQueue[0]}
              customerCode={CUSTOMER_CODE}
              streamRef={playerRef}
              loop={videoQueue[0] === streamIds.explore && !nextVideoReady}
              autoplay
              preload="auto"
              controls={false}
              muted={!hasInteracted}
              onEnded={handleEnded}
              onCanPlayThrough={() => setVideoReady(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {videoQueue[1] && (
        <Stream
          key={videoQueue[1]}
          className="videoContainer-hidden"
          src={videoQueue[1]}
          customerCode={CUSTOMER_CODE}
          preload="auto"
          autoplay
          controls={false}
          muted={true}
          onCanPlayThrough={() => setNextVideoReady(true)}
        />
      )}
    </>
  );
}

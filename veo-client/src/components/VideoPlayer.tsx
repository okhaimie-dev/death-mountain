import { useGameDirector } from "@/contexts/GameDirector";
import { prefetchStream } from "@/utils/assetLoader";
import { Stream, StreamPlayerApi } from "@cloudflare/stream-react";
import { useEffect, useRef } from "react";

const CUSTOMER_CODE = import.meta.env.VITE_PUBLIC_CLOUDFLARE_ID;

export default function VideoPlayer() {
  const { videoQueue, setVideoQueue } = useGameDirector();
  const playerRef = useRef<StreamPlayerApi | undefined>(undefined);

  /**  Prefetch the first segment of the *next* video while the current one plays */
  useEffect(() => {
    const nextId = videoQueue[1];
    if (!nextId) return;

    prefetchStream(nextId);
  }, [videoQueue]);

  return (
    <Stream
      className="videoContainer"
      src={videoQueue[0]}
      customerCode={CUSTOMER_CODE}
      streamRef={playerRef}
      autoplay
      preload="auto"
      controls={false}
      muted={false}
      onEnded={() => setVideoQueue(videoQueue.slice(1))}
    />
  );
}

import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';

const tracks: Record<string, string> = {
  Background: "/audio/background.mp3",
};

interface SoundContextType {
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  hasInteracted: boolean;
}

const SoundContext = createContext<SoundContextType>({
  playing: true,
  setPlaying: () => { },
  volume: 1,
  setVolume: () => { },
  hasInteracted: false,
});

export const SoundProvider = ({ children }: PropsWithChildren) => {
  const audioRef = useRef(new Audio(tracks.Background));
  audioRef.current.loop = true;

  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  return (
    <SoundContext.Provider value={{
      playing,
      setPlaying,
      volume,
      setVolume,
      hasInteracted,
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  return useContext(SoundContext);
}; 
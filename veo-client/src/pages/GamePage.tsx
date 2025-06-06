import { useController } from '@/contexts/controller';
import { useGameDirector } from '@/contexts/GameDirector';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Box, Typography } from '@mui/material';
import { useEffect, useReducer, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ExploreOverlay from '@/overlays/Explore';
import CombatOverlay from '@/overlays/Combat';
import startImg from '@/assets/images/start.png';
import gameImg from '@/assets/images/game.png';

export default function GamePage() {
  const navigate = useNavigate();
  const { sdk } = useDojoSDK();
  const { mintGame } = useSystemCalls();
  const { account, address, playerName, login, isPending } = useController();
  const { gameId, adventurer, exitGame, setGameId, beast } = useGameStore();
  const { subscription, video, setVideo, videoQueue } = useGameDirector();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [update, forceUpdate] = useReducer(x => x + 1, 0);

  const [searchParams] = useSearchParams();
  const game_id = Number(searchParams.get('id'));
  const settings_id = Number(searchParams.get('settingsId'));

  const [isVideoVisible, setIsVideoVisible] = useState(false);

  async function mint() {
    setLoadingProgress(45)
    let tokenId = await mintGame(account, playerName, settings_id);
    navigate(`/play?id=${tokenId}`, { replace: true });
  }

  useEffect(() => {
    if (!account && gameId && adventurer) {
      navigate('/');
    }
  }, [account]);

  useEffect(() => {
    if (!sdk || isPending) return;

    if (!address) return login();

    if (!account) {
      forceUpdate()
      return
    }

    if (game_id) {
      setLoadingProgress(99);
      setGameId(game_id);
    } else if (game_id === 0) {
      mint();
    }
  }, [game_id, address, isPending, sdk, update]);

  useEffect(() => {
    return () => {
      if (subscription) {
        try {
          subscription.cancel();
        } catch (error) { }
      }

      exitGame();
    };
  }, []);

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

  const isLoading = !gameId || !adventurer;

  return (
    <Box sx={styles.container}>
      {!gameId && <Box className="imageContainer" style={{ backgroundImage: `url(${startImg})` }} />}
      {gameId && <Box className="imageContainer" style={{ backgroundImage: `url(${gameImg})` }} />}

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

      {!video.playing && (
        <Box sx={styles.overlay}>
          {isLoading ? <Typography sx={styles.loadingText}>Loading</Typography> : (
            <>
              {adventurer && adventurer.beast_health > 0 && beast && <CombatOverlay />}
              {adventurer && adventurer.beast_health === 0 && adventurer.stat_upgrades_available === 0 && <ExploreOverlay />}
            </>
          )}
        </Box>
      )}
    </Box>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100dvw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    margin: 0,
    gap: 2,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100dvw',
    height: '100dvh',
    zIndex: 99,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: '48px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '40px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    animation: 'blink 1.5s infinite',
    '@keyframes blink': {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.3 },
      '100%': { opacity: 1 }
    }
  }
};
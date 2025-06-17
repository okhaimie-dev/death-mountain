import VideoPlayer from '@/components/VideoPlayer';
import { useController } from '@/contexts/controller';
import { useGameDirector } from '@/contexts/GameDirector';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import CombatOverlay from '@/overlays/Combat';
import ExploreOverlay from '@/overlays/Explore';
import DeathOverlay from '@/overlays/Death';
import { useGameStore } from '@/stores/gameStore';
import { streamIds } from '@/utils/cloudflare';
import { getMenuLeftOffset } from '@/utils/utils';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Box, Typography } from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function GamePage() {
  const navigate = useNavigate();
  const { sdk } = useDojoSDK();
  const { mintGame } = useSystemCalls();
  const { account, address, playerName, login, isPending } = useController();
  const { gameId, adventurer, exitGame, setGameId, beast, metadata, showOverlay, setShowOverlay } = useGameStore();
  const { subscription, videoQueue, setVideoQueue } = useGameDirector();

  const [padding, setPadding] = useState(getMenuLeftOffset());
  const [update, forceUpdate] = useReducer(x => x + 1, 0);

  const [searchParams] = useSearchParams();
  const game_id = Number(searchParams.get('id'));
  const settings_id = Number(searchParams.get('settingsId'));

  useEffect(() => {
    function handleResize() {
      setPadding(getMenuLeftOffset());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    if (videoQueue.length === 0 && game_id === 0) {
      setVideoQueue([streamIds.start]);
    } else {
      setShowOverlay(true);
    }

    if (game_id) {
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

  async function mint() {
    let tokenId = await mintGame(account, playerName, settings_id);
    navigate(`/play?id=${tokenId}`, { replace: true });
  }

  const isLoading = !gameId || !adventurer;

  return (
    <Box sx={styles.container}>
      <Box className="imageContainer" sx={{ backgroundImage: `url('/images/${metadata ? 'game' : 'start'}.png')`, zIndex: 0 }} />

      <VideoPlayer />

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          >
            <Box sx={{ ...styles.overlay, px: `${padding}px` }}>
              {isLoading ? <Typography sx={styles.loadingText}>Loading</Typography> : (
                <>
                  {adventurer && adventurer.health === 0 && <DeathOverlay />}
                  {adventurer && adventurer.health > 0 && adventurer.beast_health > 0 && beast && <CombatOverlay />}
                  {adventurer && adventurer.health > 0 && adventurer.beast_health === 0 && <ExploreOverlay />}
                </>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
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
    boxSizing: 'border-box',
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
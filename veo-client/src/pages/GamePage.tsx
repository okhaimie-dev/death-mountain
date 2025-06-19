import VideoPlayer from '@/components/VideoPlayer';
import { useController } from '@/contexts/controller';
import { useGameDirector } from '@/contexts/GameDirector';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import CombatOverlay from '@/overlays/Combat';
import DeathOverlay from '@/overlays/Death';
import ExploreOverlay from '@/overlays/Explore';
import LoadingOverlay from '@/overlays/Loading';
import { useGameStore } from '@/stores/gameStore';
import { streamIds } from '@/utils/cloudflare';
import { getMenuLeftOffset } from '@/utils/utils';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useReducer, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AnimatedOverlayProps {
  children: React.ReactNode;
  overlayKey: string;
}

const AnimatedOverlay = ({ children, overlayKey }: AnimatedOverlayProps) => (
  <motion.div
    key={overlayKey}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default function GamePage() {
  const navigate = useNavigate();
  const { sdk } = useDojoSDK();
  const { mintGame } = useSystemCalls();
  const { account, address, playerName, login, isPending } = useController();
  const { gameId, adventurer, exitGame, setGameId, beast, showOverlay, setShowOverlay } = useGameStore();
  const { subscription, setVideoQueue, videoQueue } = useGameDirector();

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
    setVideoQueue([streamIds.start]);
    let tokenId = await mintGame(account, playerName, settings_id);
    navigate(`/play?id=${tokenId}`, { replace: true });
    setShowOverlay(false);
  }

  const isLoading = !gameId || !adventurer;
  return (
    <Box sx={styles.container}>
      {!showOverlay && <Box className="imageContainer" sx={{ backgroundImage: `url('/images/game.png')`, zIndex: 0 }} />}

      <VideoPlayer />

      {showOverlay && (
        <Box sx={{ ...styles.overlay, px: `${padding}px` }}>
          {isLoading ? (
            <LoadingOverlay />
          ) : (
            <AnimatePresence mode="wait">
              {adventurer && adventurer.health === 0 && (
                <AnimatedOverlay overlayKey="death">
                  <DeathOverlay />
                </AnimatedOverlay>
              )}
              {adventurer && adventurer.health > 0 && adventurer.beast_health > 0 && beast && (
                <AnimatedOverlay overlayKey="combat">
                  <CombatOverlay />
                </AnimatedOverlay>
              )}
              {adventurer && adventurer.health > 0 && adventurer.beast_health === 0 && (
                <AnimatedOverlay overlayKey="explore">
                  <ExploreOverlay />
                </AnimatedOverlay>
              )}
            </AnimatePresence>
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
    boxSizing: 'border-box',
  },
};
import gameImg from '@/assets/images/game.png';
import startImg from '@/assets/images/start.png';
import VideoPlayer from '@/components/VideoPlayer';
import { useController } from '@/contexts/controller';
import { useGameDirector } from '@/contexts/GameDirector';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import CombatOverlay from '@/overlays/Combat';
import ExploreOverlay from '@/overlays/Explore';
import { useGameStore } from '@/stores/gameStore';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Box, Typography } from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GamePage() {
  const navigate = useNavigate();
  const { sdk } = useDojoSDK();
  const { mintGame } = useSystemCalls();
  const { account, address, playerName, login, isPending } = useController();
  const { gameId, adventurer, exitGame, setGameId, beast } = useGameStore();
  const { subscription, video } = useGameDirector();

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [update, forceUpdate] = useReducer(x => x + 1, 0);

  const [searchParams] = useSearchParams();
  const game_id = Number(searchParams.get('id'));
  const settings_id = Number(searchParams.get('settingsId'));

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

  const isLoading = !gameId || !adventurer;

  return (
    <Box sx={styles.container}>
      {!gameId && <Box className="imageContainer" style={{ backgroundImage: `url(${startImg})` }} />}
      {gameId && <Box className="imageContainer" style={{ backgroundImage: `url(${gameImg})` }} />}

      <VideoPlayer />

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
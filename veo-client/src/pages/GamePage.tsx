import { useController } from '@/contexts/controller';
import { useGameDirector } from '@/contexts/GameDirector';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Box } from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import startImg from '@/assets/images/start.png';

export default function GamePage() {
  const navigate = useNavigate();
  const { sdk } = useDojoSDK();
  const { mintGame } = useSystemCalls();
  const { account, address, playerName, login, isPending } = useController();
  const { gameId, adventurer, exitGame, setGameId, beast, showBeastRewards, quest } = useGameStore();
  const { subscription } = useGameDirector();

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

    // if (game_id) {
    //   setLoadingProgress(99);
    //   setGameId(game_id);
    // } else if (game_id === 0) {
    //   mint();
    // }
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
  const isDead = adventurer && adventurer.health === 0;
  const isBeastDefeated = showBeastRewards && adventurer?.beast_health === 0;
  const isQuestCompleted = quest && adventurer && adventurer.xp >= quest.targetScore;

  return (
    <Box sx={styles.container}>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="imageContainer"
        style={{ backgroundImage: `url(${startImg})` }}
      />
      <video
        autoPlay
        muted
        playsInline
        className="videoContainer"
      >
        <source src="/videos/start_game.mp4" type="video/mp4" />
      </video>
    </Box>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
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
};
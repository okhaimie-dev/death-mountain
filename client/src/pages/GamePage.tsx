import BeastScreen from '@/containers/BeastScreen';
import ExploreScreen from '@/containers/ExploreScreen';
import LevelUpScreen from '@/containers/LevelUpScreen';
import LoadingContainer from '@/containers/LoadingScreen';
import { useController } from '@/contexts/controller';
import { setupGameSubscription } from '@/dojo/useGameEntities';
import { setupGameEventsSubscription } from '@/dojo/useGameEvents';
import { fetchMetadata } from '@/dojo/useGameTokens';
import { useGameStore } from '@/stores/gameStore';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function GamePage() {
  const { sdk } = useDojoSDK();
  const { account } = useController();
  const { adventurer, exitGame, setGameId, marketSeed, beastSeed } = useGameStore();

  const [searchParams] = useSearchParams();
  const game_id = Number(searchParams.get('id'));

  useEffect(() => {
    if (game_id) {
      setGameId(game_id);
      setupGameSubscription(sdk, game_id);
      setupGameEventsSubscription(sdk, game_id);
      fetchMetadata(sdk, game_id);
    }
  }, [game_id, sdk]);

  useEffect(() => {
    if (!account) {
      exitGame()
    }
  }, [account]);

  let loadingScreen = !game_id || !adventurer;
  let beastScreen = adventurer && adventurer.beast_health > 0 && beastSeed;
  let levelUpScreen = adventurer && adventurer.stat_upgrades_available > 0 && marketSeed;
  let exploreScreen = adventurer && !beastScreen && !levelUpScreen;

  return (
    <Box sx={styles.container}>
      {loadingScreen && <LoadingContainer />}

      {beastScreen && <BeastScreen />}

      {levelUpScreen && <LevelUpScreen />}

      {exploreScreen && <ExploreScreen />}
    </Box>
  );
}

const styles = {
  container: {
    width: '100%',
    height: 'calc(100vh - 50px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    padding: '16px',
    margin: '0 auto',
    gap: 2
  },
};
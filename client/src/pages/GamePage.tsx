import BottomNav from '@/components/BottomNav';
import BeastScreen from '@/containers/BeastScreen';
import CharacterScreen from '@/containers/CharacterScreen';
import ExploreScreen from '@/containers/ExploreScreen';
import MarketScreen from '@/containers/MarketScreen';
import StatSelectionScreen from '@/containers/StatSelectionScreen';
import LoadingContainer from '@/containers/LoadingScreen';
import { useController } from '@/contexts/controller';
import { setupGameSubscription } from '@/dojo/useGameEntities';
import { setupGameEventsSubscription } from '@/dojo/useGameEvents';
import { fetchMetadata } from '@/dojo/useGameTokens';
import { useGameStore } from '@/stores/gameStore';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function GamePage() {
  const { sdk } = useDojoSDK();
  const { account } = useController();
  const { gameId, adventurer, exitGame, setGameId, marketSeed, beastSeed, keepScreen, setKeepScreen } = useGameStore();
  const [screen, setScreen] = useState('loading');
  const [activeNavItem, setActiveNavItem] = useState<'GAME' | 'CHARACTER' | 'MARKET'>('GAME');

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
    if (!account && gameId) {
      exitGame()
    }
  }, [account]);

  useEffect(() => {
    if (!keepScreen) {
      if (!gameId || !adventurer) {
        setScreen('loading');
      } else if (adventurer && adventurer.beast_health > 0 && beastSeed) {
        // setKeepScreen(true);
        setScreen('beast');
      } else if (adventurer && adventurer.stat_upgrades_available > 0) {
        setScreen('statSelection');
      } else {
        setScreen('explore');
      }
    }
  }, [keepScreen, gameId, adventurer, beastSeed, marketSeed]);

  return (
    <Box className="container" sx={styles.container}>
      {screen === 'loading' && <LoadingContainer />}

      {screen === 'beast' && <BeastScreen />}

      {screen === 'statSelection' && <StatSelectionScreen />}

      {screen === 'explore' && <ExploreScreen />}

      {activeNavItem === 'CHARACTER' && <CharacterScreen />}

      {activeNavItem === 'MARKET' && <MarketScreen />}

      {screen !== 'loading' && (
        <BottomNav
          activeNavItem={activeNavItem}
          setActiveNavItem={setActiveNavItem}
          currentScreen={screen}
        />
      )}
    </Box>
  );
}

const styles = {
  container: {
    width: '450px',
    maxWidth: '100vw',
    height: 'calc(100vh - 50px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    margin: '0 auto',
    gap: 2,
    position: 'relative'
  },
};
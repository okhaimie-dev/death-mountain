import BottomNav from '@/components/BottomNav';
import BeastScreen from '@/containers/BeastScreen';
import CharacterScreen from '@/containers/CharacterScreen';
import ExploreScreen from '@/containers/ExploreScreen';
import LoadingContainer from '@/containers/LoadingScreen';
import MarketScreen from '@/containers/MarketScreen';
import StatSelectionScreen from '@/containers/StatSelectionScreen';
import { useController } from '@/contexts/Controller';
import { setupGameSubscription } from '@/dojo/useGameEntities';
import { setupGameEventsSubscription } from '@/dojo/useGameEvents';
import { fetchMetadata } from '@/dojo/useGameTokens';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GamePage() {
  const navigate = useNavigate();
  const { sdk } = useDojoSDK();
  const { mintGame, startGame } = useSystemCalls();
  const { account, address, playerName, login, isPending } = useController();
  const { gameId, adventurer, exitGame, setGameId, marketSeed, beastSeed, keepScreen, newGame, exploreLog } = useGameStore();

  const [activeNavItem, setActiveNavItem] = useState<'GAME' | 'CHARACTER' | 'MARKET'>('GAME');
  const [screen, setScreen] = useState('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [searchParams] = useSearchParams();
  const game_id = Number(searchParams.get('id'));

  async function mint() {
    setLoadingProgress(45)
    let tokenId = await mintGame(account, playerName);
    navigate(`/play?id=${tokenId}`);
  }

  useEffect(() => {
    if (!account && gameId && adventurer) {
      exitGame()
    }
  }, [account]);

  useEffect(() => {
    if (!sdk || isPending) return;

    if (!address) return login();

    if (game_id) {
      setLoadingProgress(99);
      setGameId(game_id);
      setupGameSubscription(sdk, game_id);
      setupGameEventsSubscription(sdk, game_id);
      fetchMetadata(sdk, game_id);
    } else if (game_id === 0) {
      mint();
    }
  }, [game_id, address, isPending, sdk]);

  useEffect(() => {
    if (gameId && newGame) {
      startGame(gameId);
    }
  }, [gameId, newGame]);

  useEffect(() => {
    if (!keepScreen) {
      if (!gameId || !adventurer) {
        setScreen('loading');
      } else if (adventurer.beast_health > 0) {
        setScreen('beast');
      } else if (adventurer.stat_upgrades_available > 0) {
        setScreen('statSelection');
      } else if (exploreLog.length > 0) {
        setScreen('explore');
      }
    }
  }, [keepScreen, gameId, adventurer, beastSeed, marketSeed, exploreLog]);

  return (
    <Box className="container" sx={styles.container}>
      {screen === 'loading' && <LoadingContainer loadingProgress={loadingProgress} />}

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
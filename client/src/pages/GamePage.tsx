import BottomNav from '@/components/BottomNav';
import BeastScreen from '@/containers/BeastScreen';
import CharacterScreen from '@/containers/CharacterScreen';
import DeathScreen from '@/containers/DeathScreen';
import ExploreScreen from '@/containers/ExploreScreen';
import LoadingContainer from '@/containers/LoadingScreen';
import MarketScreen from '@/containers/MarketScreen';
import StatSelectionScreen from '@/containers/StatSelectionScreen';
import { useController } from '@/contexts/controller';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GamePage() {
  const navigate = useNavigate();
  const { sdk } = useDojoSDK();
  const { mintGame } = useSystemCalls();
  const { account, address, playerName, login, isPending } = useController();
  const { gameId, adventurer, exitGame, setGameId, beast } = useGameStore();

  const [activeNavItem, setActiveNavItem] = useState<'GAME' | 'CHARACTER' | 'MARKET'>('GAME');
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
      navigate('/');
      exitGame()
    }
  }, [account]);

  useEffect(() => {
    if (!sdk || isPending) return;

    if (!address) return login();

    if (game_id) {
      setLoadingProgress(99);
      setGameId(game_id);
    } else if (game_id === 0) {
      mint();
    }
  }, [game_id, address, isPending, sdk]);

  useEffect(() => {
    setActiveNavItem('GAME');
  }, [adventurer?.stat_upgrades_available, adventurer?.beast_health]);

  const isLoading = !gameId || !adventurer;
  const isDead = adventurer && adventurer.health === 0;

  return (
    <Box className="container" sx={styles.container}>
      {isLoading
        ? <LoadingContainer loadingProgress={loadingProgress} />
        : isDead ? <DeathScreen />
          : <>
            {adventurer.beast_health > 0 && beast && <BeastScreen />}
            {adventurer.stat_upgrades_available > 0 && <StatSelectionScreen />}
            {adventurer.beast_health === 0 && adventurer.stat_upgrades_available === 0 && <ExploreScreen />}
          </>
      }

      {activeNavItem === 'CHARACTER' && <CharacterScreen />}
      {activeNavItem === 'MARKET' && <MarketScreen />}

      {!isLoading && (
        <BottomNav
          activeNavItem={activeNavItem}
          setActiveNavItem={setActiveNavItem}
        />
      )}
    </Box>
  );
}

const styles = {
  container: {
    width: '450px',
    maxWidth: '100vw',
    height: 'calc(100dvh - 50px)',
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
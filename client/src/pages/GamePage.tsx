import GameHeader from '@/components/GameHeader';
import { fetchGameState, setupGameSubscription } from '@/dojo/useGameEntities';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useController } from '@/providers/controller';
import { useGameStore } from '@/stores/gameStore';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function GamePage() {
  const { sdk } = useDojoSDK();
  const { gameTokens } = useController();
  const { adventurer, bag, beast, market, gameId, setGameId } = useGameStore();
  const { mintGame, startGame, attack, flee, explore, levelUp } = useSystemCalls();

  const [mintingGame, setMintingGame] = useState<boolean>(false);

  useEffect(() => {
    if (gameId) {
      fetchGameState(sdk, gameId);
      setupGameSubscription(sdk, gameId);
    }
  }, [gameId]);

  useEffect(() => {
    if (mintingGame) {
      console.log('New game Token', gameTokens[gameTokens.length - 1]);
      let gameId = parseInt(gameTokens[gameTokens.length - 1], 16);
      setGameId(gameId!);
      startGame(gameId!, 12);
      setMintingGame(false);
    }
  }, [gameTokens]);

  const handleNewGame = async () => {
    setMintingGame(true);
    await mintGame("Await");
  };

  const handleStartGame = (tokenId: string) => {
    const gameId = parseInt(tokenId, 16);
    setGameId(gameId);
  };

  const handleAttack = () => {
    attack(gameId!, false);
  };

  const handleFlee = () => {
    flee(gameId!, false);
  };

  const handleExplore = () => {
    explore(gameId!, false);
  };

  const handleUpgrade = () => {
    levelUp(gameId!, 1, { vitality: 1, strength: 0, dexterity: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0 }, []);
  };

  return (
    <>
      <GameHeader />

      <Box sx={styles.container}>
        <Box sx={styles.content}>
          <Typography variant="h1" sx={styles.title}>
            Loot Survivor 2
          </Typography>

          <Box sx={styles.buttons}>
            <Button variant="contained" onClick={() => handleNewGame()} sx={styles.button}>
              Start
            </Button>
            <Button variant="contained" onClick={handleAttack} sx={styles.button}>
              Attack
            </Button>
            <Button variant="contained" onClick={handleFlee} sx={styles.button}>
              Flee
            </Button>
            <Button variant="contained" onClick={handleExplore} sx={styles.button}>
              Explore
            </Button>
            <Button variant="contained" onClick={handleUpgrade} sx={styles.button}>
              Level Up
            </Button>
          </Box>

          <Paper sx={styles.tokensSection}>
            <Typography variant="h6" sx={{ marginBottom: '1rem' }}>Your Games</Typography>
            {gameTokens.map((token) => (
              <Box key={token} sx={styles.tokenItem}>
                <Typography>Game ID: {parseInt(token, 16)}</Typography>
                <Button
                  variant="contained"
                  onClick={() => handleStartGame(token)}
                  sx={styles.tokenButton}
                >
                  Start Game
                </Button>
              </Box>
            ))}
          </Paper>

          <Box sx={styles.dataContainer}>
            <Paper sx={styles.dataSection}>
              <Typography variant="h6">Adventurer</Typography>
              <pre>{JSON.stringify(adventurer, null, 2)}</pre>
            </Paper>

            <Paper sx={styles.dataSection}>
              <Typography variant="h6">Bag</Typography>
              <pre>{JSON.stringify(bag, null, 2)}</pre>
            </Paper>

            <Paper sx={styles.dataSection}>
              <Typography variant="h6">Beast</Typography>
              <pre>{JSON.stringify(beast, null, 2)}</pre>
            </Paper>

            <Paper sx={styles.dataSection}>
              <Typography variant="h6">Market</Typography>
              <pre>{JSON.stringify(market, null, 2)}</pre>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    paddingBottom: '2rem',
    backgroundColor: '#202020',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'scroll',
  },
  content: {
    textAlign: 'center',
    color: 'white',
    width: '100%',
    maxWidth: '1400px',
    padding: '2rem',
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    opacity: 0.8,
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  button: {
    minWidth: '120px',
    backgroundColor: 'secondary.main',
    '&:hover': {
      backgroundColor: 'secondary.dark',
    },
  },
  tokensSection: {
    padding: '1rem',
    marginBottom: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  tokenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  tokenButton: {
    backgroundColor: 'secondary.main',
    '&:hover': {
      backgroundColor: 'secondary.dark',
    },
  },
  dataContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  dataSection: {
    textAlign: 'left',
    padding: '1rem',
    maxHeight: '400px',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    '& pre': {
      margin: 0,
      fontSize: '0.8rem',
      color: 'white',
    },
  },
};
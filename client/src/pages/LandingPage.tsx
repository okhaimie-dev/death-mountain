import { useGameStore } from '@/stores/gameStore';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { adventurer, bag, entropy, beast, gameId, setGameId, exitGame } = useGameStore();

  const navigate = useNavigate();

  const handleStartGame = () => {
    setGameId('123');
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.content}>
        <Typography variant="h1" sx={styles.title}>
          Loot Survivor
        </Typography>
        <Typography variant="h4" sx={styles.subtitle}>
          Start your adventure
        </Typography>
        {adventurer ? (
          <Box sx={styles.stats}>
            <Typography variant="h6">
              Health: {adventurer.health}
            </Typography>
            <Typography variant="h6">
              XP: {adventurer.xp}
            </Typography>
            <Typography variant="h6">
              Gold: {adventurer.gold}
            </Typography>
            <Typography variant="h6">
              Level: {adventurer.stats.strength + adventurer.stats.dexterity +
                adventurer.stats.vitality + adventurer.stats.intelligence +
                adventurer.stats.wisdom + adventurer.stats.charisma}
            </Typography>
            {bag && (
              <Typography variant="h6">
                Items in Bag: {bag.items.filter((item: { id: number }) => item.id !== 0).length}
              </Typography>
            )}
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/game')}
              sx={styles.button}
            >
              Continue Game
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={handleStartGame}
            sx={styles.button}
          >
            Start New Game
          </Button>
        )}
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    backgroundColor: 'primary.main',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    textAlign: 'center',
    color: 'white',
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
  button: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    backgroundColor: 'secondary.main',
    '&:hover': {
      backgroundColor: 'secondary.dark',
    },
  },
  loader: {
    color: 'white',
  },
  error: {
    marginBottom: '1rem',
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  }
};
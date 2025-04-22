import { useController } from '@/providers/controller';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { address } = useController();
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/play');
  };

  return (
    <>
      <Box sx={styles.container}>
        <Box sx={styles.content}>
          <Typography variant="h1" sx={styles.title}>
            Loot Survivor
          </Typography>
          <Typography variant="h4" sx={styles.subtitle}>
            Start your adventure
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleStartGame}
            sx={styles.button}
            disabled={!address}
          >
            Start New Game
          </Button>

        </Box>
      </Box>
    </>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    backgroundColor: '#413f38',
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
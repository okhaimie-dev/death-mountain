import { useGameDirector } from '@/contexts/GameDirector';
import { Box, Button, Typography } from '@mui/material';

export default function ExploreOverlay() {
  const { executeGameAction, setVideo } = useGameDirector();

  const handleExplore = async () => {
    setVideo({ src: '/videos/explore.mp4', playing: true });
    executeGameAction({ type: 'explore', untilBeast: false });
  };

  return (
    <Box sx={styles.container}>
      <Button
        variant="contained"
        onClick={handleExplore}
        sx={styles.exploreButton}
      >
        <Typography variant={'h4'} lineHeight={'16px'}>
          EXPLORE
        </Typography>
      </Button>
    </Box>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '30px',
    position: 'relative',
    zIndex: 1,
  },
  exploreButton: {
    width: '200px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    height: '56px',
    background: 'rgba(128, 255, 0, 0.25)',
    color: '#80FF00',
    borderRadius: '8px',
    border: '2px solid rgba(128, 255, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 4px 12px rgba(128, 255, 0, 0.2)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      background: 'rgba(128, 255, 0, 0.35)',
      border: '2px solid rgba(128, 255, 0, 0.6)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(128, 255, 0, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 8px rgba(128, 255, 0, 0.2)',
    },
    '&:disabled': {
      background: 'rgba(128, 255, 0, 0.1)',
      color: 'rgba(128, 255, 0, 0.5)',
      border: '2px solid rgba(128, 255, 0, 0.1)',
      boxShadow: 'none',
    },
  },
};
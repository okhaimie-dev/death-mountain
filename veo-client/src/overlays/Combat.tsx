import { useGameDirector } from '@/contexts/GameDirector';
import { Box, Button, Typography } from '@mui/material';

export default function CombatOverlay() {
  const { executeGameAction, } = useGameDirector();

  const handleAttack = () => {
    executeGameAction({ type: 'attack', untilDeath: false });
  };

  const handleFlee = () => {
    executeGameAction({ type: 'flee', untilDeath: false });
  };

  return (
    <Box sx={styles.container}>
      <Button
        variant="contained"
        onClick={handleAttack}
        sx={styles.attackButton}
      >
        <Typography variant={'h4'} lineHeight={'16px'}>
          ATTACK
        </Typography>
      </Button>

      <Button
        variant="contained"
        onClick={handleFlee}
        sx={styles.fleeButton}
      >
        <Typography variant={'h4'} lineHeight={'16px'}>
          FLEE
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  attackButton: {
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
  fleeButton: {
    width: '200px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    height: '56px',
    background: 'rgba(255, 0, 0, 0.25)',
    color: '#FF0000',
    borderRadius: '8px',
    border: '2px solid rgba(255, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 4px 12px rgba(255, 0, 0, 0.2)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      background: 'rgba(255, 0, 0, 0.35)',
      border: '2px solid rgba(255, 0, 0, 0.6)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(255, 0, 0, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 8px rgba(255, 0, 0, 0.2)',
    },
    '&:disabled': {
      background: 'rgba(255, 0, 0, 0.1)',
      color: 'rgba(255, 0, 0, 0.5)',
      border: '2px solid rgba(255, 0, 0, 0.1)',
      boxShadow: 'none',
    },
  },
};
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { calculateLevel, calculateNextLevelXP, calculateProgress } from '@/utils/game';
import { Box, Button, FormControlLabel, LinearProgress, Switch, Typography } from '@mui/material';
import { useState } from 'react';

export default function ExploreScreen() {
  const { adventurer, gameEvent, gameId } = useGameStore();
  const [untilBeast, setUntilBeast] = useState(false);
  const { explore } = useSystemCalls();

  if (!adventurer || !gameId) return null;

  const currentLevel = calculateLevel(adventurer.xp);
  const nextLevelXP = calculateNextLevelXP(currentLevel);
  const progress = calculateProgress(adventurer.xp);

  const handleExplore = () => {
    explore(gameId, untilBeast);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.xpContainer}>
        <Typography variant="h6">Level {currentLevel}</Typography>
        <Box sx={styles.progressContainer}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={styles.progressBar}
          />
          <Typography variant="body2" sx={styles.xpText}>
            {adventurer.xp} / {nextLevelXP} XP
          </Typography>
        </Box>
      </Box>

      <Box sx={styles.eventsContainer}>
        {gameEvent && (
          <Typography variant="body1" sx={styles.eventText}>
            {gameEvent.event_data}
          </Typography>
        )}
      </Box>

      <Box sx={styles.controlsContainer}>
        <FormControlLabel
          control={
            <Switch
              checked={untilBeast}
              onChange={(e) => setUntilBeast(e.target.checked)}
            />
          }
          label="Until Beast"
        />
        <Button
          variant="contained"
          color="primary"
          sx={styles.exploreButton}
          onClick={handleExplore}
        >
          EXPLORE
        </Button>
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    height: 'calc(100vh - 50px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    padding: '16px',
    margin: '0 auto',
    gap: 4
  },
  xpContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1
  },
  progressContainer: {
    width: '100%',
    position: 'relative'
  },
  progressBar: {
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    '& .MuiLinearProgress-bar': {
      borderRadius: 10,
    }
  },
  xpText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
  },
  eventsContainer: {
    width: '100%',
    minHeight: '100px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  eventText: {
    textAlign: 'center',
    color: 'white'
  },
  controlsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2
  },
  exploreButton: {
    width: '100%',
    height: '50px',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  }
};
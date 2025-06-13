import { Box, Typography, LinearProgress } from '@mui/material';
import { STARTING_HEALTH } from '@/constants/game';
import { calculateLevel } from '@/utils/game';
import { useGameStore } from '@/stores/gameStore';

export default function Adventurer() {
  const { adventurer, metadata } = useGameStore();

  const maxHealth = STARTING_HEALTH + ((adventurer?.stats?.vitality || 0) * 15);
  const healthPercent = (adventurer?.health || 0) / maxHealth * 100;

  return (
    <>
      {/* Portrait */}
      <Box sx={styles.portraitWrapper}>
        <img src="/images/adventurer.png" alt="Adventurer" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        <Box sx={styles.levelCircle}>
          <Typography variant="body2" sx={styles.levelText}>
            {calculateLevel(adventurer?.xp || 0)}
          </Typography>
        </Box>
      </Box>

      {/* Health Bar */}
      <Box sx={styles.healthBarContainer}>
        {/* Adventurer Name */}
        <Typography
          variant="h6"
          sx={{ ml: 4, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', height: '26px', lineHeight: '24px' }}
        >
          {metadata?.player_name || 'Adventurer'}
        </Typography>
        {/* HP Info */}
        <Box sx={{ ml: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <LinearProgress
              variant="determinate"
              value={healthPercent}
              sx={styles.adventurerHealthBar}
            />
            <Typography
              variant="body2"
              sx={styles.healthOverlayText}
            >
              {adventurer?.health || 0}/{maxHealth}
            </Typography>
          </Box>
          {/* XP Bar */}
          <Box sx={{ mt: 1, position: 'relative' }}>
            <LinearProgress
              variant="determinate"
              value={adventurer?.xp || 0}
              sx={styles.xpBar}
            />
            <Typography
              variant="body2"
              sx={styles.xpOverlayText}
            >
              XP
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}

const styles = {
  portraitWrapper: {
    position: 'absolute',
    top: 24,
    left: 24,
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(24, 40, 24, 1)',
    border: '3px solid #083e22',
    boxShadow: '0 0 8px rgba(0,0,0,0.6)',
    zIndex: 100,
  },
  healthBarContainer: {
    position: 'absolute',
    top: 30,
    left: '80px',
    width: '300px',
    height: '72px',
    padding: '4px 8px',
    background: 'rgba(24, 40, 24, 0.55)',
    border: '2px solid #083e22',
    borderRadius: '12px',
    boxSizing: 'border-box',
    backdropFilter: 'blur(8px)',
  },
  adventurerHealthBar: {
    height: '14px',
    borderRadius: '6px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#4CAF50',
      boxShadow: '0 0 8px rgba(76, 175, 80, 0.5)',
    },
  },
  healthOverlayText: {
    position: 'absolute',
    top: 1,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textShadow: '0 0 4px #000',
    pointerEvents: 'none',
  },
  xpBar: {
    height: '8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#9C27B0',
      boxShadow: '0 0 8px rgba(156, 39, 176, 0.5)',
    },
  },
  xpOverlayText: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textShadow: '0 0 4px #000',
    pointerEvents: 'none',
    fontSize: '0.75rem',
  },
  levelCircle: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #083e22',
    zIndex: 1,
  },
  levelText: {
    fontWeight: 'bold',
    fontSize: '0.75rem',
    lineHeight: 0,
  },
}; 
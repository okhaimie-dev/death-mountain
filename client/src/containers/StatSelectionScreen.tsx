import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { Stats } from '@/types/game';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

const STAT_DESCRIPTIONS = {
  strength: "Increases attack damage.",
  dexterity: "Increases chance of fleeing Beasts.",
  vitality: "Increases your maximum health.",
  intelligence: "Increases chance of dodging Obstacles.",
  wisdom: "Increases chance of avoiding a Beast ambush.",
  charisma: "Provides discounts on the marketplace."
};

export default function StatSelectionScreen() {
  const { gameId, adventurer } = useGameStore();
  const { levelUp } = useSystemCalls();

  const [isSelectingStats, setIsSelectingStats] = useState(false);
  const [selectedStats, setSelectedStats] = useState<Stats>({
    strength: 0,
    dexterity: 0,
    vitality: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    luck: 0
  });

  const handleStatIncrement = (stat: keyof Stats) => {
    if (pointsRemaining > 0) {
      setSelectedStats(prev => ({
        ...prev,
        [stat]: prev[stat] + 1
      }));
    }
  };

  const handleStatDecrement = (stat: keyof Stats) => {
    if (selectedStats[stat] > 0) {
      setSelectedStats(prev => ({
        ...prev,
        [stat]: prev[stat] - 1
      }));
    }
  };

  const handleSelectStats = async () => {
    setIsSelectingStats(true);
    await levelUp(gameId!, 0, selectedStats, []);
    setIsSelectingStats(false);
  };

  const totalSelected = Object.values(selectedStats).reduce((a, b) => a + b, 0);
  const pointsRemaining = adventurer!.stat_upgrades_available - totalSelected;

  return (
    <Box sx={styles.container}>
      <Box sx={styles.content}>
        <Typography variant="h4" sx={styles.title}>
          Select Stat Upgrades
        </Typography>

        <Box sx={styles.pointsContainer}>
          <Typography sx={styles.pointsText}>
            Points Remaining: {pointsRemaining}
          </Typography>
        </Box>

        <Box sx={styles.statsGrid}>
          {Object.entries(STAT_DESCRIPTIONS).map(([stat, description]) => (
            <Box key={stat} sx={styles.statCard}>
              <Box sx={styles.statHeader}>
                <Typography sx={styles.statName}>
                  {stat.charAt(0).toUpperCase() + stat.slice(1)}
                </Typography>
                <Typography sx={styles.currentValue}>
                  {adventurer!.stats[stat as keyof Stats]}
                </Typography>
              </Box>

              <Typography sx={styles.statDescription}>
                {description}
              </Typography>

              <Box sx={styles.statControls}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleStatDecrement(stat as keyof Stats)}
                  sx={styles.controlButton}
                >
                  -
                </Button>
                <Typography sx={styles.selectedValue}>
                  {selectedStats[stat as keyof Stats]}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleStatIncrement(stat as keyof Stats)}
                  sx={styles.controlButton}
                >
                  +
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleSelectStats}
          disabled={pointsRemaining !== 0 || isSelectingStats}
          sx={styles.selectButton}
        >
          {isSelectingStats
            ? <Box display={'flex'} alignItems={'baseline'}>
              <Typography variant={'h4'} lineHeight={'16px'}>Selecting Stats</Typography>
              <div className='dotLoader green' />
            </Box>
            : <Typography variant={'h4'} lineHeight={'16px'}>
              Select Stats
            </Typography>
          }
        </Button>
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  title: {
    color: '#80FF00',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(128, 255, 0, 0.3)',
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  pointsContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '6px 12px',
    background: 'rgba(237, 207, 51, 0.1)',
    borderRadius: '6px',
    border: '1px solid rgba(237, 207, 51, 0.2)',
  },
  pointsText: {
    color: '#EDCF33',
    fontSize: '1.1rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    flex: 1,
    maxWidth: '500px',
    margin: '0 auto',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '8px',
    background: 'linear-gradient(145deg, rgba(128, 255, 0, 0.08), rgba(128, 255, 0, 0.03))',
    borderRadius: '10px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
    boxShadow: `
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(128, 255, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    backdropFilter: 'blur(8px)',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '6px',
    borderBottom: '1px solid rgba(128, 255, 0, 0.15)',
  },
  statName: {
    color: '#80FF00',
    fontSize: '1rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    textShadow: '0 0 8px rgba(128, 255, 0, 0.3)',
  },
  currentValue: {
    color: 'rgba(128, 255, 0, 0.9)',
    fontSize: '0.95rem',
    fontFamily: 'VT323, monospace',
    background: 'rgba(128, 255, 0, 0.15)',
    padding: '2px 8px',
    borderRadius: '4px',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  statDescription: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '0.95rem',
    fontFamily: 'VT323, monospace',
    lineHeight: '1.2',
    marginBottom: '6px',
    padding: '8px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
  },
  statControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: 'auto',
    padding: '8px',
  },
  controlButton: {
    minWidth: '28px',
    height: '28px',
    padding: '0',
    background: 'rgba(0, 0, 0, 0.2)',
    color: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    fontWeight: '300',
    borderRadius: '4px',
  },
  selectedValue: {
    color: '#80FF00',
    fontSize: '1.2rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    minWidth: '32px',
    textAlign: 'center',
    padding: '0 4px',
  },
  selectButton: {
    width: '100%',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    height: '42px',
    background: 'rgba(128, 255, 0, 0.15)',
    color: '#80FF00',
    borderRadius: '6px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
    marginBottom: '60px',
    '&:disabled': {
      background: 'rgba(128, 255, 0, 0.1)',
      color: 'rgba(128, 255, 0, 0.5)',
      border: '1px solid rgba(128, 255, 0, 0.1)',
    },
  },
}; 
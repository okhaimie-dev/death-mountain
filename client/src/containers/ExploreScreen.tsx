import AdventurerInfo from '@/components/AdventurerInfo';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { calculateLevel, calculateNextLevelXP, calculateProgress } from '@/utils/game';
import { Box, Button, FormControlLabel, Switch, Typography, keyframes } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

// Demo events array
const DEMO_EVENTS = [
  { type: 'level', title: 'Reached Level 4!', xp: 0, health: 0, gold: 0, icon: '🌟' },
  { type: 'combat', title: 'Defeated Goblin', xp: 10, health: -5, gold: 2, icon: '⚔️' },
  { type: 'treasure', title: 'Found Gold Pouch', xp: 5, health: 0, gold: 5, icon: '💰' },
  { type: 'healing', title: 'Found Healing Potion', xp: 5, health: 10, gold: 0, icon: '🧪' },
  { type: 'trap', title: 'Avoided Spike Trap', xp: 5, health: -2, gold: 0, icon: '🕳️' },
  { type: 'boss', title: 'Defeated Cave Troll', xp: 25, health: -15, gold: 10, icon: '👹' },
];

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function ExploreScreen() {
  const { adventurer, gameEvent, gameId } = useGameStore();
  const [untilBeast, setUntilBeast] = useState(false);
  const { explore } = useSystemCalls();
  const [isExploring, setIsExploring] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(-1);
  const [eventHistory, setEventHistory] = useState<typeof DEMO_EVENTS>([DEMO_EVENTS[0]]);
  const [tempStats, setTempStats] = useState({
    xp: 0,
    health: 0,
    gold: 0
  });
  const listRef = useRef<HTMLDivElement>(null);

  if (!adventurer || !gameId) return null;

  const currentLevel = calculateLevel(adventurer.xp);
  const nextLevelXP = calculateNextLevelXP(currentLevel);
  const progress = calculateProgress(adventurer.xp);
  const xpToNext = nextLevelXP - adventurer.xp;

  // Function to scroll to top
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  };

  // Scroll when new events are added
  useEffect(() => {
    scrollToTop();
  }, [eventHistory]);

  const handleExplore = () => {
    setIsExploring(true);
    setCurrentEventIndex(1);
    setTempStats({ xp: 0, health: 0, gold: 0 });
  };

  useEffect(() => {
    if (isExploring && currentEventIndex >= 0) {
      const timer = setTimeout(() => {
        if (currentEventIndex < DEMO_EVENTS.length - 1) {
          setCurrentEventIndex(prev => prev + 1);
          const currentEvent = DEMO_EVENTS[currentEventIndex];
          setEventHistory(prev => [currentEvent, ...prev]);
          setTempStats(prev => ({
            xp: prev.xp + currentEvent.xp,
            health: prev.health + currentEvent.health,
            gold: prev.gold + currentEvent.gold
          }));
        } else {
          setIsExploring(false);
          setCurrentEventIndex(-1);
          // Here you would actually call the explore system
          // explore(gameId, untilBeast);
        }
      }, 2000); // Show each event for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isExploring, currentEventIndex]);

  return (
    <Box sx={styles.container}>
      {/* Main Content */}
      <Box sx={styles.mainContent}>
        {/* XP Progress Section */}
        <Box sx={styles.characterInfo}>
          <AdventurerInfo />
        </Box>

        {/* Event History */}
        <Box sx={styles.section}>
          <Box sx={styles.sectionHeader}>
            <Typography sx={styles.sectionTitle}>Explorer Log</Typography>
          </Box>
          <Box sx={styles.encountersList} ref={listRef}>
            {eventHistory.map((event, index) => (
              <Box
                key={`${event.title}-${index}`}
                sx={{
                  ...styles.encounter,
                  ...(index === 0 && {
                    animation: `${fadeIn} 0.5s ease-in-out`,
                  }),
                }}
              >
                <Box sx={styles.encounterIcon}>{event.icon}</Box>
                <Box sx={styles.encounterDetails}>
                  <Typography sx={styles.encounterTitle}>{event.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {event.xp > 0 && (
                      <Typography sx={styles.encounterXP}>+{event.xp} XP</Typography>
                    )}
                    {event.health !== 0 && (
                      <Typography sx={styles.encounterXP}>
                        {event.health > 0 ? '+' : ''}{event.health} Health
                      </Typography>
                    )}
                    {event.gold > 0 && (
                      <Typography sx={styles.encounterXP}>+{event.gold} Gold</Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Stats and Controls */}
        <Box textAlign="center">
          {/* Explore Controls */}
          <Button
            variant="contained"
            onClick={handleExplore}
            disabled={isExploring}
            sx={styles.exploreButton}
          >
            {isExploring
              ? <Box display={'flex'} alignItems={'baseline'}>
                <Typography variant={'h4'} lineHeight={'16px'}>
                  EXPLORING
                </Typography>
                <div className='dotLoader green' />
              </Box>
              : <Typography variant={'h4'} lineHeight={'16px'}>
                EXPLORE
              </Typography>
            }
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={untilBeast}
                onChange={(e) => setUntilBeast(e.target.checked)}
                sx={styles.switch}
              />
            }
            label="Until Beast"
            sx={styles.switchLabel}
          />
        </Box>
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
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },
  xpSection: {
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
    padding: '16px',
  },
  levelInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  levelText: {
    color: '#EDCF33',
    fontFamily: 'VT323, monospace',
    fontSize: '1rem',
  },
  xpText: {
    color: '#80FF00',
    fontFamily: 'VT323, monospace',
    fontSize: '1.1rem',
  },
  nextLevelText: {
    color: 'rgba(237, 207, 51, 0.7)',
    fontFamily: 'VT323, monospace',
    fontSize: '1.1rem',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  progressBar: {
    height: '8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(128, 255, 0, 0.1)',
    '& .MuiLinearProgress-bar': {
      background: 'linear-gradient(90deg, #80FF00, #9dff33)',
      borderRadius: '4px',
    },
  },
  xpToNext: {
    color: 'rgba(237, 207, 51, 0.7)',
    fontFamily: 'VT323, monospace',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  section: {
    padding: 1,
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '6px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    height: '24px',
  },
  sectionTitle: {
    color: '#80FF00',
    fontFamily: 'VT323, monospace',
    fontSize: '1.2rem',
    lineHeight: '24px',
  },
  encountersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    pr: 1,
    maxHeight: '300px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(128, 255, 0, 0.1)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(128, 255, 0, 0.3)',
      borderRadius: '3px',
    },
  },
  encounter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
  },
  encounterIcon: {
    fontSize: '1.5rem',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  encounterDetails: {
    flex: 1,
  },
  encounterTitle: {
    color: 'rgba(128, 255, 0, 0.9)',
    fontFamily: 'VT323, monospace',
    fontSize: '1rem',
  },
  encounterXP: {
    color: '#EDCF33',
    fontFamily: 'VT323, monospace',
    fontSize: '0.9rem',
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  statsContainer: {
    display: 'flex',
    gap: 2,
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
    padding: '16px',
  },
  statItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  statLabel: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.85rem',
    fontFamily: 'VT323, monospace',
    lineHeight: 1,
  },
  healthContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  healthBar: {
    height: '6px',
    borderRadius: '3px',
    backgroundColor: 'rgba(128, 255, 0, 0.1)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#80FF00',
    },
  },
  healthValue: {
    color: '#80FF00',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    lineHeight: 1,
  },
  goldValue: {
    color: '#EDCF33',
    fontSize: '1.2rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    lineHeight: 1,
  },
  controlsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
    padding: '16px',
  },
  exploreButton: {
    width: '100%',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    height: '42px',
    background: 'rgba(128, 255, 0, 0.15)',
    color: '#80FF00',
    borderRadius: '6px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
    marginBottom: '8px',
    '&:disabled': {
      background: 'rgba(128, 255, 0, 0.1)',
      color: 'rgba(128, 255, 0, 0.5)',
      border: '1px solid rgba(128, 255, 0, 0.1)',
    },
  },
  switch: {
    '& .MuiSwitch-thumb': {
      backgroundColor: '#80FF00',
    },
    '& .MuiSwitch-track': {
      backgroundColor: 'rgba(128, 255, 0, 0.3)',
    },
  },
  switchLabel: {
    color: 'rgba(128, 255, 0, 0.8)',
    fontFamily: 'VT323, monospace',
    fontSize: '1rem',
  },
  characterInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
};
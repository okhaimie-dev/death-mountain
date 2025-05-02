import AdventurerInfo from '@/components/AdventurerInfo';
import { BEAST_NAMES } from '@/constants/beast';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { ExploreEvent } from '@/utils/events';
import { OBSTACLE_NAMES } from '@/utils/obstacleNames';
import { Box, Button, FormControlLabel, Switch, Typography, keyframes } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export default function ExploreScreen() {
  const { explore } = useSystemCalls();
  const { exploreLog, gameId, setKeepScreen } = useGameStore();

  const [untilBeast, setUntilBeast] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [eventHistory, setEventHistory] = useState<ExploreEvent[]>(exploreLog);
  const listRef = useRef<HTMLDivElement>(null);

  // Function to scroll to top
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  };

  // Handle new events when exploreLog updates
  useEffect(() => {
    if (eventHistory.length < exploreLog.length) {
      // Get the new events that were added
      let count = exploreLog.length - eventHistory.length;
      const newEvents = exploreLog.slice(0, count);

      // Add each new event one by one with a delay
      newEvents.forEach((event, index) => {
        setTimeout(() => {
          setEventHistory(prev => [event, ...prev]);
          scrollToTop();
        }, index * 1000); // 1 second delay between each event
      });
    }
  }, [exploreLog]);

  useEffect(() => {
    if (isExploring && eventHistory.length === exploreLog.length) {
      setIsExploring(false);
    }
  }, [eventHistory, exploreLog]);

  const handleExplore = async () => {
    setIsExploring(true);
    explore(gameId!, untilBeast);
  };

  const getEventIcon = (event: ExploreEvent) => {
    switch (event.type) {
      case 'discovery':
        return '🌟';
      case 'obstacle':
        return event.dodged ? '🕳️' : '⚔️';
      case 'defeated_beast':
        return '👹';
      case 'fled_beast':
        return '🏃';
      case 'stat_upgrade':
        return '📈';
      case 'level_up':
        return '🔝';
      case 'market':
        return '🏪';
      case 'equip':
        return '⚔️';
      case 'drop':
        return '🎁';
      case 'beast':
        return '👹';
      default:
        return '❓';
    }
  };

  const getEventTitle = (event: ExploreEvent) => {
    switch (event.type) {
      case 'discovery':
        if (event.discovery_type?.variant) {
          const variant = event.discovery_type.variant;
          if (variant.Gold !== undefined) return 'Discovered Gold';
          if (variant.Health !== undefined) return 'Discovered Health';
          if (variant.Loot !== undefined) return 'Discovered Loot';
        }
        return 'Discovered Unknown';
      case 'obstacle':
        const location = event.location || 'None';
        const obstacleName = OBSTACLE_NAMES[event.obstacle_id!] || 'Unknown Obstacle';
        if (event.damage === 0) {
          return `Avoided ${obstacleName}`;
        }
        return `${obstacleName} hit your ${location}`;
      case 'defeated_beast':
        return 'Defeated Beast';
      case 'fled_beast':
        return 'Fled from Beast';
      case 'level_up':
        return 'Level Up';
      case 'stat_upgrade':
        return 'Stats Upgraded';
      case 'market':
        return 'Visited Market';
      case 'equip':
        return 'Equipped Items';
      case 'drop':
        return 'Items Dropped';
      case 'beast':
        return `Encountered a ${BEAST_NAMES[event.beast_id!]}`;
      default:
        return 'Unknown Event';
    }
  };

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
                key={`${index}`}
                sx={{
                  ...styles.encounter,
                  animation: `${fadeIn} 0.5s ease-in-out`,
                }}
              >
                <Box sx={styles.encounterIcon}>{getEventIcon(event)}</Box>
                <Box sx={styles.encounterDetails}>
                  <Typography sx={styles.encounterTitle}>{getEventTitle(event)}</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {typeof event.xp_reward === 'number' && event.xp_reward > 0 && (
                      <Typography sx={styles.encounterXP}>+{event.xp_reward} XP</Typography>
                    )}
                    {event.type === 'obstacle' && typeof event.damage === 'number' && (
                      <Typography sx={styles.encounterXP}>
                        {event.damage === 0 ? 'Avoided' : `-${event.damage} Health ${event.critical ? 'CRIT' : ''}`}
                      </Typography>
                    )}
                    {typeof event.gold_reward === 'number' && event.gold_reward > 0 && (
                      <Typography sx={styles.encounterXP}>
                        +{event.gold_reward} Gold
                      </Typography>
                    )}
                    {event.type === 'discovery' && event.discovery_type?.variant && (
                      <>
                        {event.discovery_type.variant.Gold !== undefined && (
                          <Typography sx={styles.encounterXP}>
                            +{event.discovery_type.variant.Gold} Gold
                          </Typography>
                        )}
                        {event.discovery_type.variant.Health !== undefined && (
                          <Typography sx={styles.encounterXP}>
                            +{event.discovery_type.variant.Health} Health
                          </Typography>
                        )}
                        {event.discovery_type.variant.Loot !== undefined && (
                          <Typography sx={styles.encounterXP}>
                            +{event.discovery_type.variant.Loot} Loot
                          </Typography>
                        )}
                      </>
                    )}
                    {event.type === 'stat_upgrade' && event.stats && (
                      <Typography sx={styles.encounterXP}>
                        {Object.entries(event.stats)
                          .filter(([_, value]) => typeof value === 'number' && value > 0)
                          .map(([stat, value]) => `+${value} ${stat.slice(0, 3).toUpperCase()}`)
                          .join(', ')}
                      </Typography>
                    )}
                    {event.type === 'level_up' && event.level && (
                      <Typography sx={styles.encounterXP}>
                        Reached Level {event.level}
                      </Typography>
                    )}
                    {event.type === 'market' && typeof event.potions === 'number' && (
                      <Typography sx={styles.encounterXP}>
                        {event.potions > 0 ? `+${event.potions} Potions` : 'No Potions'}
                      </Typography>
                    )}
                    {event.type === 'equip' && event.items && event.items.length > 0 && (
                      <Typography sx={styles.encounterXP}>
                        Equipped {event.items.length} items
                      </Typography>
                    )}
                    {event.type === 'drop' && event.items && event.items.length > 0 && (
                      <Typography sx={styles.encounterXP}>
                        Dropped {event.items.length} items
                      </Typography>
                    )}
                    {event.type === 'beast' && (
                      <Typography sx={styles.encounterXP}>
                        Level {event.beast_level} Power {event.beast_tier! * event.beast_level!}
                      </Typography>
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
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { ability_based_percentage, calculateLevel } from '../utils/game';
import { potionPrice } from '../utils/market';
import { MAX_STAT_VALUE } from '../constants/game';

const STAT_DESCRIPTIONS = {
  strength: "Increases attack damage.",
  dexterity: "Increases chance of fleeing Beasts.",
  vitality: "Increases your maximum health.",
  intelligence: "Increases chance of dodging Obstacles.",
  wisdom: "Increases chance of avoiding Beast ambush.",
  charisma: "Provides discounts on the marketplace.",
  luck: "Increases chance of critical hits."
} as const;

type Stats = {
  [K in keyof typeof STAT_DESCRIPTIONS]: number;
};

interface AdventurerStatsProps {
  onStatsChange?: (stats: Stats) => void;
}

export default function AdventurerStats({ onStatsChange }: AdventurerStatsProps) {
  const { adventurer } = useGameStore();
  const [selectedStats, setSelectedStats] = useState({
    strength: 0,
    dexterity: 0,
    vitality: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    luck: 0
  });

  useEffect(() => {
    onStatsChange?.(selectedStats);
  }, [selectedStats, onStatsChange]);

  const handleStatIncrement = (stat: keyof typeof STAT_DESCRIPTIONS) => {
    if (pointsRemaining > 0 && (selectedStats[stat] + adventurer!.stats[stat]) < MAX_STAT_VALUE) {
      setSelectedStats(prev => ({
        ...prev,
        [stat]: prev[stat] + 1
      }));
    }
  };

  const handleStatDecrement = (stat: keyof typeof STAT_DESCRIPTIONS) => {
    if (selectedStats[stat] > 0) {
      setSelectedStats(prev => ({
        ...prev,
        [stat]: prev[stat] - 1
      }));
    }
  };

  const totalSelected = Object.values(selectedStats).reduce((a, b) => a + b, 0);
  const pointsRemaining = adventurer!.stat_upgrades_available - totalSelected;

  function STAT_TITLE(stat: string) {
    if (stat === 'intelligence') {
      return 'Intellect';
    }

    return stat.charAt(0).toUpperCase() + stat.slice(1);
  }

  function STAT_HELPER_TEXT(stat: string, currentValue: number) {
    const level = calculateLevel(adventurer!.xp);

    if (stat === 'strength') {
      return `+${currentValue * 10}% damage`;
    } else if (stat === 'dexterity') {
      return `${ability_based_percentage(adventurer!.xp, currentValue)}% chance`;
    } else if (stat === 'vitality') {
      return `+${currentValue * 15} Health`;
    } else if (stat === 'intelligence') {
      return `${ability_based_percentage(adventurer!.xp, currentValue)}% chance`;
    } else if (stat === 'wisdom') {
      return `${ability_based_percentage(adventurer!.xp, currentValue)}% chance`;
    } else if (stat === 'charisma') {
      return (
        <Box>
          <Typography sx={styles.tooltipValue}>Potion cost: {potionPrice(level, currentValue)} Gold</Typography>
          <Typography sx={styles.tooltipValue}>Item discount: {currentValue} Gold</Typography>
        </Box>
      );
    } else if (stat === 'luck') {
      return `${currentValue}% chance of critical hits`;
    }
    return null;
  }

  return (
    <>
      <Box sx={styles.statsPanel}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography color="secondary" sx={styles.statsTitle}>Stats</Typography>
          {adventurer?.stat_upgrades_available! > 0 &&
            <Typography color="secondary">({pointsRemaining} remaining)</Typography>
          }
        </Box>
        {Object.entries(STAT_DESCRIPTIONS).map(([stat, description]) => (
          <Box sx={styles.statRow} key={stat}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip
                title={
                  <Box sx={styles.tooltipContainer}>
                    <Box sx={styles.tooltipTypeRow}>
                      <Typography sx={styles.tooltipTypeText}>
                        {STAT_TITLE(stat)}
                      </Typography>
                      <Typography sx={styles.tooltipTypeText}>
                        {adventurer?.stats?.[stat as keyof typeof STAT_DESCRIPTIONS]! + selectedStats[stat as keyof typeof STAT_DESCRIPTIONS]!}
                      </Typography>
                    </Box>
                    <Box sx={styles.sectionDivider} />
                    <Box sx={styles.tooltipSection}>
                      <Typography sx={styles.tooltipDescription}>
                        {description}
                      </Typography>
                      <Box sx={styles.tooltipRow}>
                        <Typography sx={styles.tooltipLabel}>Current Effect:</Typography>
                        <Typography sx={styles.tooltipValue}>
                          {STAT_HELPER_TEXT(stat, adventurer?.stats?.[stat as keyof typeof STAT_DESCRIPTIONS]! + selectedStats[stat as keyof typeof STAT_DESCRIPTIONS]!)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                }
                arrow
                placement="right"
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'preventOverflow',
                        enabled: true,
                        options: { rootBoundary: 'viewport' },
                      },
                    ],
                  },
                  tooltip: {
                    sx: {
                      bgcolor: 'transparent',
                      border: 'none',
                    },
                  },
                }}
              >
                <Box sx={styles.infoIcon}>i</Box>
              </Tooltip>
              <Typography sx={styles.statLabel}>{STAT_TITLE(stat)}</Typography>
            </Box>
            <Box sx={styles.statControls}>
              {adventurer?.stat_upgrades_available! > 0 && stat !== 'luck' && <Button
                variant="contained"
                size="small"
                onClick={() => handleStatDecrement(stat as keyof typeof STAT_DESCRIPTIONS)}
                sx={styles.controlButton}
              >
                -
              </Button>}

              <Typography sx={{ width: '18px', textAlign: 'center', pt: '1px' }}>
                {adventurer?.stats?.[stat as keyof typeof STAT_DESCRIPTIONS]! + selectedStats[stat as keyof typeof STAT_DESCRIPTIONS]!}
              </Typography>

              {adventurer?.stat_upgrades_available! > 0 && stat !== 'luck' && <Button
                variant="contained"
                size="small"
                onClick={() => handleStatIncrement(stat as keyof typeof STAT_DESCRIPTIONS)}
                disabled={(adventurer!.stats[stat as keyof typeof STAT_DESCRIPTIONS] + selectedStats[stat as keyof typeof STAT_DESCRIPTIONS]) >= MAX_STAT_VALUE}
                sx={styles.controlButton}
              >
                +
              </Button>}
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}

const styles = {
  statsPanel: {
    height: '240px',
    width: '185px',
    background: 'rgba(24, 40, 24, 0.95)',
    border: '2px solid #083e22',
    borderRadius: '8px',
    padding: '10px 8px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    boxShadow: '0 0 8px #000a',
  },
  statsTitle: {
    fontWeight: '500',
    fontSize: 16,
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: '500',
    pt: '1px'
  },
  infoIcon: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '1px solid #d0c98d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#d0c98d',
    cursor: 'help',
  },
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(17, 17, 17, 1)',
    border: '2px solid #083e22',
    borderRadius: '8px',
    padding: '10px',
    zIndex: 1000,
    minWidth: '250px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  tooltipTypeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '6px',
    padding: '2px 0',
  },
  tooltipTypeText: {
    color: '#d0c98d',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  tooltipSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '4px 0',
  },
  tooltipDescription: {
    fontSize: '14px',
  },
  tooltipRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  tooltipLabel: {
    color: '#d7c529',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tooltipValue: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  sectionDivider: {
    height: '1px',
    backgroundColor: '#d7c529',
    opacity: 0.2,
    margin: '8px 0 4px',
  },
  statControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    marginLeft: 'auto',
  },
  controlButton: {
    minWidth: '20px',
    height: '20px',
    padding: '0',
    background: 'rgba(0, 0, 0, 0.2)',
    color: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: '300',
    borderRadius: '2px',
    '&:disabled': {
      background: 'rgba(0, 0, 0, 0.1)',
      color: 'rgba(255, 255, 255, 0.3)',
    },
  },
}; 
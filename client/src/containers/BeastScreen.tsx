import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { Beast } from '@/types/game';
import { getBeast, getBeastImage } from '@/utils/beast';
import { Box, Button, FormControlLabel, Paper, Switch, Typography, LinearProgress } from '@mui/material';
import { useState } from 'react';

export default function BeastScreen() {
  const { attack, flee } = useSystemCalls();
  const { gameId, adventurer, beastSeed, metadata } = useGameStore();
  const [untilDeath, setUntilDeath] = useState(false);

  const [beast] = useState<Beast>(
    getBeast(BigInt(beastSeed!), adventurer!.xp)
  );

  const [combatLog, setCombatLog] = useState<string>("A wild " + beast.name + " appears!");

  const beastPower = Number(beast.level) * (6 - Number(beast.tier));

  const handleAttack = () => {
    attack(gameId!, untilDeath);
    setCombatLog(`You attacked ${beast.name} for ${beastPower} damage`);
  };

  const handleFlee = () => {
    flee(gameId!, untilDeath);
    setCombatLog(`You attempted to flee from ${beast.name}`);
  };

  return (
    <Box sx={styles.container}>
      <Box className="container" sx={styles.battleContainer}>
        {/* Top Section - Beast */}
        <Box sx={styles.topSection}>
          <Box sx={styles.beastInfo}>
            <Box sx={styles.beastHeader}>
              <Typography variant="h4" sx={styles.beastName}>
                {beast.name}
              </Typography>
              <Box sx={styles.beastType}>
                <Typography variant="body2" sx={styles.typeText}>
                  {beast.type}
                </Typography>
                <Typography variant="body2" sx={styles.levelText}>
                  Lvl {beast.level} • {beast.tier}
                </Typography>
              </Box>
            </Box>
            <Box sx={styles.statsContainer}>
              <Box sx={styles.statItem}>
                <Typography variant="body2" sx={styles.statLabel}>Power</Typography>
                <Typography variant="h6" sx={styles.statValue}>{beastPower}</Typography>
              </Box>
              <Box sx={styles.statItem}>
                <Typography variant="body2" sx={styles.statLabel}>Health</Typography>
                <Box sx={styles.healthContainer}>
                  <Typography variant="h6" sx={styles.healthValue}>{beast.health}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(beast.health / 100) * 100}
                    sx={styles.healthBar}
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={styles.rewardsContainer}>
              <Typography variant="body1" sx={styles.rewardText}>
                Rewards: {beast.goldReward} Gold • {beast.xpReward} XP
              </Typography>
            </Box>
          </Box>
          <Box sx={styles.beastImageContainer}>
            <img
              src={getBeastImage(beast.name)}
              alt={beast.name}
              style={styles.beastImage}
            />
          </Box>
        </Box>

        {/* Middle Section - Combat Log */}
        <Box sx={styles.middleSection}>
          <Box sx={styles.combatLogContainer}>
            <Typography sx={styles.combatLogEntry}>
              {combatLog}
            </Typography>
          </Box>
        </Box>

        {/* Bottom Section - Adventurer */}
        <Box sx={styles.bottomSection}>
          <Box sx={styles.adventurerImageContainer}>
            <img
              src="/src/assets/images/adventurer.png"
              alt="Adventurer"
              style={styles.adventurerImage}
            />
          </Box>

          <Box sx={styles.adventurerInfo}>
            <Box sx={styles.adventurerHeader}>

              <Box sx={styles.healthContainer}>
                <Box sx={styles.statsRow}>
                  <Box sx={styles.statCard}>
                    <Typography sx={styles.statLabel}>Attack</Typography>
                    <Typography sx={styles.statValue}>{adventurer?.xp || 4}</Typography>
                  </Box>
                  <Box sx={styles.statCard}>
                    <Typography sx={styles.statLabel}>Health</Typography>
                    <Typography sx={styles.statValue}>{adventurer?.health || 0}</Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(adventurer?.health || 0)}
                  sx={styles.healthBar}
                />
              </Box>
            </Box>
            <Box sx={styles.actionsContainer}>
              <Button
                variant="contained"
                size="small"
                onClick={handleAttack}
                sx={styles.attackButton}
              >
                ATTACK
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleFlee}
                sx={styles.fleeButton}
              >
                FLEE
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    maxWidth: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  battleContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  topSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '20px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
  },
  beastInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  beastHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  beastName: {
    color: '#80FF00',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(128, 255, 0, 0.3)',
  },
  beastType: {
    display: 'flex',
    gap: '12px',
  },
  typeText: {
    color: '#80FF00',
    background: 'rgba(128, 255, 0, 0.1)',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  levelText: {
    color: '#EDCF33',
    background: 'rgba(237, 207, 51, 0.1)',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  statsContainer: {
    display: 'flex',
    gap: '20px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statLabel: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.875rem',
  },
  statValue: {
    color: '#80FF00',
    fontWeight: 'bold',
  },
  healthContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  healthValue: {
    color: '#80FF00',
    fontWeight: 'bold',
  },
  healthBar: {
    height: '6px',
    borderRadius: '3px',
    backgroundColor: 'rgba(128, 255, 0, 0.1)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#80FF00',
    },
  },
  beastImageContainer: {
    width: '180px',
    height: '180px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  beastImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
    filter: 'drop-shadow(0 0 10px rgba(128, 255, 0, 0.3))',
  },
  middleSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 20px',
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '20px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
  },
  combatLogContainer: {
    width: '100%',
    minHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  combatLogEntry: {
    color: 'rgba(128, 255, 0, 0.8)',
    fontFamily: 'VT323, monospace',
    fontSize: '1.1rem',
    lineHeight: '1.2',
    textAlign: 'center',
  },
  actionsContainer: {
    display: 'flex',
    gap: '10px',
    width: '100%',
  },
  attackButton: {
    flex: 1,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #80FF00 30%, #9dff33 90%)',
    borderRadius: '12px',
    color: '#111111',
    '&:hover': {
      background: 'linear-gradient(45deg, #9dff33 30%, #80FF00 90%)',
    },
  },
  fleeButton: {
    flex: 1,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #EDCF33 30%, #f5e066 90%)',
    borderRadius: '12px',
    color: '#111111',
    '&:hover': {
      background: 'linear-gradient(45deg, #f5e066 30%, #EDCF33 90%)',
    },
  },
  deathSwitch: {
    '& .MuiSwitch-thumb': {
      backgroundColor: '#80FF00',
    },
    '& .MuiSwitch-track': {
      backgroundColor: 'rgba(128, 255, 0, 0.3)',
    },
  },
  deathSwitchLabel: {
    color: 'rgba(128, 255, 0, 0.7)',
  },
  bottomSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '20px',
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '20px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
    gap: 2
  },
  adventurerInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  adventurerHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  playerName: {
    color: '#80FF00',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(128, 255, 0, 0.3)',
  },
  rewardsContainer: {
    background: 'rgba(237, 207, 51, 0.1)',
    padding: '12px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(237, 207, 51, 0.2)',
  },
  rewardText: {
    color: '#EDCF33',
    fontWeight: 'bold',
  },
  adventurerImageContainer: {
    width: '120px',
    height: '120px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adventurerImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
    filter: 'drop-shadow(0 0 10px rgba(128, 255, 0, 0.3))',
  },
  statsRow: {
    display: 'flex',
    gap: '4px',
    marginBottom: '8px',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2px 6px',
    background: 'rgba(128, 255, 0, 0.1)',
    borderRadius: '4px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
    minWidth: '32px',
  },
  statLabel: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.7rem',
    lineHeight: '1',
    fontFamily: 'VT323, monospace',
  },
  statValue: {
    color: '#80FF00',
    fontSize: '0.9rem',
    lineHeight: '1',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
  },
};
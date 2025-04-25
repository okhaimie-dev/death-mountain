import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { Beast } from '@/types/game';
import { getBeast, getBeastImage } from '@/utils/beast';
import { Box, Button, FormControlLabel, Paper, Switch, Typography } from '@mui/material';
import { useState } from 'react';

export default function BeastScreen() {
  const { attack, flee } = useSystemCalls();
  const { gameId, adventurer, beastSeed, metadata } = useGameStore();
  const [untilDeath, setUntilDeath] = useState(false);

  console.log("gameId", gameId)

  const [beast] = useState<Beast>(
    getBeast(BigInt(beastSeed!), adventurer!.xp)
  );

  const handleAttack = () => {
    attack(gameId!, untilDeath);
  };

  const handleFlee = () => {
    flee(gameId!, untilDeath);
  };

  return (
    <Box sx={styles.container}>
      <Paper elevation={3} sx={styles.statsContainer}>
        <Typography variant="h4" sx={styles.title}>Battle</Typography>

        <Box sx={styles.contentContainer}>
          <Box sx={styles.beastSection}>
            {/* Beast Stats */}
            <Box sx={styles.section}>
              <Typography variant="h6" color="error">Beast</Typography>
              <Typography>Name: {beast.name}</Typography>
              <Typography>Type: {beast.type}</Typography>
              <Typography>Tier: {beast.tier}</Typography>
              <Typography>Level: {beast.level}</Typography>
              <Typography>Health: {beast.health}</Typography>
              {beast.specialPrefix && <Typography>Special: {beast.specialPrefix}</Typography>}
              {beast.specialSuffix && <Typography>Special: {beast.specialSuffix}</Typography>}
            </Box>

            {/* Beast Image */}
            <Box sx={styles.imageContainer}>
              <img
                src={getBeastImage(beast.name)}
                alt={beast.name}
                style={styles.beastImage}
              />
            </Box>
          </Box>

          <Box sx={styles.adventurerSection}>
            {/* Adventurer Stats */}
            <Box sx={styles.section}>
              <Typography variant="h6" color="primary">{metadata?.player_name}</Typography>
              <Typography>Health: {adventurer?.health}</Typography>
              <Typography>XP: {adventurer?.xp}</Typography>
              <Typography>Gold: {adventurer?.gold}</Typography>
            </Box>

            {/* Rewards */}
            <Box sx={styles.section}>
              <Typography variant="h6">Rewards</Typography>
              <Typography>Gold: {beast.goldReward}</Typography>
              <Typography>XP: {beast.xpReward}</Typography>
            </Box>
          </Box>

        </Box>

        {/* Actions */}
        <Box sx={styles.actionsContainer}>
          <FormControlLabel
            control={
              <Switch
                checked={untilDeath}
                onChange={(e) => setUntilDeath(e.target.checked)}
              />
            }
            label="Until Death"
          />
          <Box sx={styles.buttonContainer}>
            <Button
              variant="contained"
              color="error"
              onClick={handleAttack}
              sx={styles.button}
            >
              ATTACK
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFlee}
              sx={styles.button}
            >
              FLEE
            </Button>
          </Box>
        </Box>
      </Paper >
    </Box >
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
    gap: 2
  },
  statsContainer: {
    width: '100%',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },
  title: {
    textAlign: 'center',
    marginBottom: 2
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  imageContainer: {
    flex: '0 0 150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  beastSection: {
    flex: 1,
    display: 'flex',
    gap: 2
  },
  adventurerSection: {
    display: 'flex',
    gap: 15
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center'
  },
  buttonContainer: {
    display: 'flex',
    gap: 2,
    width: '100%',
    justifyContent: 'center'
  },
  button: {
    minWidth: '120px'
  },
  beastImage: {
    maxWidth: '150px',
    maxHeight: '150px',
    objectFit: 'contain' as const
  }
};
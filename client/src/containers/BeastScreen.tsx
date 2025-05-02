import { useLottie } from 'lottie-react';
import { BEAST_SPECIAL_NAME_LEVEL_UNLOCK } from '@/constants/beast';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { Beast } from '@/types/game';
import { getBeast, getBeastImage, getTierGlowColor, getTypeStrength, getTypeWeakness } from '@/utils/beast';
import { calculateAttackDamage, flee_percentage, simulateBattle, simulateFlee } from '@/utils/game';
import { Box, Button, Checkbox, LinearProgress, Tooltip, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import strikeAnim from "@/assets/animations/strike.json";
import AnimatedText from '@/components/AnimatedText';

const attackMessage = "Attacking";
const fleeMessage = "Attempting to flee";

export default function BeastScreen() {
  const { attack, flee } = useSystemCalls();
  const { gameId, adventurer, beastSeed, setKeepScreen, battleLog, setBattleLog } = useGameStore();

  const [untilDeath, setUntilDeath] = useState(true);
  const [attackInProgress, setAttackInProgress] = useState(false);
  const [fleeInProgress, setFleeInProgress] = useState(false);

  const [beast] = useState<Beast>(
    getBeast(BigInt(beastSeed ?? 0), adventurer!.xp, adventurer!.equipment.weapon)
  );
  const [combatLog, setCombatLog] = useState("");
  const [health, setHealth] = useState(adventurer!.health);
  const [beastHealth, setBeastHealth] = useState(adventurer!.beast_health);

  const strike = useLottie({
    animationData: strikeAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', width: '60%', height: '60%', top: '20%', right: '20%' },
    onComplete: () => {
      strike.stop();
      setBeastHealth(prev => Math.max(0, prev - battleLog![0].damage!));
      setTimeout(() => {
        setBattleLog(battleLog!.slice(1));
      }, 500);
    }
  });

  const beastStrike = useLottie({
    animationData: strikeAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', width: '60%', height: '60%', top: '30%', right: '20%' },
    onComplete: () => {
      beastStrike.stop();
      setHealth(prev => Math.max(0, prev - battleLog![0].damage!));
      setTimeout(() => {
        setBattleLog(battleLog!.slice(1));
      }, 500);
    }
  });

  useEffect(() => {
    if (adventurer?.xp === 0) {
      setCombatLog(beast.name + " ambushed you for 10 damage!");
    }
  }, []);

  useEffect(() => {
    if (battleLog.length > 0) {
      let event = battleLog[0];

      if (event.type === "attack") {
        strike.play();
        setCombatLog(`You attacked ${beast.name} for ${event.damage} damage ${event.critical ? 'CRITICAL HIT!' : ''}`);
      } else if (event.type === "beast_attack") {
        beastStrike.play();
        setCombatLog(`${beast.name} attacked your ${event.location} for ${event.damage} damage ${event.critical ? 'CRITICAL HIT!' : ''}`);
      } else if (event.type === "flee") {
        if (event.success) {
          setCombatLog(`You successfully fled`);
        } else {
          setCombatLog(`You failed to flee`);
        }
      }
    } else {
      setAttackInProgress(false);
      setFleeInProgress(false);
      setKeepScreen(false);
    }
  }, [battleLog]);

  // Calculate probabilities only if both combatants are alive
  const { killChance, fleeChance } = useMemo(() => {
    if (adventurer!.health === 0 || adventurer!.beast_health === 0) {
      return { killChance: 0, fleeChance: 0 };
    }
    return {
      killChance: simulateBattle(adventurer!, beast, 1000),
      fleeChance: simulateFlee(adventurer!, beast, 1000)
    };
  }, [adventurer, beast]);
  let fleePercentage = flee_percentage(adventurer!.xp, adventurer!.stats.dexterity);

  const handleAttack = () => {
    setKeepScreen(true);
    setAttackInProgress(true);
    setCombatLog(attackMessage);
    attack(gameId!, untilDeath);
  };

  const handleFlee = () => {
    setKeepScreen(true);
    setFleeInProgress(true);
    setCombatLog(fleeMessage);
    flee(gameId!, untilDeath);
  };

  const beastName = Number(beast.level) >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK && (beast.specialPrefix || beast.specialSuffix)
    ? `"${[beast.specialPrefix, beast.specialSuffix].filter(Boolean).join(' ')}" ${beast.name}`
    : beast.name;

  const beastPower = Number(beast.level) * (6 - Number(beast.tier));
  const maxHealth = 100 + (adventurer!.stats.vitality * 15);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.battleContainer}>
        {/* Top Section - Beast */}
        <Box sx={styles.topSection}>
          <Box sx={styles.beastInfo}>
            <Box sx={styles.beastHeader}>
              <Typography
                variant={beastName.length > 30 ? "h5" : "h4"}
                sx={styles.beastName}
              >
                {beastName}
              </Typography>
              <Box sx={styles.beastType}>
                <Box sx={styles.statBox}>
                  <Typography sx={styles.statLabel}>Type</Typography>
                  <Tooltip
                    title={
                      <Box>
                        <Typography>
                          Strong against {getTypeStrength(beast.type).toLowerCase()} armor
                        </Typography>
                        <Typography>
                          Weak against {getTypeWeakness(beast.type).toLowerCase()} weapons
                        </Typography>
                      </Box>
                    }
                  >
                    <Typography sx={styles.statValue}>{beast.type}</Typography>
                  </Tooltip>
                </Box>
                <Box sx={styles.statBox}>
                  <Typography sx={styles.statLabel}>Power</Typography>
                  <Typography sx={styles.statValue}>{beastPower}</Typography>
                </Box>
                <Box sx={styles.levelBox}>
                  <Typography sx={styles.levelLabel}>Level</Typography>
                  <Typography sx={styles.levelValue}>{beast.level}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={styles.healthContainer} mt={2} mb={1}>
              <Box sx={styles.healthRow}>
                <Typography sx={styles.healthLabel}>Health</Typography>
                <Typography sx={styles.healthValue}>
                  {beastHealth}/{beast.health}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(beastHealth / beast.health) * 100}
                sx={styles.healthBar}
              />
            </Box>
          </Box>
          <Box sx={styles.beastImageContainer}>
            <img
              src={getBeastImage(beast.name)}
              alt={beast.name}
              style={{
                ...styles.beastImage,
                filter: `drop-shadow(0 0 10px ${getTierGlowColor(beast.tier)})`
              }}
            />
            {strike.View}
          </Box>
        </Box>

        {/* Middle Section - Combat Log */}
        <Box sx={styles.middleSection}>
          <Box sx={styles.combatLogContainer}>
            <AnimatedText text={combatLog} />
            {(combatLog === fleeMessage || combatLog === attackMessage) && <div className='dotLoader green' style={{ marginTop: '6px' }} />}
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
            {beastStrike.View}
          </Box>

          <Box sx={styles.adventurerInfo}>
            <Box sx={styles.adventurerHeader}>
              <Box sx={styles.healthContainer}>
                <Box sx={styles.statsRow}>
                </Box>
                <Box sx={styles.healthRow}>
                  <Typography sx={styles.healthLabel}>Health</Typography>
                  <Typography sx={styles.healthValue}>
                    {health}/{maxHealth}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(health / maxHealth) * 100}
                  sx={styles.healthBar}
                />
              </Box>
            </Box>
            <Box sx={styles.actionsContainer}>
              <Box sx={styles.actionButtonContainer}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAttack}
                  sx={styles.attackButton}
                  disabled={attackInProgress || fleeInProgress}
                >
                  ATTACK
                </Button>
                <Typography sx={styles.probabilityText}>
                  {untilDeath ? `${killChance}% chance` : `${calculateAttackDamage(adventurer!, beast, 0)} damage`}
                </Typography>
              </Box>
              <Box sx={styles.actionButtonContainer}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleFlee}
                  sx={styles.fleeButton}
                  disabled={adventurer!.stats.dexterity === 0 || fleeInProgress || attackInProgress}
                >
                  FLEE
                </Button>
                <Typography sx={styles.probabilityText}>
                  {adventurer!.stats.dexterity === 0 ? 'No Dexterity' : untilDeath ? `${fleeChance}% chance` : `${fleePercentage}% chance`}
                </Typography>
              </Box>
              <Box sx={styles.deathCheckboxContainer} onClick={() => setUntilDeath(!untilDeath)}>
                <Typography sx={styles.deathCheckboxLabel}>
                  until<br />death
                </Typography>
                <Checkbox
                  checked={untilDeath}
                  onChange={(e) => setUntilDeath(e.target.checked)}
                  size="small"
                  sx={styles.deathCheckbox}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box >
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  battleContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '0 !important',
    pt: '4px !important',
  },
  probabilityContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: 3,
    borderRadius: '10px',
    mb: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    py: 1
  },
  probabilityBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    background: 'rgba(128, 255, 0, 0.1)',
    borderRadius: '6px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
  },
  probabilityLabel: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.85rem',
    fontFamily: 'VT323, monospace',
  },
  probabilityValue: {
    color: '#80FF00',
    fontSize: '0.85rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
  },
  topSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '12px 16px',
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '10px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
    gap: 2
  },
  beastInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
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
    gap: '8px',
    marginTop: '8px',
  },
  levelBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: '2px 6px',
    background: 'rgba(237, 207, 51, 0.1)',
    borderRadius: '4px',
    border: '1px solid rgba(237, 207, 51, 0.2)',
    minWidth: '50px',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: '2px 6px',
    background: 'rgba(128, 255, 0, 0.1)',
    borderRadius: '4px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
    minWidth: '50px',
  },
  levelLabel: {
    color: 'rgba(237, 207, 51, 0.7)',
    fontSize: '0.7rem',
    fontFamily: 'VT323, monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: '1',
  },
  statLabel: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.7rem',
    fontFamily: 'VT323, monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: '1',
  },
  statValue: {
    color: '#80FF00',
    fontSize: '0.8rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    lineHeight: '1',
  },
  levelValue: {
    color: '#EDCF33',
    fontSize: '0.8rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    lineHeight: '1',
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
    width: '160px',
    height: '160px',
    maxWidth: '35vw',
    maxHeight: '35vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  beastImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
  },
  middleSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 20px',
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '10px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
    my: '10px'
  },
  combatLogContainer: {
    width: '100%',
    minHeight: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    display: 'flex',
    gap: 1,
    width: '100%',
    mb: '2px'
  },
  actionButtonContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    width: '100%',
  },
  attackButton: {
    width: '100%',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #80FF00 30%, #9dff33 90%)',
    borderRadius: '12px',
    color: '#111111',
  },
  fleeButton: {
    width: '100%',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #EDCF33 30%, #f5e066 90%)',
    borderRadius: '12px',
    color: '#111111',
  },
  deathCheckboxContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1px',
    minWidth: '32px',
    cursor: 'pointer',
  },
  deathCheckboxLabel: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.75rem',
    fontFamily: 'VT323, monospace',
    lineHeight: '0.9',
    textAlign: 'center',
  },
  deathCheckbox: {
    color: 'rgba(128, 255, 0, 0.7)',
    padding: '0',
    '&.Mui-checked': {
      color: '#80FF00',
    },
  },
  bottomSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '12px 16px',
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '10px',
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
    display: 'flex',
    justifyContent: 'center',
    padding: '4px 8px',
    background: 'rgba(237, 207, 51, 0.1)',
    borderRadius: '6px',
    border: '1px solid rgba(237, 207, 51, 0.2)',
    marginTop: '8px',
  },
  rewardText: {
    color: '#EDCF33',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
  },
  adventurerImageContainer: {
    width: '110px',
    height: '110px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
  healthRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4px',
  },
  healthLabel: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.875rem',
    lineHeight: '1',
    fontFamily: 'VT323, monospace',
  },
  probabilityText: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.85rem',
    fontFamily: 'VT323, monospace',
    textAlign: 'center',
  },
  beastPower: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px',
    background: 'rgba(128, 255, 0, 0.1)',
    borderRadius: '6px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
  },
};
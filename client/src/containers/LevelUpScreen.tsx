import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { Stats, ItemPurchase } from '@/types/game';
import { generateMarketItems, MarketItem } from '@/utils/market';
import { Box, Button, Typography, Stack, Paper, TextField } from '@mui/material';
import { useState } from 'react';

export default function LevelUpScreen() {
  const { gameId, adventurer, marketSeed } = useGameStore();
  const { levelUp } = useSystemCalls();

  const [selectedStats, setSelectedStats] = useState<Stats>({
    strength: 0,
    dexterity: 0,
    vitality: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    luck: 0
  });

  const [itemPurchases, setItemPurchases] = useState<ItemPurchase[]>([]);
  const [potions, setPotions] = useState<number>(0);

  const [market] = useState<MarketItem[]>(
    generateMarketItems(BigInt(marketSeed!), Math.max(1, adventurer!.stat_upgrades_available))
  );

  const handleStatIncrement = (stat: keyof Stats) => {
    if (adventurer!.stat_upgrades_available > 0) {
      setSelectedStats(prev => ({
        ...prev,
        [stat]: prev[stat] + 1
      }));
    }
  };

  const handleItemPurchase = (item: MarketItem) => {
    setItemPurchases(prev => [...prev, { item_id: item.id, equip: false }]);
  };

  const handleLevelUp = async () => {
    levelUp(gameId!, potions, selectedStats, itemPurchases);
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" sx={styles.title}>
        Level Up
      </Typography>

      <Paper sx={styles.section}>
        <Typography variant="h6" sx={styles.sectionTitle}>
          Stat Upgrades Available: {adventurer!.stat_upgrades_available}
        </Typography>
        <Stack spacing={1}>
          {Object.entries(selectedStats).map(([stat, value]) => (
            <Box key={stat} sx={styles.statRow}>
              <Typography>{stat.charAt(0).toUpperCase() + stat.slice(1)}: {value}</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleStatIncrement(stat as keyof Stats)}
                disabled={adventurer!.stat_upgrades_available <= 0}
              >
                +
              </Button>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Paper sx={styles.section}>
        <Typography variant="h6" sx={styles.sectionTitle}>
          Market
        </Typography>

        <Box sx={styles.potionsSection}>
          <Typography variant="subtitle1">Potions (100 gold each)</Typography>
          <Box sx={styles.potionControls}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPotions(prev => Math.max(0, prev - 1))}
            >
              -
            </Button>
            <TextField
              type="number"
              value={potions}
              onChange={(e) => setPotions(Math.max(0, parseInt(e.target.value) || 0))}
              size="small"
              sx={{ width: '60px', mx: 1 }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPotions(prev => prev + 1)}
            >
              +
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" sx={styles.sectionTitle}>
          Items
        </Typography>
        <Stack spacing={1}>
          {market.map(item => (
            <Box key={item.id} sx={styles.marketItem}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tier: {item.tier} | Price: {item.price}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleItemPurchase(item)}
              >
                Buy
              </Button>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleLevelUp}
        sx={styles.levelUpButton}
      >
        Level Up
      </Button>
    </Box>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    maxHeight: 'calc(100vh - 50px)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    padding: '16px',
    margin: '0 auto',
    gap: 2,
    overflowY: 'auto'
  },
  title: {
    textAlign: 'center',
    marginBottom: 2
  },
  section: {
    minWidth: '400px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  sectionTitle: {
    marginBottom: 1
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px'
  },
  marketItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    borderBottom: '1px solid rgba(0,0,0,0.1)'
  },
  potionsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    padding: '8px',
    borderBottom: '1px solid rgba(0,0,0,0.1)'
  },
  potionControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  levelUpButton: {
    marginTop: 2,
    minWidth: '200px'
  }
};
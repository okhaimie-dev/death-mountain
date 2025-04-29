import { Box, Typography } from '@mui/material';
import { Item } from '@/types/game';
import { calculateLevel } from '@/utils/game';
import { ItemUtils } from '@/utils/loot';
import { SUFFIX_UNLOCK_GREATNESS, PREFIXES_UNLOCK_GREATNESS } from '@/constants/loot';

interface ItemTooltipProps {
  item: Item;
  style?: React.CSSProperties;
}

export default function ItemTooltip({ item, style }: ItemTooltipProps) {
  const level = calculateLevel(item.xp);
  const tier = ItemUtils.getItemTier(item.id);
  const type = ItemUtils.getItemType(item.id);
  const metadata = ItemUtils.getMetadata(item.id);

  // Check if item has unlocked special names
  const hasUnlockedSuffix = level >= SUFFIX_UNLOCK_GREATNESS;
  const hasUnlockedPrefix = level >= PREFIXES_UNLOCK_GREATNESS;

  return (
    <Box sx={{ ...styles.tooltip, ...style }}>
      <Typography variant="body2" sx={styles.itemName}>
        {metadata.name}
      </Typography>
      <Box sx={styles.statsContainer}>
        <Typography variant="caption" sx={styles.stat}>
          Level: {level}
        </Typography>
        <Typography variant="caption" sx={styles.stat}>
          Tier: {tier}
        </Typography>
        <Typography variant="caption" sx={styles.stat}>
          Type: {type}
        </Typography>
      </Box>
      {hasUnlockedSuffix && (
        <Typography variant="caption" sx={styles.special}>
          Unlocked Suffix Names
        </Typography>
      )}
      {hasUnlockedPrefix && (
        <Typography variant="caption" sx={styles.special}>
          Unlocked Prefix Names
        </Typography>
      )}
    </Box>
  );
}

const styles = {
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(17, 17, 17, 0.95)',
    border: '1px solid rgba(128, 255, 0, 0.3)',
    borderRadius: '4px',
    padding: '8px',
    zIndex: 1000,
    minWidth: '150px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  itemName: {
    color: '#80FF00',
    fontFamily: 'VT323, monospace',
    fontSize: '1rem',
    marginBottom: '4px',
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  stat: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontFamily: 'VT323, monospace',
    fontSize: '0.8rem',
  },
  special: {
    color: '#EDCF33',
    fontFamily: 'VT323, monospace',
    fontSize: '0.8rem',
    marginTop: '4px',
    fontStyle: 'italic',
  },
}; 
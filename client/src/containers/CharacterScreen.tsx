import AdventurerInfo from '@/components/AdventurerInfo';
import ItemTooltip from '@/components/ItemTooltip';
import { useGameStore } from '@/stores/gameStore';
import { Item } from '@/types/game';
import { ItemUtils } from '@/utils/loot';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function CharacterScreen() {
  const { adventurer, bag } = useGameStore();
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [equippedItems, setEquippedItems] = useState<Record<string, Item> | null>(null);
  const [bagItems, setBagItems] = useState<Item[] | null>([]);

  useEffect(() => {
    setEquippedItems(adventurer!.equipment);
    setBagItems(bag);
  }, [adventurer, bag]);

  // Define fixed order for equipment slots
  const equipmentOrder = ['Head', 'Chest', 'Hand', 'Waist', 'Foot', 'Weapon', 'Ring', 'Neck'] as const;

  const handleItemHover = (item: Item, event: React.MouseEvent) => {
    setHoveredItem(item);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.characterContainer}>
        {/* Character Info Section */}
        <Box sx={styles.characterInfo}>
          <AdventurerInfo />

          {/* Stats Grid */}
          <Box sx={styles.statsGrid}>
            <Box sx={styles.statCard}>
              <Typography sx={styles.statLabel}>STR</Typography>
              <Typography sx={styles.statValue}>{adventurer?.stats?.strength || 0}</Typography>
            </Box>
            <Box sx={styles.statCard}>
              <Typography sx={styles.statLabel}>DEX</Typography>
              <Typography sx={styles.statValue}>{adventurer?.stats?.dexterity || 0}</Typography>
            </Box>
            <Box sx={styles.statCard}>
              <Typography sx={styles.statLabel}>VIT</Typography>
              <Typography sx={styles.statValue}>{adventurer?.stats?.vitality || 0}</Typography>
            </Box>
            <Box sx={styles.statCard}>
              <Typography sx={styles.statLabel}>INT</Typography>
              <Typography sx={styles.statValue}>{adventurer?.stats?.intelligence || 0}</Typography>
            </Box>
            <Box sx={styles.statCard}>
              <Typography sx={styles.statLabel}>WIS</Typography>
              <Typography sx={styles.statValue}>{adventurer?.stats?.wisdom || 0}</Typography>
            </Box>
            <Box sx={styles.statCard}>
              <Typography sx={styles.statLabel}>CHA</Typography>
              <Typography sx={styles.statValue}>{adventurer?.stats?.charisma || 0}</Typography>
            </Box>
            <Box sx={styles.statCard}>
              <Typography sx={styles.statLabel}>LUCK</Typography>
              <Typography sx={styles.statValue}>{adventurer?.stats?.luck || 0}</Typography>
            </Box>
          </Box>

          {/* Equipment Section */}
          <Box sx={styles.section}>
            <Box sx={styles.sectionHeader}>
              <Typography variant="h6" sx={styles.sectionTitle}>Equipment ({equippedItems ? Object.values(equippedItems).filter(item => item.id !== 0).length : 0}/8)</Typography>
            </Box>

            <Box sx={styles.itemGrid}>
              {equippedItems && equipmentOrder.map((slot) => {
                const item = equippedItems[slot.toLowerCase() as keyof typeof equippedItems];
                const metadata = ItemUtils.getMetadata(item.id);

                return (
                  <Box
                    key={slot}
                    sx={styles.item}
                    onMouseEnter={(e) => item.id && handleItemHover(item, e)}
                    onMouseLeave={handleItemLeave}
                  >
                    {item.id ? (
                      <>
                        <img
                          src={metadata.imageUrl}
                          alt={metadata.name}
                          style={styles.itemImage}
                        />
                        <Typography variant="body2" sx={styles.itemName}>
                          {slot}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <img src="/src/assets/images/empty_slot.png" alt={`Empty ${slot}`} style={{ ...styles.itemImage, opacity: 0.5 }} />
                        <Typography variant="body2" sx={styles.itemName}>{slot}</Typography>
                      </>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Bag Section */}
          <Box sx={styles.section}>
            <Box sx={styles.sectionHeader}>
              <Typography variant="h6" sx={styles.sectionTitle}>Bag ({bagItems?.length || 0}/15)</Typography>
            </Box>
            <Box sx={styles.itemGrid}>
              {bagItems?.map((item) => {
                const itemDetails = ItemUtils.getMetadata(item.id);
                return (
                  <Box
                    key={item.id}
                    sx={styles.item}
                    onMouseEnter={(e) => handleItemHover(item, e)}
                    onMouseLeave={handleItemLeave}
                  >
                    <img
                      src={itemDetails.imageUrl}
                      alt={itemDetails.name}
                      style={styles.itemImage}
                    />
                    <Typography variant="body2" sx={styles.itemName}>
                      {itemDetails.name}
                    </Typography>
                  </Box>
                );
              })}
              {Array(15 - (bagItems?.length || 0)).fill(null).map((_, index) => (
                <Box key={`empty-${index}`} sx={[styles.item, { opacity: 0.5 }]}>
                  <img src="/src/assets/images/empty_slot.png" alt="Empty slot" style={styles.itemImage} />
                  <Typography variant="body2" sx={styles.itemName}>Empty</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      {hoveredItem && (
        <ItemTooltip
          item={hoveredItem}
          style={{
            position: 'fixed',
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10
          }}
        />
      )}
    </Box>
  );
}

const styles = {
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(17, 17, 17, 1)',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
    zIndex: 900,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  characterContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    boxSizing: 'border-box',
    width: '100%',
    mb: '75px'
  },
  characterInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  characterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterName: {
    color: '#80FF00',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(128, 255, 0, 0.3)',
  },
  levelContainer: {
    background: 'rgba(237, 207, 51, 0.1)',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid rgba(237, 207, 51, 0.2)',
  },
  levelText: {
    color: '#EDCF33',
    fontFamily: 'VT323, monospace',
  },
  statsContainer: {
    display: 'flex',
    gap: 2,
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
  statValue: {
    color: '#80FF00',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    lineHeight: 1,
  },
  healthBar: {
    height: '6px',
    borderRadius: '3px',
    backgroundColor: 'rgba(128, 255, 0, 0.1)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#80FF00',
    },
  },
  xpBar: {
    height: '6px',
    borderRadius: '3px',
    backgroundColor: 'rgba(237, 207, 51, 0.1)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#EDCF33',
    },
  },
  xpInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  xpToNext: {
    color: 'rgba(237, 207, 51, 0.7)',
    fontSize: '0.8rem',
    fontFamily: 'VT323, monospace',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '4px',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(128, 255, 0, 0.1)',
    borderRadius: '4px',
    py: '4px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
  },
  section: {
    marginBottom: '4px',
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
  itemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '6px',
  },
  equipmentSlot: {
    aspectRatio: '1',
    background: 'rgba(128, 255, 0, 0.05)',
    borderRadius: '4px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2px',
  },
  equippedItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    width: '100%',
    height: '100%',
  },
  itemImage: {
    width: '30px',
    height: '30px',
    objectFit: 'contain' as const,
  },
  itemName: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.85rem',
    fontFamily: 'VT323, monospace',
    textAlign: 'center',
    lineHeight: 1,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px',
    background: 'rgba(128, 255, 0, 0.1)',
    borderRadius: '6px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
  },
  bagGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '4px',
  },
  goldContainer: {
    background: 'rgba(237, 207, 51, 0.1)',
    padding: '0 8px',
    borderRadius: '6px',
    border: '1px solid rgba(237, 207, 51, 0.2)',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  goldValue: {
    color: '#EDCF33',
    fontSize: '0.85rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    lineHeight: '24px',
  },
  headerStats: {
    display: 'flex',
    gap: '8px',
  },
};

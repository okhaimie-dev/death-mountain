import emptySlot from '@/assets/images/empty_slot.png';
import AdventurerInfo from '@/components/AdventurerInfo';
import ItemTooltip from '@/components/ItemTooltip';
import { useGameStore } from '@/stores/gameStore';
import { Item } from '@/types/game';
import { calculateLevel } from '@/utils/game';
import { ItemUtils, typeIcons } from '@/utils/loot';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { memo, useEffect, useState, useCallback } from 'react';
import { isMobile } from 'react-device-detect';

type EquipmentSlot = 'weapon' | 'chest' | 'head' | 'waist' | 'foot' | 'hand' | 'neck' | 'ring';

// Memoized ItemSlot component
const ItemSlot = memo(({
  item,
  itemSpecialsSeed,
  slot,
  isSelected,
  isNew,
  onItemClick,
  onItemHover
}: {
  item: Item | null,
  itemSpecialsSeed: number,
  slot: string,
  isSelected: boolean,
  isNew: boolean,
  onItemClick: (item: Item) => void,
  onItemHover: (id: number) => void
}) => {
  const metadata = item ? ItemUtils.getMetadata(item.id) : null;
  const tier = item ? ItemUtils.getItemTier(item.id) : null;
  const level = item ? calculateLevel(item.xp) : null;

  return (
    <Tooltip
      title={item?.id ? <ItemTooltip itemSpecialsSeed={itemSpecialsSeed} item={item} /> : null}
      placement="bottom"
      slotProps={{
        popper: {
          disablePortal: isMobile,
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
      <Box
        sx={[styles.item, isSelected && styles.selectedItem, isNew && styles.newItem]}
        onClick={() => item?.id && onItemClick(item)}
        onMouseEnter={() => item?.id && onItemHover(item.id)}
      >
        {item?.id && metadata ? (
          <>
            <Box sx={styles.itemLevelBadge}>
              <Typography sx={styles.itemLevelText}>{level}</Typography>
            </Box>
            <Box sx={styles.itemTierBadge}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  backgroundColor: tier ? ItemUtils.getTierColor(tier) : 'white',
                  WebkitMaskImage: `url(${typeIcons[ItemUtils.getItemType(item.id) as keyof typeof typeIcons]})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: `url(${typeIcons[ItemUtils.getItemType(item.id) as keyof typeof typeIcons]})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  opacity: 0.9,
                }}
              />
            </Box>
            <Box sx={styles.itemImageContainer}>
              <img
                src={metadata.imageUrl}
                alt={metadata.name}
                style={styles.itemImage}
              />
            </Box>
            <Box sx={styles.itemTypeContainer}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Typography sx={styles.itemTypeText}>{ItemUtils.getItemSlot(item.id)}</Typography>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={styles.itemImageContainer}>
            <img src={emptySlot} alt={`Empty ${slot}`} style={{ ...styles.itemImage, opacity: 0.5 }} />
            <Typography variant="body2" sx={styles.itemName}>{slot.charAt(0).toUpperCase() + slot.slice(1)}</Typography>
          </Box>
        )}
      </Box>
    </Tooltip>
  );
});

export default function CharacterScreen() {
  const { adventurer, bag, newInventoryItems, setNewInventoryItems, equipItem } = useGameStore();
  const [isDropMode, setIsDropMode] = useState(false);
  const [itemsToDrop, setItemsToDrop] = useState<Set<number>>(new Set());
  const [newItems, setNewItems] = useState<number[]>([]);

  // Update newItems when newInventoryItems changes and clear newInventoryItems
  useEffect(() => {
    if (newInventoryItems.length > 0) {
      setNewItems([...newInventoryItems]);
      setNewInventoryItems([]);
    }
  }, [newInventoryItems]);

  const handleItemHover = useCallback((itemId: number) => {
    if (newItems.includes(itemId)) {
      setNewItems(prev => prev.filter(id => id !== itemId));
    }
  }, [newItems]);

  // Define fixed order for equipment slots
  const equipmentOrder: EquipmentSlot[] = ['head', 'chest', 'hand', 'waist', 'foot', 'weapon', 'ring', 'neck'];

  const handleItemClick = useCallback((item: Item, bag: boolean = false) => {
    if (isDropMode) {
      const newItemsToDrop = new Set(itemsToDrop);
      if (newItemsToDrop.has(item.id)) {
        newItemsToDrop.delete(item.id);
      } else {
        newItemsToDrop.add(item.id);
      }
      setItemsToDrop(newItemsToDrop);
    } else if (bag) {
      equipItem(item);
    }
  }, [isDropMode, itemsToDrop, equipItem]);

  const handleConfirmDrop = useCallback(() => {
    // TODO: Implement drop items logic
    setIsDropMode(false);
    setItemsToDrop(new Set());
  }, []);

  const handleCancelDrop = useCallback(() => {
    setIsDropMode(false);
    setItemsToDrop(new Set());
  }, []);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.characterContainer}>
        {/* Character Info Section */}
        <Box sx={styles.characterInfo}>
          <AdventurerInfo />

          {/* Equipment Section */}
          <Box sx={styles.section}>
            <Box sx={styles.sectionHeader}>
              <Typography variant="h6" sx={styles.sectionTitle}>Equipment ({Object.values(adventurer?.equipment || {}).filter(item => item.id !== 0).length || 0}/8)</Typography>
            </Box>

            <Box sx={styles.itemGrid}>
              {equipmentOrder.map((slot) => {
                const item = adventurer?.equipment[slot];
                const isSelected = item?.id ? itemsToDrop.has(item.id) : false;
                const isNew = item?.id ? newItems.includes(item.id) : false;

                return (
                  <ItemSlot
                    key={slot}
                    itemSpecialsSeed={adventurer?.item_specials_seed || 0}
                    item={item || null}
                    slot={slot}
                    isSelected={isSelected}
                    isNew={isNew}
                    onItemClick={handleItemClick}
                    onItemHover={handleItemHover}
                  />
                );
              })}
            </Box>
          </Box>

          {/* Bag Section */}
          <Box sx={styles.section}>
            <Box sx={styles.sectionHeader}>
              <Typography variant="h6" sx={styles.sectionTitle}>Bag ({bag?.length || 0}/15)</Typography>
            </Box>
            <Box sx={styles.itemGrid}>
              {bag?.map((item) => {
                const isSelected = itemsToDrop.has(item.id);
                const isNew = newItems.includes(item.id);

                return (
                  <ItemSlot
                    key={item.id}
                    item={item}
                    itemSpecialsSeed={adventurer?.item_specials_seed || 0}
                    slot="bag"
                    isSelected={isSelected}
                    isNew={isNew}
                    onItemClick={(item) => handleItemClick(item, true)}
                    onItemHover={handleItemHover}
                  />
                );
              })}
              {Array(15 - (bag?.length || 0)).fill(null).map((_, index) => (
                <Box key={`empty-${index}`} sx={[styles.item, { opacity: 0.5 }]}>
                  <Box sx={styles.itemImageContainer}>
                    <img src={emptySlot} alt="Empty slot" style={styles.itemImage} />
                    <Typography variant="body2" sx={styles.itemName}>Empty</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Drop Mode Controls */}
          {!isDropMode ? (
            <Button
              variant="contained"
              onClick={() => setIsDropMode(true)}
              sx={styles.dropButton}
            >
              Drop Items
            </Button>
          ) : (
            <Box sx={styles.dropControls}>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelDrop}
                sx={styles.dropControlButton}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmDrop}
                sx={styles.dropControlButton}
              >
                Confirm
              </Button>
            </Box>
          )}
        </Box>
      </Box>
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
    width: '40px',
    height: '40px',
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
    py: 0.5,
    background: 'rgba(128, 255, 0, 0.1)',
    borderRadius: '6px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
    position: 'relative',
    cursor: 'pointer',
    minHeight: '55px',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(128, 255, 0, 0.15)',
    },
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
  itemImageContainer: {
    position: 'relative',
  },
  itemTierBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '2px',
    borderRadius: '4px',
  },
  itemTierText: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '0.7rem',
    fontFamily: 'VT323, monospace',
  },
  itemLevelBadge: {
    position: 'absolute',
    top: 0,
    left: 5,
    zIndex: 1,
  },
  itemLevelText: {
    color: '#EDCF33',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  itemTypeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    borderRadius: '0 0 6px 6px',
    background: 'rgba(0, 0, 0, 0.5)',
  },
  itemTypeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.8rem',
    fontFamily: 'VT323, monospace',
  },
  dropButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    border: '1px solid rgba(255, 0, 0, 0.3)',
    color: '#FF0000',
    '&:hover': {
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
    },
  },
  dropControls: {
    display: 'flex',
    gap: 1,
  },
  dropControlButton: {
    flex: 1,
  },
  selectedItem: {
    border: '2px solid #FF0000',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
  },
  newItem: {
    border: '2px solid #80FF00',
    backgroundColor: 'rgba(128, 255, 0, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(128, 255, 0, 0.15)',
      '& .newItemBadge': {
        display: 'none',
      },
    },
  },
  newItemBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(128, 255, 0, 0.9)',
    padding: '2px 6px',
    borderRadius: '4px',
    zIndex: 2,
  },
  newItemText: {
    color: '#000',
    fontSize: '0.8rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
};

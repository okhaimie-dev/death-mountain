import AdventurerInfo from '@/components/AdventurerInfo';
import ItemTooltip from '@/components/ItemTooltip';
import { useGameStore } from '@/stores/gameStore';
import { Item } from '@/types/game';
import { ItemUtils } from '@/utils/loot';
import { calculateLevel } from '@/utils/game';
import { Box, Typography, Tooltip, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import chestIcon from '@/assets/types/chest.svg';
import clothIcon from '@/assets/types/cloth.svg';
import footIcon from '@/assets/types/foot.svg';
import handIcon from '@/assets/types/hand.svg';
import headIcon from '@/assets/types/head.svg';
import hideIcon from '@/assets/types/hide.svg';
import metalIcon from '@/assets/types/metal.svg';
import neckIcon from '@/assets/types/neck.svg';
import ringIcon from '@/assets/types/ring.svg';
import waistIcon from '@/assets/types/waist.svg';
import weaponIcon from '@/assets/types/weapon.svg';

type EquipmentSlot = 'weapon' | 'chest' | 'head' | 'waist' | 'foot' | 'hand' | 'neck' | 'ring';

const typeIcons = {
  Cloth: clothIcon,
  Hide: hideIcon,
  Metal: metalIcon,
  Magic: weaponIcon,
  Bludgeon: weaponIcon,
  Blade: weaponIcon,
  Ring: ringIcon,
  Necklace: neckIcon,
};

export default function CharacterScreen() {
  const equipItem = useGameStore(state => state.equipItem);
  const adventurer = useGameStore(state => state.adventurer);
  const bag = useGameStore(state => state.bag);
  const [isDropMode, setIsDropMode] = useState(false);
  const [itemsToDrop, setItemsToDrop] = useState<Set<number>>(new Set());

  // Define fixed order for equipment slots
  const equipmentOrder: EquipmentSlot[] = ['head', 'chest', 'hand', 'waist', 'foot', 'weapon', 'ring', 'neck'];

  const handleItemClick = (item: Item, bag: boolean = false) => {
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
  };

  const handleConfirmDrop = () => {
    // TODO: Implement drop items logic
    setIsDropMode(false);
    setItemsToDrop(new Set());
  };

  const handleCancelDrop = () => {
    setIsDropMode(false);
    setItemsToDrop(new Set());
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
              <Typography variant="h6" sx={styles.sectionTitle}>Equipment ({Object.values(adventurer?.equipment || {}).filter(item => item.id !== 0).length || 0}/8)</Typography>
            </Box>

            <Box sx={styles.itemGrid}>
              {equipmentOrder.map((slot) => {
                const item = adventurer?.equipment[slot];
                const metadata = item ? ItemUtils.getMetadata(item.id) : null;
                const tier = item ? ItemUtils.getItemTier(item.id) : null;
                const level = item ? calculateLevel(item.xp) : null;
                const isSelected = item?.id ? itemsToDrop.has(item.id) : false;

                return (
                  <Tooltip
                    key={slot}
                    title={item?.id ? <ItemTooltip item={item} /> : null}
                    placement="top"
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'transparent',
                          border: 'none',
                        },
                      },
                    }}
                  >
                    <Box sx={[styles.item, isSelected && styles.selectedItem]}
                      onClick={() => item?.id && handleItemClick(item)}
                    >
                      {item?.id && metadata ? (
                        <>
                          <Box sx={styles.itemLevelBadge}>
                            <Typography sx={styles.itemLevelText}>{level}</Typography>
                          </Box>
                          <Box sx={styles.itemTierBadge} style={{ backgroundColor: tier ? ItemUtils.getTierColor(tier) : 'transparent' }}>
                            <Typography sx={styles.itemTierText}>{tier ? `T${tier}` : ''}</Typography>
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
                              {ItemUtils.getItemType(item.id) in typeIcons && (
                                <Box
                                  component="img"
                                  src={typeIcons[ItemUtils.getItemType(item.id) as keyof typeof typeIcons]}
                                  alt={ItemUtils.getItemType(item.id)}
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    filter: 'invert(1)',
                                    opacity: 0.9,
                                  }}
                                />
                              )}
                              <Typography sx={styles.itemTypeText}>{ItemUtils.getItemType(item.id)}</Typography>
                            </Box>
                          </Box>
                        </>
                      ) : (
                        <Box sx={styles.itemImageContainer}>
                          <img src="/src/assets/images/empty_slot.png" alt={`Empty ${slot}`} style={{ ...styles.itemImage, opacity: 0.5 }} />
                          <Typography variant="body2" sx={styles.itemName}>{slot.charAt(0).toUpperCase() + slot.slice(1)}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Tooltip>
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
                const itemDetails = ItemUtils.getMetadata(item.id);
                const tier = ItemUtils.getItemTier(item.id);
                const level = calculateLevel(item.xp);
                const isSelected = itemsToDrop.has(item.id);

                return (
                  <Tooltip
                    key={item.id}
                    title={<ItemTooltip item={item} />}
                    placement="top"
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'transparent',
                          border: 'none',
                        },
                      },
                    }}
                  >
                    <Box sx={[styles.item, isSelected && styles.selectedItem]}
                      onClick={() => handleItemClick(item, true)}
                    >
                      <Box sx={styles.itemLevelBadge}>
                        <Typography sx={styles.itemLevelText}>{level}</Typography>
                      </Box>
                      <Box sx={styles.itemTierBadge} style={{ backgroundColor: ItemUtils.getTierColor(tier) }}>
                        <Typography sx={styles.itemTierText}>T{tier}</Typography>
                      </Box>
                      <Box sx={styles.itemImageContainer}>
                        <img
                          src={itemDetails.imageUrl}
                          alt={itemDetails.name}
                          style={styles.itemImage}
                        />
                      </Box>
                      <Box sx={styles.itemTypeContainer}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          {ItemUtils.getItemType(item.id) in typeIcons && (
                            <Box
                              component="img"
                              src={typeIcons[ItemUtils.getItemType(item.id) as keyof typeof typeIcons]}
                              alt={ItemUtils.getItemType(item.id)}
                              sx={{
                                width: 12,
                                height: 12,
                                filter: 'invert(1)',
                                opacity: 0.9,
                              }}
                            />
                          )}
                          <Typography sx={styles.itemTypeText}>{ItemUtils.getItemType(item.id)}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Tooltip>
                );
              })}
              {Array(15 - (bag?.length || 0)).fill(null).map((_, index) => (
                <Box key={`empty-${index}`} sx={[styles.item, { opacity: 0.5 }]}>
                  <Box sx={styles.itemImageContainer}>
                    <img src="/src/assets/images/empty_slot.png" alt="Empty slot" style={styles.itemImage} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '0 2px',
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
    fontSize: '0.7rem',
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
};

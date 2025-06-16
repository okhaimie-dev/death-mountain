import AdventurerStats from '@/components/AdventurerStats';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { ItemUtils } from '../utils/loot';
import { useGameDirector } from '../contexts/GameDirector';
import ItemTooltip from '@/components/ItemTooltip';

// Import SVG assets
import chestIcon from '@/assets/types/chest.svg';
import footIcon from '@/assets/types/foot.svg';
import handIcon from '@/assets/types/hand.svg';
import headIcon from '@/assets/types/head.svg';
import neckIcon from '@/assets/types/neck.svg';
import ringIcon from '@/assets/types/ring.svg';
import waistIcon from '@/assets/types/waist.svg';
import weaponIcon from '@/assets/types/weapon.svg';

type EquipmentSlot = 'weapon' | 'chest' | 'head' | 'waist' | 'foot' | 'hand' | 'neck' | 'ring';

const equipmentSlots = [
  { key: 'head' as EquipmentSlot, label: 'Head', style: { top: '8px', left: '50%', transform: 'translate(-50%, 0)' }, icon: headIcon },
  { key: 'chest' as EquipmentSlot, label: 'Chest', style: { top: '60px', left: '50%', transform: 'translate(-50%, 0)' }, icon: chestIcon },
  { key: 'waist' as EquipmentSlot, label: 'Waist', style: { top: '112px', left: '50%', transform: 'translate(-50%, 0)' }, icon: waistIcon },
  { key: 'foot' as EquipmentSlot, label: 'Feet', style: { top: '164px', left: '50%', transform: 'translate(-50%, 0)' }, icon: footIcon },
  { key: 'hand' as EquipmentSlot, label: 'Hands', style: { top: '86px', left: '8px' }, icon: handIcon },
  { key: 'ring' as EquipmentSlot, label: 'Ring', style: { top: '86px', right: '8px' }, icon: ringIcon },
  { key: 'weapon' as EquipmentSlot, label: 'Weapon', style: { top: '140px', left: '8px' }, icon: weaponIcon },
  { key: 'neck' as EquipmentSlot, label: 'Neck', style: { top: '30px', right: '8px' }, icon: neckIcon },
];

interface InventoryOverlayProps {
  onStatsChange?: (stats: {
    strength: number;
    dexterity: number;
    vitality: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    luck: number;
  }) => void;
}

function CharacterEquipment({ isDropMode, itemsToDrop, onItemClick, newItems, onItemHover }: {
  isDropMode: boolean,
  itemsToDrop: number[],
  onItemClick: (item: any) => void,
  newItems: number[],
  onItemHover: (itemId: number) => void
}) {
  const { adventurer } = useGameStore();

  return (
    <Box sx={styles.equipmentPanel}>
      <Box sx={styles.characterPortraitWrapper}>
        <img src={'/images/adventurer.png'} alt="adventurer" style={{ ...styles.characterPortrait, objectFit: 'contain', position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%, -30%)', zIndex: 1, filter: 'drop-shadow(0 0 8px #000a)' }} />
        {equipmentSlots.map(slot => {
          const item = adventurer?.equipment[slot.key];
          const metadata = item ? ItemUtils.getMetadata(item.id) : null;
          const isSelected = item?.id ? itemsToDrop.includes(item.id) : false;
          const highlight = item?.id ? (isDropMode && itemsToDrop.length === 0) : false;
          const isNew = item?.id ? newItems.includes(item.id) : false;

          return (
            <Tooltip
              key={slot.key}
              title={item?.id ? <ItemTooltip item={item} itemSpecialsSeed={adventurer?.item_specials_seed || 0} style={styles.tooltipContainer} /> : null}
              placement="auto-end"
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
              <Box
                sx={[
                  styles.equipmentSlot,
                  isSelected && styles.selectedItem,
                  highlight && styles.highlight,
                  isNew && styles.newItem,
                  !isDropMode && styles.nonInteractive
                ]}
                style={{ ...slot.style, position: 'absolute' }}
                onClick={() => isDropMode && item?.id && onItemClick(item)}
                onMouseEnter={() => item?.id && onItemHover(item.id)}
              >
                {item?.id && metadata ? (
                  <img
                    src={metadata.imageUrl}
                    alt={metadata.name}
                    style={{ ...styles.equipmentIcon, objectFit: 'contain' }}
                  />
                ) : (
                  <Box sx={styles.emptySlot} title={slot.label}>
                    <img src={slot.icon} alt={slot.label} style={{ width: 26, height: 26, opacity: 0.5 }} />
                  </Box>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}

function InventoryBag({ isDropMode, itemsToDrop, onItemClick, onDropModeToggle, newItems, onItemHover }: {
  isDropMode: boolean,
  itemsToDrop: number[],
  onItemClick: (item: any) => void,
  onDropModeToggle: () => void,
  newItems: number[],
  onItemHover: (itemId: number) => void
}) {
  const { bag, adventurer } = useGameStore();

  return (
    <Box sx={styles.bagPanel}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="h6">Bag ({bag?.length || 0}/{15})</Typography>
        <Typography variant="h6" color="secondary">{adventurer?.gold || 0} gold</Typography>
      </Box>

      <Box sx={styles.bagGrid}>
        {bag?.map((item) => {
          const metadata = ItemUtils.getMetadata(item.id);
          const isSelected = itemsToDrop.includes(item.id);
          const highlight = isDropMode && itemsToDrop.length === 0;
          const isNew = newItems.includes(item.id);

          return (
            <Tooltip
              key={item.id}
              title={<ItemTooltip item={item} itemSpecialsSeed={adventurer?.item_specials_seed || 0} style={styles.tooltipContainer} />}
              placement="bottom"
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'preventOverflow',
                      enabled: true,
                      options: { rootBoundary: 'viewport' },
                    },
                    {
                      name: 'offset',
                      options: {
                        offset: [-200, 0],
                      },
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
                sx={[
                  styles.bagSlot,
                  isSelected && styles.selectedItem,
                  highlight && styles.highlight,
                  isNew && styles.newItem
                ]}
                onClick={() => onItemClick(item)}
                onMouseEnter={() => onItemHover(item.id)}
              >
                <img src={metadata.imageUrl} alt={metadata.name} style={{ ...styles.bagIcon, objectFit: 'contain' }} />
              </Box>
            </Tooltip>
          );
        })}
        {Array(15 - (bag?.length || 0)).fill(null).map((_, idx) => (
          <Box key={`empty-${idx}`} sx={styles.bagSlot}>
            <Box sx={styles.emptySlot}></Box>
          </Box>
        ))}
        {!isDropMode && (
          <Box
            sx={styles.dropButtonSlot}
            onClick={onDropModeToggle}
          >
            <DeleteOutline sx={styles.dropIcon} />
            <Typography sx={styles.dropText}>drop</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function InventoryOverlay({ onStatsChange }: InventoryOverlayProps) {
  const { showInventory, setShowInventory } = useGameStore();
  const { adventurer, equipItem, newInventoryItems, setNewInventoryItems } = useGameStore();
  const { executeGameAction } = useGameDirector();
  const [isDropMode, setIsDropMode] = useState(false);
  const [itemsToDrop, setItemsToDrop] = useState<number[]>([]);
  const [dropInProgress, setDropInProgress] = useState(false);
  const [newItems, setNewItems] = useState<number[]>([]);

  // Update newItems when newInventoryItems changes and clear newInventoryItems
  useEffect(() => {
    if (newInventoryItems.length > 0) {
      setNewItems([...newInventoryItems]);
      setNewInventoryItems([]);
    }
  }, [newInventoryItems, setNewInventoryItems]);

  const handleItemClick = useCallback((item: any) => {
    if (isDropMode) {
      setItemsToDrop(prev => {
        if (prev.includes(item.id)) {
          return prev.filter(id => id !== item.id);
        } else {
          return [...prev, item.id];
        }
      });
    } else {
      equipItem(item);
    }
  }, [isDropMode, equipItem]);

  const handleConfirmDrop = () => {
    setDropInProgress(true);
    executeGameAction({
      type: 'drop',
      items: itemsToDrop,
    });
  };

  const handleCancelDrop = () => {
    setIsDropMode(false);
    setItemsToDrop([]);
  };

  const handleItemHover = useCallback((itemId: number) => {
    if (newItems.includes(itemId)) {
      setNewItems((prev: number[]) => prev.filter((id: number) => id !== itemId));
    }
  }, [newItems]);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', bottom: 24, left: 24, zIndex: 100 }}>
        <Box sx={styles.buttonWrapper} onClick={() => setShowInventory(!showInventory)}>
          <img src={'/images/inventory.png'} alt="Inventory" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', filter: 'hue-rotate(40deg) saturate(1.5) brightness(1.15) contrast(1.2)' }} />
        </Box>
        <Typography sx={styles.inventoryLabel}>Inventory</Typography>
      </Box>
      {showInventory && (
        <>
          {/* Inventory popup */}
          <Box sx={styles.popup}>
            <Box sx={styles.inventoryRoot}>
              {/* Left: Equipment */}
              <CharacterEquipment
                isDropMode={isDropMode}
                itemsToDrop={itemsToDrop}
                onItemClick={handleItemClick}
                newItems={newItems}
                onItemHover={handleItemHover}
              />
              {/* Right: Stats */}
              <AdventurerStats onStatsChange={onStatsChange} />
            </Box>

            {/* Bottom: Bag */}
            <InventoryBag
              isDropMode={isDropMode}
              itemsToDrop={itemsToDrop}
              onItemClick={handleItemClick}
              onDropModeToggle={() => setIsDropMode(true)}
              newItems={newItems}
              onItemHover={handleItemHover}
            />

            {/* Drop Mode Controls */}
            {isDropMode && (
              <Box sx={styles.dropControls}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancelDrop}
                  sx={styles.cancelDropButton}
                  disabled={dropInProgress}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirmDrop}
                  sx={styles.dropControlButton}
                  disabled={dropInProgress || itemsToDrop.length === 0}
                >
                  {dropInProgress
                    ? <Box display={'flex'} alignItems={'baseline'}>
                      <Typography>
                        Dropping items
                      </Typography>
                      <div className='dotLoader green' />
                    </Box>
                    : <Typography>
                      Confirm
                    </Typography>
                  }
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}
    </>
  );
}

const styles = {
  buttonWrapper: {
    width: 64,
    height: 64,
    background: 'rgba(24, 40, 24, 1)',
    border: '2px solid rgb(49 96 60)',
    boxShadow: '0 0 8px #000a',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
    '&:hover': {
      background: 'rgba(34, 50, 34, 0.85)',
    },
  },
  inventoryLabel: {
    color: '#e6d28a',
    textShadow: '0 2px 4px #000, 0 0 8px #3a5a2a',
    letterSpacing: 1,
    marginTop: 0.5,
    userSelect: 'none',
    textAlign: 'center',
  },
  popup: {
    position: 'absolute',
    top: '120px',
    left: '24px',
    width: '388px',
    maxHeight: '90vh',
    background: 'rgba(24, 40, 24, 0.55)',
    border: '2px solid #083e22',
    borderRadius: '10px',
    boxShadow: '0 8px 32px 8px #000b',
    backdropFilter: 'blur(8px)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 1.5,
    overflow: 'hidden',
  },
  inventoryRoot: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    mb: 1
  },
  equipmentPanel: {
    height: '220px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    background: 'rgba(24, 40, 24, 0.95)',
    border: '2px solid #083e22',
    borderRadius: '8px',
    boxShadow: '0 0 8px #000a',
    padding: 1,
  },
  characterPortraitWrapper: {
    position: 'relative',
    width: 175,
    height: 220,
    margin: '0 auto',
    background: 'rgba(20, 20, 20, 0.7)',
    borderRadius: '8px',
  },
  characterPortrait: {
    width: 100,
    height: 140,
  },
  equipmentSlot: {
    width: 42,
    height: 42,
    background: 'rgba(24, 40, 24, 0.95)',
    border: '2px solid #083e22',
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 4px #000a',
    zIndex: 2,
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'absolute',
  },
  equipmentIcon: {
    width: 36,
    height: 36,
  },
  emptySlot: {
    width: 34,
    height: 34,
    border: '1.5px dashed #666',
    borderRadius: 0,
    background: 'rgba(80,80,80,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagPanel: {
    width: '100%',
    background: 'rgba(24, 40, 24, 0.98)',
    border: '2px solid #083e22',
    padding: '8px',
    boxShadow: '0 0 8px #000a',
    boxSizing: 'border-box',
    borderRadius: '8px',
  },
  bagGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.5,
  },
  bagSlot: {
    width: 38,
    height: 38,
    background: 'rgba(24, 40, 24, 0.95)',
    border: '2px solid #083e22',
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 4px #000a',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  bagIcon: {
    width: 34,
    height: 34,
  },
  dropButtonSlot: {
    width: 42,
    height: 42,
    background: 'rgba(255, 0, 0, 0.1)',
    border: '2px solid rgba(255, 0, 0, 0.2)',
    boxShadow: '0 0 4px #000a',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255, 0, 0, 0.2)',
    },
  },
  dropIcon: {
    width: 16,
    height: 16,
    color: 'rgba(255, 0, 0, 0.7)',
  },
  dropText: {
    fontSize: '0.7rem',
    color: 'rgba(255, 0, 0, 0.7)',
    lineHeight: 1,
    mt: 0.5,
  },
  dropControls: {
    display: 'flex',
    gap: 1,
    mt: 1,
  },
  cancelDropButton: {
    flex: 1,
    justifyContent: 'center',
    fontSize: '0.9rem',
    background: 'rgba(255, 0, 0, 0.1)',
    color: '#FF0000',
    '&:disabled': {
      background: 'rgba(255, 0, 0, 0.05)',
      color: 'rgba(255, 0, 0, 0.3)',
    },
  },
  dropControlButton: {
    flex: 1,
    justifyContent: 'center',
    fontSize: '0.9rem',
    background: 'rgba(128, 255, 0, 0.15)',
    color: '#80FF00',
    '&:disabled': {
      background: 'rgba(128, 255, 0, 0.1)',
      color: 'rgba(128, 255, 0, 0.5)',
    },
  },
  selectedItem: {
    border: '1px solid #FF0000',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
  },
  highlight: {
    border: '1px solid #80FF00',
    backgroundColor: 'rgba(128, 255, 0, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(128, 255, 0, 0.15)',
    },
  },
  nonInteractive: {
    cursor: 'default',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  tooltipContainer: {
    position: 'absolute' as const,
    backgroundColor: 'rgba(17, 17, 17, 1)',
    border: '2px solid #083e22',
    borderRadius: '8px',
    padding: '10px',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  newItem: {
    border: '2px solid #80FF00',
    backgroundColor: 'rgba(128, 255, 0, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(128, 255, 0, 0.15)',
    },
  },
};

import { Box, Button, Dialog, Divider, Input, TextField, Typography } from '@mui/material';
import { motion } from "framer-motion";
import React, { useState, memo } from 'react';
import { fadeVariant } from "../utils/animations";
import { useUIStore } from '@/stores/uiStore';
import { Adventurer, Equipment, Item, Stats } from '@/types/game';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { calculateLevel } from '@/utils/game';
import emptySlot from '@/assets/images/empty_slot.png';
import { slotIcons, ItemUtils, typeIcons } from '@/utils/loot';

interface GameSettingsData {
  name: string;
  adventurer: Adventurer;
  bag: Item[];
}

const DEFAULT_SETTINGS: GameSettingsData = {
  name: '',
  adventurer: {
    health: 100,
    xp: 0,
    gold: 0,
    beast_health: 0,
    stat_upgrades_available: 0,
    stats: {
      strength: 10,
      dexterity: 10,
      vitality: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      luck: 10
    },
    equipment: {
      weapon: { id: 14, xp: 0 },
      chest: { id: 12, xp: 244 },
      head: { id: 0, xp: 0 },
      waist: { id: 0, xp: 0 },
      foot: { id: 32, xp: 0 },
      hand: { id: 0, xp: 0 },
      neck: { id: 0, xp: 0 },
      ring: { id: 0, xp: 0 }
    },
    item_specials_seed: 0
  },
  bag: []
};

function GameSettings() {
  const {
    isGameSettingsDialogOpen,
    setGameSettingsDialogOpen,
    gameSettingsMode,
    selectedSettingsId
  } = useUIStore();

  const [gameSettings, setGameSettings] = useState<GameSettingsData>(DEFAULT_SETTINGS);
  const [editing, setEditing] = useState(gameSettingsMode === 'create');
  const [editingName, setEditingName] = useState(false);

  const handleSave = async () => {
    // TODO: Implement save functionality
    setGameSettingsDialogOpen(false);
  };

  const renderSettingItem = (label: string, field: string, type: 'number' | 'stats', range?: [number, number]) => {
    const getValue = (path: string) => {
      const parts = path.split('.');
      let value: any = gameSettings;
      for (const part of parts) {
        value = value[part];
      }
      return value;
    };

    const setValue = (path: string, value: number) => {
      const parts = path.split('.');
      setGameSettings(prev => {
        const newSettings = { ...prev };
        let current: any = newSettings;
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        return newSettings;
      });
    };

    if (type === 'stats') {
      return (
        <Box sx={styles.statCard}>
          <Typography sx={styles.statLabel}>{label}</Typography>
          <Input
            disableUnderline={true}
            sx={{ color: '#80FF00' }}
            inputProps={{
              style: {
                textAlign: 'center',
                border: '1px solid #ffffff50',
                padding: '0',
                fontSize: '14px'
              }
            }}
            value={getValue(field)}
            disabled={!editing}
            onChange={(e) => setValue(field, Number(e.target.value))}
            onBlur={() => {
              if (range) {
                const numValue = Number(getValue(field));
                setValue(field, Math.max(range[0], Math.min(range[1], numValue)));
              }
            }}
          />
        </Box>
      );
    }

    return (
      <Box sx={styles.settingContainer}>
        <Typography color='primary'>
          {label}
        </Typography>


        <Box sx={styles.settingValueContainer}>
          {label === 'XP' && (
            <Typography color='primary' sx={{ pr: '4px' }}>
              {`(${calculateLevel(getValue(field))})`}
            </Typography>
          )}

          <Input
            disableUnderline={true}
            sx={{ color: '#80FF00', width: '50px' }}
            inputProps={{
              style: {
                textAlign: 'center',
                border: '1px solid #ffffff50',
                padding: '0',
                fontSize: '14px'
              }
            }}
            value={getValue(field)}
            disabled={!editing}
            onChange={(e) => setValue(field, Number(e.target.value))}
            onBlur={() => {
              if (range) {
                const numValue = Number(getValue(field));
                setValue(field, Math.max(range[0], Math.min(range[1], numValue)));
              }
            }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Dialog
      open={isGameSettingsDialogOpen}
      onClose={() => setGameSettingsDialogOpen(false)}
      maxWidth='lg'
      slotProps={{
        paper: {
          sx: {
            background: 'rgba(0, 0, 0, 1)',
            border: '1px solid #80FF00',
            maxWidth: '100dvw',
            borderRadius: '5px',
            margin: '4px'
          }
        }
      }}
    >
      <Box sx={styles.dialogContainer}>
        <motion.div variants={fadeVariant} exit='exit' animate='enter'>
          <Box sx={styles.container}>
            <Box sx={{ position: 'absolute', top: '0px', right: '0px' }} onClick={() => setGameSettingsDialogOpen(false)}>
              <CloseIcon htmlColor='#FFF' sx={{ fontSize: '24px' }} />
            </Box>

            {gameSettingsMode !== 'create' && (
              <Box sx={{ position: 'absolute', top: '7px', right: '50px' }}>
                <Button
                  variant='outlined'
                  color='primary'
                  size='small'
                  startIcon={<EditIcon color='primary' />}
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? 'Done' : 'Edit'}
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {editingName ? (
                <Input
                  value={gameSettings.name}
                  onChange={(e) => setGameSettings({ ...gameSettings, name: e.target.value })}
                  onBlur={() => setEditingName(false)}
                  autoFocus
                  sx={{
                    color: '#80FF00',
                    fontSize: '24px',
                    textAlign: 'center',
                    '& input': { textAlign: 'center' }
                  }}
                />
              ) : (
                <Typography
                  variant='h4'
                  color='primary'
                  onClick={() => editing && setEditingName(true)}
                  sx={{ cursor: editing ? 'pointer' : 'default' }}
                >
                  {gameSettings.name || 'Settings Name'}
                </Typography>
              )}
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box sx={styles.settingsGrid}>
              <Typography variant='h6' color='primary'>Adventurer</Typography>

              <Box sx={styles.settingsColumn}>
                {renderSettingItem('Health', 'adventurer.health', 'number', [1, 200])}
                {renderSettingItem('XP', 'adventurer.xp', 'number', [0, 1000])}
                {renderSettingItem('Gold', 'adventurer.gold', 'number', [0, 1000])}
                {renderSettingItem('Stat Upgrades', 'adventurer.stat_upgrades_available', 'number', [0, 10])}
              </Box>
            </Box>

            <Box sx={styles.statsGrid}>
              <Typography variant='h6' color='primary' sx={{ gridColumn: '1 / -1' }}>Stats</Typography>
              {renderSettingItem('STR', 'adventurer.stats.strength', 'stats', [1, 100])}
              {renderSettingItem('DEX', 'adventurer.stats.dexterity', 'stats', [1, 100])}
              {renderSettingItem('VIT', 'adventurer.stats.vitality', 'stats', [1, 100])}
              {renderSettingItem('INT', 'adventurer.stats.intelligence', 'stats', [1, 100])}
              {renderSettingItem('WIS', 'adventurer.stats.wisdom', 'stats', [1, 100])}
              {renderSettingItem('CHA', 'adventurer.stats.charisma', 'stats', [1, 100])}
            </Box>

            <Box>
              <Box sx={styles.sectionHeader}>
                <Typography variant="h6">
                  Equipment
                </Typography>
              </Box>

              <Box sx={styles.equippedItemsContainer}>
                <Box sx={styles.equippedItemsGrid}>
                  {Object.entries(slotIcons).map(([slot, icon]) => {
                    const equippedItem = gameSettings.adventurer.equipment[slot.toLowerCase() as keyof Equipment];
                    return (
                      <Box
                        key={slot}
                        sx={styles.equippedItemSlot}
                      >
                        {equippedItem && equippedItem.id !== 0 ? (
                          <Box sx={styles.equippedItemImageContainer}>
                            {ItemUtils.getMetadata(equippedItem.id) && (
                              <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '2px 4px 0px', width: '100%', boxSizing: 'border-box' }}>
                                  <Typography sx={styles.itemLevelText}>
                                    {calculateLevel(equippedItem.xp)}
                                  </Typography>
                                  <Box
                                    component="img"
                                    src={typeIcons[ItemUtils.getItemType(equippedItem.id) as keyof typeof typeIcons]}
                                    alt=""
                                    sx={{
                                      width: 14,
                                      height: 14,
                                      filter: `brightness(0) saturate(100%) ${ItemUtils.getItemTier(equippedItem.id) === 1 ? 'invert(83%) sepia(30%) saturate(638%) hue-rotate(358deg) brightness(103%) contrast(107%)' :
                                        ItemUtils.getItemTier(equippedItem.id) === 2 ? 'invert(43%) sepia(15%) saturate(1234%) hue-rotate(231deg) brightness(110%) contrast(87%)' :
                                          ItemUtils.getItemTier(equippedItem.id) === 3 ? 'invert(24%) sepia(98%) saturate(1823%) hue-rotate(209deg) brightness(96%) contrast(101%)' :
                                            ItemUtils.getItemTier(equippedItem.id) === 4 ? 'invert(48%) sepia(98%) saturate(1183%) hue-rotate(86deg) brightness(94%) contrast(101%)' :
                                              'invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)'}`,
                                      opacity: 1,
                                    }}
                                  />
                                </Box>

                                <Box sx={styles.itemImageContainer}>
                                  <img
                                    src={ItemUtils.getMetadata(equippedItem.id).imageUrl}
                                    alt={ItemUtils.getMetadata(equippedItem.id).name}
                                    style={{
                                      ...styles.itemImage,
                                    }}
                                  />
                                </Box>
                              </>
                            )}
                          </Box>
                        ) : (
                          <Box sx={styles.equippedItemSlotIcon}>
                            <Box
                              component="img"
                              src={icon}
                              alt={slot}
                              sx={{
                                width: 24,
                                height: 24,
                                filter: 'invert(1) sepia(1) saturate(3000%) hue-rotate(50deg) brightness(1.1)',
                                opacity: 0.3,
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box>
              <Box sx={styles.sectionHeader}>
                <Typography variant="h6">
                  Bag
                </Typography>

                <Button variant='outlined' color='primary' size='small' startIcon={<EditIcon color='primary' fontSize='small' />} onClick={() => setEditing(!editing)}>
                  Edit
                </Button>
              </Box>

              <Box sx={styles.bagItemsContainer}>
                {gameSettings.bag.length > 0 && gameSettings.bag.map((item, index) => (
                  <Box key={index} sx={styles.bagItem}>
                    <Box sx={styles.bagItemImageContainer}>
                      <img src={ItemUtils.getMetadata(item.id).imageUrl} alt={ItemUtils.getMetadata(item.id).name} />
                      <Typography>{ItemUtils.getMetadata(item.id).name} {item.xp}</Typography>
                    </Box>
                  </Box>
                ))}

                {gameSettings.bag.length === 0 && (
                  <Typography color='primary' mt={1}>
                    No items in bag
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {gameSettingsMode !== 'view' && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant='outlined'
                  color='primary'
                  size='large'
                  onClick={() => setGameSettingsDialogOpen(false)}
                  sx={{ width: '160px' }}
                >
                  Cancel
                </Button>

                <Button
                  variant='contained'
                  color='primary'
                  size='large'
                  onClick={handleSave}
                  sx={{ width: '160px' }}
                >
                  Create
                </Button>
              </Box>
            )}
          </Box>
        </motion.div>
      </Box>
    </Dialog>
  );
}

const styles = {
  dialogContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    p: 2,
    width: '400px',
    maxWidth: '100%',
    minHeight: '80vh',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  container: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    position: 'relative',
    minHeight: 'auto'
  },
  settingsGrid: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
  },
  settingsColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 1,
    width: '100%',
  },
  settingContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 1,
    px: 1,
    minHeight: '38px',
    background: 'rgba(128, 255, 0, 0.1)',
    border: '1px solid rgba(128, 255, 0, 0.2)',
    borderRadius: '4px',
  },
  settingValueContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '50px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '4px',
    marginBottom: '4px',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(128, 255, 0, 0.1)',
    border: '1px solid rgba(128, 255, 0, 0.2)',
    borderRadius: '4px',
    p: '6px',
    gap: '2px',
  },
  statLabel: {
    color: 'rgba(128, 255, 0, 0.9)',
    fontSize: '0.85rem',
    fontFamily: 'VT323, monospace',
    lineHeight: 1,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '24px',
  },
  sectionTitle: {
    color: '#80FF00',
    fontFamily: 'VT323, monospace',
    fontSize: '1.2rem',
    lineHeight: '24px',
  },
  equippedItemsContainer: {
    mt: 0.5,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '4px',
    background: 'rgba(128, 255, 0, 0.1)',
    borderRadius: '4px',
    border: '1px solid rgba(128, 255, 0, 0.2)',
  },
  equippedItemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '4px',
  },
  equippedItemSlot: {
    aspectRatio: '1',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
  },
  equippedItemSlotIcon: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  equippedItemImageContainer: {
    width: '100%',
    height: 'calc(100% - 18px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    height: '100%',
    objectFit: 'contain',
  },
  itemImageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mt: '-2px',
  },
  itemTierBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '2px',
    borderRadius: '4px',
  },
  itemLevelBadge: {
    left: 5,
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
    padding: '2px 0',
  },
  itemTypeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.8rem',
    fontFamily: 'VT323, monospace',
    pt: '2px',
    lineHeight: 1,
  },
  xpBarContainer: {
    padding: '0 4px',
  },
  xpBarBackground: {
    height: '2px',
    backgroundColor: 'rgba(237, 207, 51, 0.2)',
    borderRadius: '1px',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#EDCF33',
    transition: 'width 0.3s ease',
  },
  bagItemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '4px',
  },
  bagItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2px',
  },
  bagItemImageContainer: {
    width: '24px',
    height: '24px',
    objectFit: 'contain',
  },
};

export default GameSettings;
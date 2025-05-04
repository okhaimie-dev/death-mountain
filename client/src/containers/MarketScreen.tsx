import { useGameDirector } from '@/contexts/GameDirector';
import { useGameStore } from '@/stores/gameStore';
import { calculateLevel } from '@/utils/game';
import { ItemUtils } from '@/utils/loot';
import { MarketItem, generateMarketItems, potionPrice } from '@/utils/market';
import { Box, Button, Modal, Paper, Slider, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  SportsMma as WeaponIcon,
  Checkroom as ChestIcon,
  MilitaryTech as HeadIcon,
  Cable as WaistIcon,
  Hiking as FootIcon,
  BackHand as HandIcon,
  Diamond as RingIcon,
  Psychology as MagicIcon,
  Shield as MetalIcon,
  Checkroom as ClothIcon,
  Pets as HideIcon,
} from '@mui/icons-material';

export default function MarketScreen() {
  const { adventurer, marketSeed } = useGameStore();
  const { executeGameAction } = useGameDirector();

  const [inProgress, setInProgress] = useState(false);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState<{ potions: number; items: MarketItem[] }>({ potions: 0, items: [] });
  const [slotFilter, setSlotFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    if (marketSeed) {
      const items = generateMarketItems(BigInt(marketSeed), adventurer?.stats?.charisma || 0);
      // Sort items by price, with unaffordable items at the bottom
      const sortedItems = items.sort((a, b) => {
        const canAffordA = (adventurer?.gold || 0) >= a.price;
        const canAffordB = (adventurer?.gold || 0) >= b.price;

        if (canAffordA && canAffordB) {
          return b.price - a.price; // Both affordable, sort by price
        } else if (canAffordA) {
          return -1; // A is affordable, B is not, A comes first
        } else if (canAffordB) {
          return 1; // B is affordable, A is not, B comes first
        } else {
          return b.price - a.price; // Both unaffordable, sort by price
        }
      });

      setMarketItems(sortedItems);
      setInProgress(false);
    }

    setCart({ potions: 0, items: [] });
  }, [marketSeed, adventurer?.gold]);

  useEffect(() => {

  }, [marketSeed]);

  const handleBuyItem = (item: MarketItem) => {
    setCart(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  };

  const handleBuyPotion = (value: number) => {
    setCart(prev => ({
      ...prev,
      potions: value
    }));
  };

  const handleCheckout = () => {
    setInProgress(true);

    executeGameAction({
      type: 'buy_items',
      potions: cart.potions,
      items: cart.items.map(item => item.id),
    });
  };

  const handleRemoveItem = (itemToRemove: MarketItem) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemToRemove.id)
    }));
  };

  const handleRemovePotion = () => {
    setCart(prev => ({
      ...prev,
      potions: 0
    }));
  };

  const potionCost = potionPrice(calculateLevel(adventurer?.xp || 0), adventurer?.stats?.charisma || 0);
  const totalCost = cart.items.reduce((sum, item) => sum + item.price, 0) + (cart.potions * potionCost);
  const remainingGold = (adventurer?.gold || 0) - totalCost;
  const maxHealth = 100 + (adventurer?.stats?.vitality || 0) * 15;
  const maxPotions = Math.ceil((maxHealth - (adventurer?.health || 0)) / 10);

  const handleSlotFilter = (_: React.MouseEvent<HTMLElement>, newSlot: string | null) => {
    setSlotFilter(newSlot);
  };

  const handleTypeFilter = (_: React.MouseEvent<HTMLElement>, newType: string | null) => {
    setTypeFilter(newType);
  };

  const filteredItems = marketItems.filter(item => {
    const itemSlot = ItemUtils.getItemSlot(item.id);
    const itemType = ItemUtils.getItemType(item.id);

    if (slotFilter && itemSlot !== slotFilter) return false;
    if (typeFilter && itemType !== typeFilter) return false;
    return true;
  });

  return (
    <Box sx={styles.container}>
      {/* Top Bar */}
      <Box sx={styles.topBar}>
        <Box sx={styles.healthDisplay}>
          <Typography sx={styles.healthLabel}>Health</Typography>
          <Typography sx={styles.healthValue}>
            {Math.min(adventurer?.health! + (cart.potions * 10), maxHealth)}/{maxHealth}
          </Typography>
        </Box>
        <Box sx={styles.goldDisplay}>
          <Typography sx={styles.goldLabel}>Gold</Typography>
          <Typography sx={styles.goldValue}>{adventurer?.gold || 0}</Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setShowCart(!showCart)}
          sx={styles.cartButton}
        >
          Cart ({cart.potions + cart.items.length})
        </Button>
      </Box>

      {/* Cart Modal */}
      <Modal
        open={showCart}
        onClose={() => setShowCart(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          background: 'rgba(17, 17, 17, 1)',
          borderRadius: '5px',
          padding: '16px',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(128, 255, 0, 0.1)',
          position: 'relative',
        }}>
          <Button
            onClick={() => setShowCart(false)}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              minWidth: '32px',
              height: '32px',
              padding: 0,
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                color: '#80FF00',
              },
            }}
          >
            x
          </Button>
          <Typography sx={styles.cartTitle}>Market Cart</Typography>
          <Box sx={styles.cartItems}>
            {cart.potions > 0 && (
              <Box sx={styles.cartItem}>
                <Typography sx={styles.cartItemName}>Health Potion x{cart.potions}</Typography>
                <Typography sx={styles.cartItemPrice}>{potionCost * cart.potions} Gold</Typography>
                <Button
                  onClick={handleRemovePotion}
                  sx={styles.removeButton}
                >
                  x
                </Button>
              </Box>
            )}
            {cart.items.map((item, index) => (
              <Box key={index} sx={styles.cartItem}>
                <Typography sx={styles.cartItemName}>{item.name}</Typography>
                <Typography sx={styles.cartItemPrice}>{item.price} Gold</Typography>
                <Button
                  onClick={() => handleRemoveItem(item)}
                  sx={styles.removeButton}
                >
                  x
                </Button>
              </Box>
            ))}
          </Box>
          <Box sx={styles.cartTotal}>
            <Typography sx={styles.totalLabel}>Total</Typography>
            <Typography sx={styles.totalValue}>{totalCost} Gold</Typography>
          </Box>
          <Box sx={styles.cartActions}>
            <Button
              variant="contained"
              onClick={handleCheckout}
              disabled={inProgress || cart.potions === 0 && cart.items.length === 0 || remainingGold < 0}
              sx={styles.checkoutButton}
            >
              {inProgress
                ? <Box display={'flex'} alignItems={'baseline'}>
                  <Typography>
                    Processing
                  </Typography>
                  <div className='dotLoader green' />
                </Box>
                : <Typography>
                  Checkout
                </Typography>
              }
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Main Content */}
      <Box sx={styles.mainContent}>
        {/* Potions Section */}
        <Box sx={styles.potionsSection}>
          <Box sx={styles.potionSliderContainer}>
            <Box sx={styles.potionHeader}>
              <Typography sx={styles.potionLabel}>
                Potions: {cart.potions}
              </Typography>
              <Typography sx={styles.potionHelperText}>
                1 Potion = 10 Health
              </Typography>
              <Typography sx={styles.potionCost}>
                Cost: {potionCost}
              </Typography>
            </Box>
            <Slider
              value={cart.potions}
              onChange={(_, value) => handleBuyPotion(value as number)}
              min={0}
              max={maxPotions}
              sx={styles.potionSlider}
            />
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={styles.filtersContainer}>
          <Box sx={styles.filterGroup}>
            <ToggleButtonGroup
              value={slotFilter}
              exclusive
              onChange={handleSlotFilter}
              aria-label="item slot"
              sx={styles.filterButtons}
            >
              <ToggleButton value="weapon" aria-label="weapon">
                <WeaponIcon />
              </ToggleButton>
              <ToggleButton value="chest" aria-label="chest">
                <ChestIcon />
              </ToggleButton>
              <ToggleButton value="head" aria-label="head">
                <HeadIcon />
              </ToggleButton>
              <ToggleButton value="waist" aria-label="waist">
                <WaistIcon />
              </ToggleButton>
              <ToggleButton value="foot" aria-label="foot">
                <FootIcon />
              </ToggleButton>
              <ToggleButton value="hand" aria-label="hand">
                <HandIcon />
              </ToggleButton>
              <ToggleButton value="ring" aria-label="ring">
                <RingIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={styles.filterGroup}>
            <ToggleButtonGroup
              value={typeFilter}
              exclusive
              onChange={handleTypeFilter}
              aria-label="item type"
              sx={styles.filterButtons}
            >
              <ToggleButton value="metal" aria-label="metal">
                <MetalIcon />
              </ToggleButton>
              <ToggleButton value="cloth" aria-label="cloth">
                <ClothIcon />
              </ToggleButton>
              <ToggleButton value="hide" aria-label="hide">
                <HideIcon />
              </ToggleButton>
              <ToggleButton value="magic" aria-label="magic">
                <MagicIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Items Grid */}
        <Box sx={styles.itemsGrid}>
          {filteredItems.map((item) => {
            return (
              <Paper
                key={item.id}
                sx={styles.itemCard}
              >
                <Box sx={styles.itemImageContainer}>
                  <Box
                    component="img"
                    src={item.imageUrl}
                    alt={item.name}
                    sx={styles.itemImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <Box sx={styles.itemTierBadge} style={{ backgroundColor: ItemUtils.getTierColor(item.tier) }}>
                    <Typography sx={styles.itemTierText}>T{item.tier}</Typography>
                  </Box>
                </Box>

                <Box sx={styles.itemInfo}>
                  <Box sx={styles.itemHeader}>
                    <Typography sx={styles.itemName}>{item.name}</Typography>
                    <Typography sx={styles.itemType}>
                      {ItemUtils.getItemTypeIcon(item.type)} {item.type}
                    </Typography>
                  </Box>

                  <Box sx={styles.itemFooter}>
                    <Typography sx={styles.itemPrice}>
                      {item.price} Gold
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleBuyItem(item)}
                      disabled={remainingGold < item.price || cart.items.some(cartItem => cartItem.id === item.id)}
                      sx={styles.buyButton}
                      size="small"
                    >
                      {cart.items.some(cartItem => cartItem.id === item.id) ? 'In Cart' : 'Buy'}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            );
          })}
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
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderBottom: '1px solid rgba(128, 255, 0, 0.1)',
    gap: '8px',
    flexWrap: 'wrap',
  },
  healthDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(128, 255, 0, 0.05)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
  },
  healthLabel: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
  },
  healthValue: {
    color: '#80FF00',
    fontSize: '1.1rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
  },
  goldDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(237, 207, 51, 0.1)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(237, 207, 51, 0.2)',
  },
  goldLabel: {
    color: 'rgba(237, 207, 51, 0.7)',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
  },
  goldValue: {
    color: '#EDCF33',
    fontSize: '1.1rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
  },
  cartButton: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#111111',
    fontFamily: 'VT323, monospace',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    pb: 1,
    overflowY: 'auto',
    mb: '60px'
  },
  potionsSection: {
    marginBottom: 1,
  },
  potionSliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 12px 4px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
  },
  potionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  potionLabel: {
    color: '#80FF00',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
  },
  potionCost: {
    color: '#EDCF33',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
  },
  potionSlider: {
    ml: 1,
    width: '96%',
    color: '#80FF00',
    '& .MuiSlider-thumb': {
      backgroundColor: '#80FF00',
      width: '14px',
      height: '14px',
      '&:hover, &.Mui-focusVisible, &.Mui-active': {
        boxShadow: '0 0 0 4px rgba(128, 255, 0, 0.16)',
      },
    },
    '& .MuiSlider-track': {
      backgroundColor: '#80FF00',
    },
    '& .MuiSlider-rail': {
      backgroundColor: 'rgba(128, 255, 0, 0.2)',
    },
  },
  potionHelperText: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.8rem',
    fontFamily: 'VT323, monospace',
    textAlign: 'center',
  },
  itemsGrid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  itemCard: {
    background: 'rgba(128, 255, 0, 0.05)',
    border: '1px solid rgba(128, 255, 0, 0.1)',
    borderRadius: '8px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 1px 3px rgba(128, 255, 0, 0.1)',
    },
  },
  itemImageContainer: {
    position: 'relative',
    width: '100%',
    height: '80px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  itemTierBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    padding: '2px 4px 0',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTierText: {
    color: '#111111',
    fontSize: '0.8rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  itemName: {
    color: '#80FF00',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemType: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.8rem',
    fontFamily: 'VT323, monospace',
  },
  itemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  itemPrice: {
    color: '#EDCF33',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
  },
  buyButton: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#111111',
    fontFamily: 'VT323, monospace',
    minWidth: '60px',
    '&:disabled': {
      background: 'rgba(128, 255, 0, 0.1)',
      color: 'rgba(128, 255, 0, 0.5)',
    },
  },
  cartTitle: {
    color: '#80FF00',
    fontSize: '1.2rem',
    fontFamily: 'VT323, monospace',
    marginBottom: '16px',
    textAlign: 'center',
  },
  cartItems: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '16px',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 2px 8px 8px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  cartItemName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
    flex: 1,
  },
  cartItemPrice: {
    color: '#EDCF33',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    minWidth: '80px',
    textAlign: 'right',
  },
  removeButton: {
    padding: 0,
    minWidth: '24px',
    width: '24px',
    height: '24px',
    fontSize: '16px',
    ml: 1,
    color: '#FF4444',
  },
  cartTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    pr: '12px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  totalLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    fontFamily: 'VT323, monospace',
  },
  totalValue: {
    color: '#EDCF33',
    fontSize: '1.1rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
  },
  cartActions: {
    display: 'flex',
    gap: '8px',
  },
  clearButton: {
    flex: 1,
    fontSize: '0.9rem',
    fontWeight: 'bold',
    background: 'rgba(255, 0, 0, 0.1)',
    color: '#FF0000',
    fontFamily: 'VT323, monospace',
    '&:hover': {
      background: 'rgba(255, 0, 0, 0.2)',
    },
    '&:disabled': {
      background: 'rgba(255, 0, 0, 0.05)',
      color: 'rgba(255, 0, 0, 0.3)',
    },
  },
  checkoutButton: {
    flex: 1,
    fontSize: '0.9rem',
    py: '8px',
    fontWeight: 'bold',
    background: 'rgba(128, 255, 0, 0.2)',
    color: '#111111',
    fontFamily: 'VT323, monospace',
    '&:disabled': {
      background: 'rgba(128, 255, 0, 0.2)',
    },
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: 1,
    padding: '8px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(128, 255, 0, 0.1)',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
  },
  filterButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    '& .MuiToggleButton-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      borderColor: 'rgba(128, 255, 0, 0.2)',
      padding: '8px',
      minWidth: '32px',
      '&.Mui-selected': {
        color: '#111111',
        backgroundColor: 'rgba(128, 255, 0, 0.8)',
        '&:hover': {
          backgroundColor: 'rgba(128, 255, 0, 0.9)',
        },
      },
      '&:hover': {
        backgroundColor: 'rgba(128, 255, 0, 0.1)',
      },
    },
  },
};

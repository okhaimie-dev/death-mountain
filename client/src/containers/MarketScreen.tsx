import { useGameStore } from '@/stores/gameStore';
import { MarketItem, generateMarketItems } from '@/utils/market';
import { Box, Button, Typography, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { ItemUtils, ItemType, Tier } from '@/utils/loot';

export default function MarketScreen() {
  const { gameId, adventurer, marketSeed, setKeepScreen } = useGameStore();
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [hoveredItem, setHoveredItem] = useState<MarketItem | null>(null);
  const [cart, setCart] = useState<{ potions: number; items: MarketItem[] }>({ potions: 0, items: [] });
  const [showCart, setShowCart] = useState(false);
  const maxHealth = 100 + (adventurer?.stats?.vitality || 0) * 15;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const { buyItem } = useSystemCalls();

  useEffect(() => {
    if (marketSeed) {
      const items = generateMarketItems(BigInt(marketSeed), adventurer?.stats?.charisma || 0);
      console.log(items);
      setMarketItems(items);
    }
  }, [marketSeed]);

  const handleBuyItem = (item: MarketItem) => {
    setCart(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  };

  const handleBuyPotion = () => {
    setCart(prev => ({
      ...prev,
      potions: prev.potions + 1
    }));
  };

  const handleBuyMaxPotion = () => {
    if (adventurer) {
      const potionsNeeded = Math.ceil((maxHealth - adventurer.health) / 10);
      setCart(prev => ({
        ...prev,
        potions: potionsNeeded
      }));
    }
  };

  const handleClearCart = () => {
    setCart({ potions: 0, items: [] });
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
  };

  const totalCost = cart.items.reduce((sum, item) => sum + item.price, 0) + (cart.potions * 10);
  const remainingGold = (adventurer?.gold || 0) - totalCost;

  return (
    <Box sx={styles.container}>
      {/* Top Bar */}
      <Box sx={styles.topBar}>
        <Box sx={styles.healthDisplay}>
          <Typography sx={styles.healthLabel}>Health</Typography>
          <Typography sx={styles.healthValue}>
            {adventurer?.health || 0}/{maxHealth}
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

      {/* Cart Overlay */}
      {showCart && (
        <Box sx={styles.cartOverlay}>
          <Box sx={styles.cartContent}>
            <Typography sx={styles.cartTitle}>Shopping Cart</Typography>
            <Box sx={styles.cartItems}>
              {cart.potions > 0 && (
                <Box sx={styles.cartItem}>
                  <Typography sx={styles.cartItemName}>Health Potion x{cart.potions}</Typography>
                  <Typography sx={styles.cartItemPrice}>{cart.potions * 10} Gold</Typography>
                </Box>
              )}
              {cart.items.map((item, index) => (
                <Box key={index} sx={styles.cartItem}>
                  <Typography sx={styles.cartItemName}>{item.name}</Typography>
                  <Typography sx={styles.cartItemPrice}>{item.price} Gold</Typography>
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
                onClick={handleClearCart}
                disabled={cart.potions === 0 && cart.items.length === 0}
                sx={styles.clearButton}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                onClick={handleCheckout}
                disabled={cart.potions === 0 && cart.items.length === 0 || remainingGold < 0}
                sx={styles.checkoutButton}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Main Content */}
      <Box sx={styles.mainContent}>
        {/* Potions Section */}
        <Box sx={styles.potionsSection}>
          <Box sx={styles.potionButtons}>
            <Button
              variant="contained"
              onClick={handleBuyPotion}
              disabled={!adventurer || adventurer.health >= maxHealth}
              sx={styles.potionButton}
            >
              Buy Potion
            </Button>
            <Button
              variant="contained"
              onClick={handleBuyMaxPotion}
              disabled={!adventurer || adventurer.health >= maxHealth}
              sx={styles.potionButton}
            >
              Buy Max
            </Button>
          </Box>
        </Box>

        {/* Items Grid */}
        <Box sx={styles.itemsGrid}>
          {marketItems.map((item) => {
            return (
              <Paper
                key={item.id}
                sx={styles.itemCard}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
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
                      disabled={remainingGold < item.price}
                      sx={styles.buyButton}
                    >
                      Buy
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
    padding: '8px 16px',
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
    background: 'linear-gradient(45deg, #80FF00 30%, #9dff33 90%)',
    color: '#111111',
    fontFamily: 'VT323, monospace',
    padding: '8px 16px',
    '&:hover': {
      background: 'linear-gradient(45deg, #9dff33 30%, #80FF00 90%)',
    },
  },
  cartOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
  },
  cartContent: {
    background: 'rgba(17, 17, 17, 0.95)',
    borderRadius: '12px',
    padding: '16px',
    width: '100%',
    maxWidth: '400px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(128, 255, 0, 0.1)',
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
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0, 0, 0, 0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(128, 255, 0, 0.2)',
      borderRadius: '2px',
    },
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  cartItemName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
  },
  cartItemPrice: {
    color: '#EDCF33',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
  },
  cartTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
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
    fontSize: '1.2rem',
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
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #80FF00 30%, #9dff33 90%)',
    color: '#111111',
    fontFamily: 'VT323, monospace',
    '&:hover': {
      background: 'linear-gradient(45deg, #9dff33 30%, #80FF00 90%)',
    },
    '&:disabled': {
      background: 'rgba(128, 255, 0, 0.1)',
      color: 'rgba(128, 255, 0, 0.5)',
    },
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    overflow: 'hidden',
  },
  potionsSection: {
    marginBottom: '16px',
  },
  potionButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  potionButton: {
    flex: 1,
    minWidth: '120px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #80FF00 30%, #9dff33 90%)',
    color: '#111111',
    fontFamily: 'VT323, monospace',
    '&:hover': {
      background: 'linear-gradient(45deg, #9dff33 30%, #80FF00 90%)',
    },
    '&:disabled': {
      background: 'rgba(128, 255, 0, 0.1)',
      color: 'rgba(128, 255, 0, 0.5)',
    },
  },
  itemsGrid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    overflowY: 'auto',
    padding: '4px',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0, 0, 0, 0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(128, 255, 0, 0.2)',
      borderRadius: '2px',
    },
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
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(128, 255, 0, 0.1)',
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
    padding: '2px 4px',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTierText: {
    color: '#111111',
    fontSize: '0.7rem',
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
    fontSize: '0.8rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #80FF00 30%, #9dff33 90%)',
    color: '#111111',
    fontFamily: 'VT323, monospace',
    padding: '4px 8px',
    minWidth: '60px',
    '&:hover': {
      background: 'linear-gradient(45deg, #9dff33 30%, #80FF00 90%)',
    },
    '&:disabled': {
      background: 'rgba(128, 255, 0, 0.1)',
      color: 'rgba(128, 255, 0, 0.5)',
    },
  },
};

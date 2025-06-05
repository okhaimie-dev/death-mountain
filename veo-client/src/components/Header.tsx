import { useGameStore } from '@/stores/gameStore';
import { Box } from '@mui/material';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import WalletConnect from './WalletConnect';

function Header() {
  const { gameId, adventurer } = useGameStore();

  if (gameId && adventurer && isMobile) return null;

  return (
    <Box sx={styles.header}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      </Box>

      <Box sx={styles.headerButtons}>
        <WalletConnect />
      </Box>
    </Box>
  );
}

export default Header

const styles = {
  header: {
    width: '100%',
    height: '50px',
    borderBottom: '2px solid rgba(17, 17, 17, 1)',
    background: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    px: '10px'
  },
  headerButtons: {
    display: 'flex',
    height: '36px',
    alignItems: 'center',
    gap: 2
  }
};
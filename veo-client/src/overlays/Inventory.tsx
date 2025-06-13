import { Box, Typography } from '@mui/material';

export default function InventoryOverlay() {
  return (
    <Box sx={styles.buttonWrapper}>
      <img src={'/images/adventurer.png'} alt="adventurer" style={styles.icon} />
    </Box>
  );
}

const styles = {
  buttonWrapper: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(24, 40, 24, 1)',
    border: '3px solid #083e22',
    boxShadow: '0 0 8px rgba(0,0,0,0.6)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0.5,
    '&:hover': {
      background: '#2e4a2e',
    },
  },
  icon: {
    width: 60,
    height: 60,
    display: 'block',
  },
};

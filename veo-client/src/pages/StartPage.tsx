import { useController } from '@/contexts/controller';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import startImg from '@/assets/images/start.png';
import WalletConnect from '@/components/WalletConnect';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { address } = useController();
  const navigate = useNavigate();

  const handleStartGame = async () => {
    navigate(`/play?settingsId=7`)
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="imageContainer"
        style={{ backgroundImage: `url(${startImg})` }}
      >
        <Box sx={styles.walletContainer}>
          <WalletConnect />
        </Box>

        <Box sx={styles.contentContainer}>
          <Typography variant="h2" sx={styles.title}>
            Loot Survivor 2
          </Typography>
          <Button variant="contained" color="primary" sx={styles.playButton} onClick={handleStartGame}>
            Play Now
          </Button>
        </Box>
      </motion.div>
    </>
  );
}

const styles = {
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  walletContainer: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    zIndex: 2,
  },
  playButton: {
    fontSize: '1.4rem',
    padding: '8px 3rem',
    borderRadius: '1rem',
    boxShadow: 3,
  },
  title: {
    color: '#1aff5c',
    fontWeight: 'bold',
    textShadow: '0 2px 8px #003311',
    marginBottom: '2.5rem',
    textAlign: 'center',
    letterSpacing: '0.08em',
    fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
    lineHeight: 1.1,
  },
};
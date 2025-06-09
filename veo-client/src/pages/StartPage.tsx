import startImg from '@/assets/images/start.png';
import MainMenu from '@/overlays/MainMenu';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="imageContainer"
        style={{ backgroundImage: `url(${startImg})` }}
      >
        <MainMenu />
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
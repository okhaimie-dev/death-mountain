import { useGameStore } from '@/stores/gameStore';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import { Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import WalletConnect from './WalletConnect';
import { isMobile } from 'react-device-detect';
import { useGameDirector } from '@/contexts/GameDirector';

function Header() {
  const navigate = useNavigate()
  const { gameId, adventurer, exitGame } = useGameStore();
  const { playing, setPlaying } = useGameDirector();

  const backToMenu = () => {
    exitGame();
    navigate('/')
  }

  if (gameId && adventurer && isMobile) return null;

  return (
    <Box sx={styles.header}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {gameId && <Box sx={{ height: '32px', opacity: 1, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={backToMenu}>
          <CloseIcon fontSize='medium' htmlColor='white' />
        </Box>}
      </Box>

      <Box sx={styles.headerButtons}>
        <Box
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => setPlaying(!playing)}
        >
          {playing ?
            <MusicNoteIcon fontSize='medium' htmlColor='white' /> :
            <MusicOffIcon fontSize='medium' htmlColor='white' />
          }
        </Box>

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
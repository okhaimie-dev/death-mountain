import { useGameStore } from '@/stores/gameStore';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import { useNavigate } from "react-router-dom";

function GameHeader() {
  const navigate = useNavigate()
  const { exitGame } = useGameStore();

  const backToMenu = () => {
    exitGame();
    navigate('/')
  }

  return (
    <Box sx={[styles.header, { height: '42px', pl: 3 }]}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{ height: '32px', opacity: 1, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={backToMenu}>
          <CloseIcon fontSize='medium' htmlColor='white' />
        </Box>
      </Box>
    </Box>
  );
}

export default GameHeader

const styles = {
  header: {
    width: '100%',
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    pr: 1,
    boxSizing: 'border-box',
    gap: 4,
  },
};
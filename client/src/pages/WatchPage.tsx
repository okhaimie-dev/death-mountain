import { useGameDirector } from '@/contexts/GameDirector';
import { useGameStore } from '@/stores/gameStore';
import CloseIcon from '@mui/icons-material/Close';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GamePage from './GamePage';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VideocamIcon from '@mui/icons-material/Videocam';
import { formatGameEvent } from '@/utils/events';

export default function WatchPage() {
  const { watch } = useGameDirector();
  const { spectating, setSpectating, replayEvents, processEvent, setEventQueue } = watch;

  const { gameId, adventurer, exitGame } = useGameStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const game_id = Number(searchParams.get('id'));

  useEffect(() => {
    if (game_id) {
      setSpectating(true);
    } else {
      setSpectating(false);
      navigate('/');
    }
  }, [game_id]);

  useEffect(() => {
    if (replayEvents.length > 0 && replayIndex === 0) {
      replayForward();
    }
  }, [replayEvents]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isPlaying) return; // Don't handle keyboard events while playing
      
      if (event.key === 'ArrowRight') {
        replayForward();
      } else if (event.key === 'ArrowLeft') {
        replayBackward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [replayIndex, isPlaying]); // Add dependencies

  const handleEndWatching = () => {
    exitGame();
    setSpectating(false);
    navigate('/');
  };

  const handlePlayPause = (play: boolean) => {
    if (play) {
      setEventQueue(replayEvents.slice(replayIndex));
    } else {
      setEventQueue([]);
    }

    setIsPlaying(play);
  };

  const replayForward = () => {
    if (replayIndex >= replayEvents.length - 1) return;

    let currentIndex = replayIndex;
    while (currentIndex < replayEvents.length - 1) {
      let currentEntity = replayEvents[currentIndex];
      processEvent(currentEntity, true);
      currentIndex++;

      let event = formatGameEvent(currentEntity);
      if (event.type === 'adventurer' && event.adventurer?.stat_upgrades_available === 0) {
        break;
      }
    }

    setReplayIndex(currentIndex);
  }

  const replayBackward = () => {
    if (replayIndex < 1) return;

    let currentIndex = replayIndex;
    while (currentIndex > 0) {
      let currentEntity = replayEvents[currentIndex];
      processEvent(currentEntity, true);
      currentIndex--;

      let event = formatGameEvent(currentEntity);
      if (event.type === 'adventurer' && event.adventurer?.stat_upgrades_available === 0) {
        break;
      }
    }

    setReplayIndex(currentIndex);
  }

  if (!spectating) return null;

  const isLoading = !gameId || !adventurer;

  return (
    <>
      {!isLoading && <Box sx={styles.overlay}>
        {replayEvents.length === 0 ? (
          <>
            <Box />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <VisibilityIcon sx={styles.visibilityIcon} />
              <Typography sx={styles.text}>
                Spectating
              </Typography>
            </Box>

            <CloseIcon sx={styles.closeIcon} onClick={handleEndWatching} />
          </>
        ) : (
          <>
            <VideocamIcon sx={styles.theatersIcon} />

            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
              <Button
                disabled={isPlaying}
                onClick={replayBackward}
                sx={styles.controlButton}
              >
                <SkipPreviousIcon />
              </Button>

              <Button
                onClick={() => handlePlayPause(!isPlaying)}
                sx={styles.controlButton}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </Button>

              <Button
                onClick={replayForward}
                disabled={isPlaying}
                sx={styles.controlButton}
              >
                <SkipNextIcon />
              </Button>
            </Box>

            <ExitToAppIcon sx={styles.closeIcon} onClick={handleEndWatching} />
          </>
        )}
      </Box>}

      <GamePage />
    </>
  );
}

const styles = {
  overlay: {
    height: '52px',
    width: '444px',
    maxWidth: 'calc(100dvw - 6px)',
    position: 'fixed',
    bottom: '67px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    zIndex: 1000,
    boxSizing: 'border-box',
    borderTop: '2px solid rgba(128, 255, 0, 0.4)',
    borderBottom: 'none',
  },
  visibilityIcon: {
    color: 'rgba(128, 255, 0, 1)',
  },
  closeIcon: {
    cursor: 'pointer',
    color: '#FF0000',
    '&:hover': {
      color: 'rgba(255, 0, 0, 0.6)',
    },
  },
  text: {
    color: 'rgba(128, 255, 0, 1)',
    fontSize: '1.4rem',
  },
  controlButton: {
    color: 'rgba(128, 255, 0, 1)',
    fontSize: '12px',
    '&:disabled': {
      color: 'rgba(128, 255, 0, 0.5)',
    },
  },
  theatersIcon: {
    color: '#EDCF33',
  },
};
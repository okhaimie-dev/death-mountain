import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WatchIcon from '@mui/icons-material/Watch';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adventurerImg from '@/assets/images/adventurer.png';
import { calculateLevel } from '@/utils/game';
import { useGameTokens } from '@/dojo/useGameTokens';
import { useUIStore } from '@/stores/uiStore';
import { useAccount } from '@starknet-react/core';

export default function GameTokensList() {
  const { getTokens, fetchGameTokensData } = useGameTokens();
  const { account } = useAccount();
  const navigate = useNavigate();

  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeDead, setIncludeDead] = useState(false);

  useEffect(() => {
    const loadTokens = async () => {
      if (!account?.address) return;
      
      setLoading(true);
      try {
        const tokenIds = await getTokens(account.address);
        if (tokenIds.length > 0) {
          const tokenData = await fetchGameTokensData(tokenIds.map((id: number) => id.toString()));
          setTokens(tokenData);
        } else {
          setTokens([]);
        }
      } catch (error) {
        console.error('Error loading tokens:', error);
        setTokens([]);
      } finally {
        setLoading(false);
      }
    };

    loadTokens();
  }, [account?.address, getTokens, fetchGameTokensData]);

  function handleResumeGame(gameId: number) {
    navigate(`/play?id=${gameId}`)
  }

  const renderTimeRemaining = (timestamp: number) => {
    const hours = Math.max(0, Math.floor((timestamp - Date.now()) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor(((timestamp - Date.now()) % (1000 * 60 * 60)) / (1000 * 60)));

    return (
      <>
        {hours > 0 && (
          <>
            <Typography color='primary' sx={{ fontSize: '13px' }}>
              {hours}
            </Typography>
            <Typography color='primary' sx={{ fontSize: '13px', ml: '2px' }}>
              h
            </Typography>
          </>
        )}
        <Typography color='primary' sx={{ fontSize: '13px', ml: hours > 0 ? '4px' : '0px' }}>
          {minutes}
        </Typography>
        <Typography color='primary' sx={{ fontSize: '13px', ml: '2px' }}>
          m
        </Typography>
      </>
    );
  };

  if (loading) {
    return <Button loading={loading} sx={{ my: 1 }} />
  }

  return (
    <Box sx={styles.listContainer}>
      {tokens.map((game: any) => (
        <Box
          key={game.adventurer_id}
          sx={styles.listItem}
          className='container'
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '30vw', flex: 1 }}>
            <img src={adventurerImg} alt="Adventurer" style={{ width: '32px', height: '32px' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', overflow: 'hidden' }}>
              <Typography variant="h6" color="primary" lineHeight={1} sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', overflow: 'hidden' }}>
                {game.player_name}
              </Typography>

              <Typography color="text.secondary">
                ID: #{game.adventurer_id}
              </Typography>
            </Box>
          </Box>

          {game.xp ? <Stack direction="column" flex={1} minWidth="55px">
            <Typography variant="body2" lineHeight={1.2} color="#EDCF33">
              Lvl: {calculateLevel(game.xp)}
            </Typography>
            <Typography variant="body2" lineHeight={1.1}>
              HP: {game.health}
            </Typography>
          </Stack> : <Typography variant="body2" color="#EDCF33" flex={1}>
            New Game
          </Typography>
          }

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '50px' }}>
            {game.available_at !== 0 && <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {game.available_at < Date.now() ? <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon color='primary' sx={{ fontSize: '16px', mr: '3px' }} />
                {renderTimeRemaining(game.expires_at)}
              </Box> : <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WatchIcon color='primary' sx={{ fontSize: '16px', mr: '3px' }} />
                {renderTimeRemaining(game.available_at)}
              </Box>}
            </Box>}
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant='contained'
              color="primary"
              size="small"
              sx={styles.resumeButton}
              onClick={() => handleResumeGame(game.adventurer_id)}
              disabled={game.available_at > Date.now()}
            >
              <ArrowForwardIcon fontSize='small' />
            </Button>
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

const styles = {
  listContainer: {
    width: '100%',
    maxHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    mt: 1,
    pr: 0.5,
    overflowY: 'auto',
  },
  listItem: {
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    p: '5px !important',
    flexShrink: 0,
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    background: 'rgba(128, 255, 0, 0.1)',
    border: '1px solid rgba(128, 255, 0, 0.2)',
    p: '2px 5px'
  },
  statLabel: {
    color: 'rgba(128, 255, 0, 0.7)',
    fontSize: '0.85rem',
    fontFamily: 'VT323, monospace',
    lineHeight: 1,
  },
  statValue: {
    color: '#80FF00',
    fontSize: '0.9rem',
    fontFamily: 'VT323, monospace',
    fontWeight: 'bold',
    lineHeight: 1,
  },
  resumeButton: {
    width: '50px',
    height: '34px',
    fontSize: '12px',
    '&.Mui-disabled': {
      backgroundColor: 'rgba(128, 255, 0, 0.1)',
      color: 'rgba(128, 255, 0, 0.3)',
      border: '1px solid rgba(128, 255, 0, 0.2)'
    }
  }
}
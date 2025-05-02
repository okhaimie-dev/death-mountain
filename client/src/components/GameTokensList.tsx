import { useController } from '@/contexts/Controller';
import { fetchGameTokens, populateGameTokens } from '@/dojo/useGameTokens';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GameTokensList() {
  const { account } = useController();
  const navigate = useNavigate();

  const [gameTokens, setGameTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      setLoading(true)
      const gameTokenIds = await fetchGameTokens(account.address)
      let games = await populateGameTokens(gameTokenIds)

      setGameTokens(games.sort((a: any, b: any) => b.adventurer_id - a.adventurer_id))
      setLoading(false)
    }

    if (account) {
      fetchGames()
    }
  }, [account]);

  function handleResumeGame(gameId: number) {
    navigate(`/play?id=${gameId}`)
  }

  if (loading) {
    return <Button loading={loading} sx={{ my: 1 }} />
  }

  return (
    <Box sx={styles.listContainer}>
      {gameTokens.map((game: any) => (
        <Box
          key={game.adventurer_id}
          sx={styles.listItem}
          className='container'
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <Typography variant="h6" color="primary" lineHeight={1}>
              {/* {game.player_name} */}
              Await
            </Typography>

            <Typography color="text.secondary">
              ID: #{game.adventurer_id}
            </Typography>
          </Box>

          <Stack direction="column">
            <Typography variant="body2">
              XP: {game.xp}
            </Typography>
            <Typography variant="body2">
              HP: {game.health}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button variant='contained' color="primary" size="small" sx={{ width: '50px', height: '34px' }} onClick={() => handleResumeGame(game.adventurer_id)}>
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
    pr: 1,
    overflowY: 'auto',
  },
  listItem: {
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    p: '5px 10px',
    flexShrink: 0,
  }
}
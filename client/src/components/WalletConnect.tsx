import { useController } from '@/contexts/controller';
import { ellipseAddress } from '@/utils/utils';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { LoadingButton } from '@mui/lab';

function WalletConnect() {
  const { account, address, connecting, playerName, login, openProfile } = useController()

  return (
    <>
      {account && address
        ? <LoadingButton
          loading={!playerName}
          onClick={() => openProfile()}
          startIcon={<SportsEsportsIcon />}
          color='primary'
          variant='contained'
          size='small'
          sx={{ minWidth: '100px' }}
        >
          {playerName ? playerName : ellipseAddress(address, 4, 4)}
        </LoadingButton>

        : <LoadingButton
          loading={connecting}
          variant='contained'
          color='secondary'
          onClick={() => login()}
          size='small'
          startIcon={<SportsEsportsIcon />}
          sx={{ minWidth: '100px' }}
        >
          Log In
        </LoadingButton>
      }
    </>
  );
}

export default WalletConnect

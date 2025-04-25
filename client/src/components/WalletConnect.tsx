import { useController } from '@/contexts/controller';
import { ellipseAddress } from '@/utils/utils';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { LoadingButton } from '@mui/lab';
import { useConnect } from "@starknet-react/core";

function WalletConnect() {
  const { account, address, connecting, playerName } = useController()
  const { connect, connector, connectors } = useConnect();

  return (
    <>
      {account && address
        ? <LoadingButton
          loading={!playerName}
          onClick={() => (connector as any)?.controller?.openProfile()}
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
          onClick={() => connect({ connector: connectors.find(conn => conn.id === "controller") })}
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

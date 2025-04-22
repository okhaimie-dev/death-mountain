import { useController } from '@/providers/controller';
import { ellipseAddress } from '@/utils/utils';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import { useConnect } from "@starknet-react/core";

function WalletConnect() {
  const { account, address, connecting, playerName } = useController()
  const { connect, connector, connectors } = useConnect();

  return (
    <Box sx={{ position: 'fixed', top: 5, right: 10, display: 'flex', alignItems: 'center', gap: 1 }}>
      {account && address
        ? <Button onClick={() => (connector as any)?.controller?.openProfile()} startIcon={<SportsEsportsIcon />} size={'medium'} variant='outlined'>
          <Typography color='primary'>
            {playerName ? playerName : ellipseAddress(address, 4, 4)}
          </Typography>
        </Button>

        : <LoadingButton loading={connecting} variant='outlined' onClick={() => connect({ connector: connectors.find(conn => conn.id === "controller") })} size='medium' startIcon={<SportsEsportsIcon />}>
          <Typography color='primary'>
            Connect
          </Typography>
        </LoadingButton>
      }
    </Box>
  );
}

export default WalletConnect

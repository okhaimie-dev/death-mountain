import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { dojoConfig, NETWORKS } from '../../dojoConfig';

function Network() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNetworkSelect = (name: string) => {
    handleClose();
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? '#4CAF50' : '#F44336';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
      <Button
        variant="outlined"
        onClick={handleClick}
        fullWidth
        sx={{
          borderColor: '#d7c529',
          color: '#d7c529',
          '&:hover': {
            borderColor: '#b59f3b',
            backgroundColor: 'rgba(183, 159, 59, 0.1)'
          },
          height: '36px',
          textTransform: 'none',
          fontWeight: 500,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px'
        }}
      >
        {dojoConfig.name}
        <FiberManualRecordIcon
          sx={{
            color: getStatusColor(dojoConfig.status),
            fontSize: 12
          }}
        />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: 310,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }
          }
        }}
      >
        {Object.values(NETWORKS).map((network) => (
          <MenuItem
            key={network.name}
            onClick={() => handleNetworkSelect(network.name)}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1
            }}
          >
            {network.name}
            <FiberManualRecordIcon
              sx={{
                color: getStatusColor(network.status || 'offline'),
                fontSize: 10
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default Network

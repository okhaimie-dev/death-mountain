import { Box } from '@mui/material';

export default function GamePage() {
  return (
    <Box
      sx={styles.container}
    />
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    backgroundColor: 'primary.main',
  }
}
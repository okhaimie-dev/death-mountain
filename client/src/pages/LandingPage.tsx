import { Box, Typography } from '@mui/material';

export default function LandingPage() {
  return (
    <Box sx={styles.container}>
      <Typography variant="h1">
        HELLO WORLD
      </Typography>
    </Box>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    backgroundColor: 'primary.main',
  }
}
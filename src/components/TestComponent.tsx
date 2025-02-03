import { Box, Typography } from '@mui/material';

export default function TestComponent() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h1" color="primary">
        Test Component
      </Typography>
      <Typography variant="body1">
        If you can see this, React is working!
      </Typography>
    </Box>
  );
} 
import { Box, Typography } from '@mui/material';

export default function TestComponent() {
  return (
    <Box
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: 'background.paper',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          color: 'primary.main',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          mb: 2,
          transition: 'color 0.3s ease',
          '&:hover': {
            color: 'secondary.main',
          },
        }}
      >
        JAADU
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.6,
        }}
      >
        If you can see this, React is working!
      </Typography>
    </Box>
  );
} 
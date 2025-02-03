import { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, InputBase, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Home,
  ShowChart,
  AccountBalance,
  Timeline
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
}));

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#131722' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="span"
              sx={{
                width: 32,
                height: 32,
                backgroundColor: 'primary.main',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
                color: 'background.paper',
                fontWeight: 'bold'
              }}
            >
              SP
            </Box>
            Stock Predictor
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search stocks..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
              <Home sx={{ mr: 1 }} /> Home
            </NavLink>
            <NavLink to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>
              <ShowChart sx={{ mr: 1 }} /> Portfolio
            </NavLink>
            <NavLink to="/predictions" className={location.pathname === '/predictions' ? 'active' : ''}>
              <Timeline sx={{ mr: 1 }} /> Predictions
            </NavLink>
            <NavLink to="/swing" className={location.pathname === '/swing' ? 'active' : ''}>
              <AccountBalance sx={{ mr: 1 }} /> Swing
            </NavLink>
          </Box>

          <Box sx={{ display: 'flex', ml: 2 }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#1E2023' }}>
        {children}
      </Box>
    </Box>
  );
} 

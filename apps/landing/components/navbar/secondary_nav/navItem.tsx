import { theme } from '@hopehome/theme';
import { styled } from '@mui/material';
import Link from 'next/link';
// import { NavLink } from 'react-router-dom';

const NavItem = styled(Link)(() => ({
  ...theme.typography.body1,
  fontWeight: 600,
  color: 'white',
  transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  textDecoration: 'none',
  textAlign: 'center',
  borderRadius: '50px',
  display: 'grid',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: 'white',
    transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    color: theme.palette.primary.light,
  },
  '&.active': {
    backgroundColor: 'rgba(29, 29, 41, 0.78)',
  },
}));

export default NavItem;

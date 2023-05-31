import { theme } from '@hopehome/theme';
import { Box } from '@mui/material';
import { useIntl } from 'react-intl';
import NavItem from './navItem';

export default function Navbar({ active }: { active: string }) {
  const { formatMessage } = useIntl();

  const navLinks: { name: string; link: string }[] = [
    { name: 'myProperties', link: '/properties/my-properties' },
    { name: 'properties', link: '/properties' },
    { name: 'favorites', link: '/properties/saved' },
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        display: 'grid',
        padding: `${theme.spacing(0.5)} ${theme.spacing(0.625)}`,
        gridAutoFlow: 'column',
        columnGap: theme.spacing(1),
        borderRadius: '50px',
        width: '15vw',
        minWidth: 'fit-content',
        justifySelf: 'center',
      }}
    >
      {navLinks.map(({ link, name }, index) => (
        <NavItem
          href={link}
          sx={{
            height: '100%',
            padding: {
              desktop: `0 ${theme.spacing(0.25)}`,
              mobile: `0 ${theme.spacing(0.7)}`,
            },
            color: active === link ? theme.palette.primary.main : 'white',
            backgroundColor:
              active === link ? 'white' : theme.palette.primary.main,
          }}
          key={index}
        >
          {formatMessage({ id: name })}
        </NavItem>
      ))}
    </Box>
  );
}

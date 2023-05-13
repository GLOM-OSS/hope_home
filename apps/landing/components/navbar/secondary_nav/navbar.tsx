import { theme } from '@hopehome/theme';
import { HomeOutlined } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import NavItem from './navItem';

export default function Navbar({ active }: { active: string }) {
  const { formatMessage } = useIntl();

  const navLinks: { name: string; link: string }[] = [
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
      <Link
        href={'/properties/my-properties'}
        style={{
          justifySelf: 'center',
          alignSelf: 'center',
        }}
      >
        <Tooltip arrow title={formatMessage({ id: 'myProperties' })}>
          <HomeOutlined
            sx={{
              color:
                active === 'my-properties'
                  ? theme.palette.primary.main
                  : 'white',
              backgroundColor:
                active === 'my-properties'
                  ? 'white'
                  : theme.palette.primary.main,
              transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              textDecoration: 'none',
              textAlign: 'center',
              borderRadius: '50px',
              justifySelf: 'center',
              '&:hover': {
                transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                color: theme.palette.primary.light,
              },
            }}
          />
        </Tooltip>
      </Link>
      {navLinks.map(({ link, name }, index) => (
        <NavItem
          href={link}
          sx={{
            height: '100%',
            padding: `0 ${theme.spacing(0.25)}`,
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

import { theme, useLanguage } from '@hopehome/theme';
import { Language } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

interface navItem {
  item: string;
  route: string;
}

function NavItem({ route, item }: { route: string; item: string }) {
  const { pathname } = useRouter();
  const { formatMessage } = useIntl();

  return (
    <Typography
      sx={{
        position: 'relative',
        transition: '0.2s',
        '& a': {
          textDecoration: 'none',
          color: 'white',
          ...theme.typography.body1,
          fontWeight: 400,
        },
        '&::before': {
          transition: '0.2s',
          position: 'absolute',
          left: '0px',
          bottom: '-5px',
          height: '3px',
          content: '""',
          width:
            pathname === route ||
            `/${pathname.split('/').filter((_) => _ !== '')[0]}` === route
              ? '100%'
              : 0,
          backgroundColor: theme.palette.primary.main,
          borderRadius: '5px',
        },
        '&:hover::before': {
          transition: '0.2s',
          width: '100%',
          backgroundColor:
            theme.palette[
              pathname === route ||
              `/${pathname.split('/').filter((_) => _ !== '')[0]}` === route
                ? 'primary'
                : 'secondary'
            ].main,
        },
      }}
    >
      <Link href={route}>{formatMessage({ id: item })}</Link>
    </Typography>
  );
}

export default function Navbar() {
  const { formatMessage } = useIntl();
  const { activeLanguage, languageDispatch } = useLanguage();

  const navItems: navItem[] = [
    { item: 'about', route: '/' },
    { item: 'contact', route: '/pricing' },
    { item: 'properties', route: '/features' },
  ];
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        justifyItems: 'center',
        padding: `${theme.spacing(1)} 7.1%`,
        backgroundColor: theme.palette.primary.main,
        columnGap: theme.spacing(2),
        color: theme.common.primaryDark,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          columnGap: 0.6,
          alignItems: 'center',
        }}
      >
        <Image
          src="/logo_white.png"
          alt="Hope Home icon"
          height={60}
          width={60}
        />
        <Typography variant="h4" color="white">
          Hope Home
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: theme.spacing(4),
        }}
      >
        {navItems.map(({ item, route }, index) => (
          <NavItem item={item} route={route} key={index} />
        ))}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: theme.spacing(2),
        }}
      >
        <Button
          variant="text"
          color="inherit"
          size="small"
          sx={{ textTransform: 'none', color: 'white' }}
          startIcon={<Language />}
          onClick={() => {
            languageDispatch({
              type: activeLanguage === 'En' ? 'USE_FRENCH' : 'USE_ENGLISH',
            });
          }}
        >
          {formatMessage({
            id: activeLanguage === 'En' ? 'english' : 'french',
          })}
        </Button>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            alignItems: 'center',
            columnGap: 0.3,
            color: 'white',
          }}
        >
          <NavItem item={'login'} route={'/signin'} />
          / <NavItem item={'signup'} route={'/signup'} />
        </Box>
      </Box>
    </Box>
  );
}

import { theme, useLanguage } from '@hopehome/theme';
import { Language, MenuOutlined } from '@mui/icons-material';
import { Box, Button, Drawer, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useIntl } from 'react-intl';

interface INavItem {
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

function SideNav({
  open,
  close,
  navItems,
}: {
  close: () => void;
  open: boolean;
  navItems: INavItem[];
}) {
  const { formatMessage } = useIntl();
  const { activeLanguage, languageDispatch } = useLanguage();

  return (
    <Drawer
      anchor={'right'}
      open={open}
      onClose={close}
      sx={{
        '& .MuiPaper-root': {
          padding: 2,
          backgroundColor: theme.palette.primary.light,
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          rowGap: 4,
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
            height={40}
            width={40}
          />
          <Typography variant="h6" color="white">
            Hope Home
          </Typography>
        </Box>

        <Box
          sx={{
            height: '100%',
            gridTemplateRows: '1fr auto',
            display: 'grid',
            rowGap: 2,
            justifyItems: 'left',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              rowGap: theme.spacing(4),
              alignContent: 'start',
            }}
          >
            {navItems.map(({ item, route }, index) => (
              <NavItem item={item} route={route} key={index} />
            ))}
          </Box>
          <Box
            sx={{
              display: 'grid',
              rowGap: theme.spacing(2),
            }}
          >
            <Button
              variant="text"
              color="inherit"
              size="small"
              sx={{
                textTransform: 'none',
                color: 'white',
                ...theme.typography.body1,
              }}
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
      </Box>
    </Drawer>
  );
}

export default function Navbar() {
  const { formatMessage } = useIntl();
  const { activeLanguage, languageDispatch } = useLanguage();

  const navItems: INavItem[] = [
    { item: 'about', route: '/' },
    { item: 'contact', route: '/pricing' },
    { item: 'properties', route: '/features' },
  ];

  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);
  return (
    <>
      <SideNav
        close={() => setIsSideNavOpen(false)}
        open={isSideNavOpen}
        navItems={navItems}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          alignItems: 'center',
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
            display: {
              mobile: 'none',
              desktop: 'grid',
            },
            gridTemplateColumns: '1fr auto',
            columnGap: 2,
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
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
              sx={{
                textTransform: 'none',
                color: 'white',
                ...theme.typography.body1,
              }}
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
        <Button
          startIcon={<MenuOutlined />}
          onClick={() => setIsSideNavOpen(true)}
          variant="text"
          color="inherit"
          sx={{
            color: 'white',
            justifySelf: 'end',
            '& .MuiButton-startIcon': {
              margin: 0,
            },
            '& .MuiSvgIcon-root': {
              fontSize: '30px !important',
            },
            display: {
              mobile: 'block',
              desktop: 'none',
            },
          }}
        />
      </Box>
    </>
  );
}

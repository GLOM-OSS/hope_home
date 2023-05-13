import { theme } from '@hopehome/theme';
import {
  CallOutlined,
  EmailOutlined,
  Facebook,
  Instagram,
  WhatsApp,
} from '@mui/icons-material';
import { Box, Divider, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

export default function Footer() {
  const { formatMessage } = useIntl();
  const { push } = useRouter();

  return (
    <Box
      sx={{
        backgroundColor: 'black',
        color: 'white',
        display: 'grid',
        padding: `${theme.spacing(1)} 7.1%`,
        rowGap: 3,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            desktop: '2fr 4fr',
            mobile: '1fr',
          },
          alignItems: 'start',
          rowGap: 6,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            columnGap: 0.6,
            alignItems: 'center',
            cursor: 'pointer',
            justifyContent: {
              desktop: 'start',
              mobile: 'center',
            },
            marginTop: 3,
          }}
          onClick={() => push('/')}
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
            gridTemplateColumns: {
              desktop: '1fr 1fr 1fr',
              moble: '1fr',
            },
            rowGap: 5,
          }}
        >
          <Box sx={{ display: 'grid', rowGap: 1, alignItems: 'start' }}>
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              <Typography>{formatMessage({ id: 'ourPages' })}</Typography>
              <Divider
                orientation="horizontal"
                sx={{ backgroundColor: 'grey' }}
              />
            </Box>
            <Box
              sx={{
                // borderTop: '2px solid grey',
                paddingTop: 1,
                display: 'grid',
                rowGap: 1,
              }}
            >
              {[
                { route: '', title: 'aboutUs' },
                { route: '', title: 'contactUs' },
                { route: '', title: 'shop' },
                { route: '', title: 'registerNow' },
              ].map(({ title }, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ cursor: 'pointer' }}
                >
                  {formatMessage({ id: title })}
                </Typography>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'grid', rowGap: 1, alignItems: 'start' }}>
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              <Typography>
                {formatMessage({ id: 'ourCollaborators' })}
              </Typography>
              <Divider
                orientation="horizontal"
                sx={{ backgroundColor: 'grey' }}
              />
            </Box>
          </Box>
          <Box
            sx={{ display: 'grid', rowGap: 1, gridTemplateRows: 'auto 1fr' }}
          >
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              <Typography>{formatMessage({ id: 'followUs' })}</Typography>
              <Divider
                orientation="horizontal"
                sx={{ backgroundColor: 'grey' }}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateRows: 'auto 1fr' }}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 1,
                  gridTemplateColumns: 'auto auto auto 1fr',
                  mb: 5,
                }}
              >
                {[WhatsApp, Facebook, Instagram].map((Icon, index) => (
                  <Icon fontSize="medium" key={index} />
                ))}
              </Box>
              <Box sx={{ alignSelf: 'end', display: 'grid', rowGap: 1 }}>
                {[
                  { Icon: CallOutlined, title: '+237 699 999 999' },
                  { Icon: EmailOutlined, title: 'hopehome@gmail.com' },
                ].map(({ Icon, title }, index) => (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      columnGap: 1,
                      alignItems: 'center',
                    }}
                    key={index}
                  >
                    <Icon />
                    <Typography variant="body2">{title}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            desktop: '1fr auto',
            mobile: 'auto',
          },
          mt: 4,
          columnGap: 1,
          rowGap: 1,
          justifyItems: {
            desktop: 'start',
            mobile: 'center',
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'grey',
            textAlign: 'center',
            marginBottom: {
              mobile: '8px',
            },
          }}
        >
          &copy;
          {` ${new Date().getFullYear()} SCI Hope Home. ${formatMessage({
            id: 'allRightsReserved',
          })}`}
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey' }}>
          {formatMessage({ id: 'designedBy' })}
        </Typography>
      </Box>
    </Box>
  );
}

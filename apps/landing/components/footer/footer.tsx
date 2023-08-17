import { theme } from '@hopehome/theme';
import {
  CallOutlined,
  EmailOutlined,
  Facebook,
  LinkedIn,
  Twitter,
  WhatsApp,
} from '@mui/icons-material';
import { Box, Divider, Tooltip, Typography } from '@mui/material';
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
                paddingTop: 1,
                display: 'grid',
                rowGap: 1,
              }}
            >
              {[
                { route: '/about', title: 'aboutUs' },
                { route: '/contact', title: 'contactUs' },
                { route: '/properties', title: 'shop' },
                { route: '/signup', title: 'registerNow' },
              ].map(({ title, route }, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => push(route)}
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
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto auto 1fr',
                  columnGap: 2,
                  mt: 2,
                  alignItems: 'center',
                }}
              >
                <Tooltip arrow title="Innov BTP">
                  <Image
                    src="/innov_btp_logo.png"
                    alt="Innov BTP"
                    width={100}
                    height={93}
                  />
                </Tooltip>
                <Tooltip arrow title="Hope Investment Fund">
                  <Image
                    src="/hope_investment_fund_logo.png"
                    alt="Innov BTP"
                    width={125}
                    height={62.1}
                  />
                </Tooltip>
              </Box>
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
                {[
                  {
                    Icon: Facebook,
                    tooltip: 'Facebook',
                    color: '#1877F2',
                    link: 'https://www.facebook.com/profile.php?id=100064106312785&mibextid=ZbWKwL',
                  },
                  {
                    Icon: WhatsApp,
                    tooltip: 'WhatsApp',
                    color: '#075E54',
                    link: 'https://wa.me/237694248972',
                  },
                  {
                    Icon: Twitter,
                    tooltip: 'Twitter',
                    color: '#1DA1F2',
                    link: 'https://www.facebook.com/profile.php?id=100064106312785&mibextid=ZbWKwL',
                  },
                  {
                    Icon: LinkedIn,
                    tooltip: 'LinkedIn',
                    color: '#0072b1',
                    link: 'https://www.facebook.com/profile.php?id=100064106312785&mibextid=ZbWKwL',
                  },
                ].map(({ Icon, tooltip, color, link }, index) => (
                  <Tooltip arrow title={tooltip} key={index}>
                    <Icon
                      fontSize="medium"
                      onClick={() => push(link)}
                      sx={{
                        '&:hover': {
                          color: color,
                        },
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
              <Box sx={{ alignSelf: 'end', display: 'grid', rowGap: 1 }}>
                {[
                  { Icon: CallOutlined, title: '+237 694 248 972' },
                  {
                    Icon: EmailOutlined,
                    title: 'hopehome694@gmail.com',
                    subject: 'mailto:hopehome694@gmail.com',
                  },
                ].map(({ Icon, title, subject }, index) => (
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
                    {subject ? (
                      <Typography
                        variant="body2"
                        component={'a'}
                        href={subject}
                      >
                        {title}
                      </Typography>
                    ) : (
                      <Typography variant="body2">{title}</Typography>
                    )}
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

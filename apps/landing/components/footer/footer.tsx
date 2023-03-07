import { theme } from '@hopehome/theme';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

interface IFooterItem {
  header: string;
  children: { title: string; route: string }[];
}

function FooterGroup({ group: { header, children } }: { group: IFooterItem }) {
  const { formatMessage } = useIntl();
  return (
    <Box sx={{ display: 'grid', rowGap: 1 }}>
      <Typography>{formatMessage({ id: header })}</Typography>
      <Box
        sx={{
          borderTop: '2px solid grey',
          paddingTop: 1,
          display: 'grid',
          rowGap: 1,
        }}
      >
        {children.map(({ title }, index) => (
          <Typography key={index} variant="body2" sx={{ cursor: 'pointer' }}>
            {formatMessage({ id: title })}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default function Footer() {
  const { formatMessage } = useIntl();
  const { push } = useRouter();

  const footerItems: IFooterItem[] = [
    {
      header: 'shop',
      children: [
        {
          route: '',
          title: 'shopAll',
        },
        {
          route: '',
          title: 'viewRentals',
        },
      ],
    },
    {
      header: 'about',
      children: [
        {
          route: '',
          title: 'aboutUs',
        },
        {
          route: '',
          title: 'myAccount',
        },
        {
          route: '',
          title: 'contactUs',
        },
        {
          route: '',
          title: 'registerNow',
        },
      ],
    },
    {
      header: 'customerCare',
      children: [
        {
          route: '',
          title: 'faqs',
        },
        {
          route: '',
          title: 'customerSupport',
        },
      ],
    },
    {
      header: 'miscellaneous',
      children: [
        {
          route: '',
          title: 'termsAndConditions',
        },
        {
          route: '',
          title: 'privacyPolicy',
        },
      ],
    },
  ];

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
            desktop: 'auto auto auto auto',
            mobile: 'auto auto',
          },
          alignItems: 'start',
          columnGap: 7,
          rowGap: 6,
        }}
      >
        {footerItems.map((group, index) => (
          <FooterGroup group={group} key={index} />
        ))}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            desktop: '1fr auto',
            mobile: 'auto',
          },
          columnGap: 1,
          rowGap: 1,
          justifyItems: {
            desktop: 'start',
            mobile: 'center',
          },
        }}
      >
        <Typography variant="body2" sx={{ color: 'grey' }}>
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

import { theme } from '@hopehome/theme';
import {
  ComputerOutlined,
  MapsHomeWorkOutlined,
  VpnKeyOutlined,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

interface IPerkItem {
  icon: JSX.Element;
  isComingSoon: boolean;
  title: string;
  message: string;
}

function PerkItem({
  item: { icon, isComingSoon, message, title },
}: {
  item: IPerkItem;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box
      sx={{
        borderTop: `1px solid ${!isComingSoon ? '#009C7D' : 'grey'}`,
        padding: '40px 9.79%',
        paddingTop: 3,
        display: 'grid',
        borderRadius: '5px',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        rowGap: 2,
        backgroundColor: !isComingSoon ? 'rgba(204, 235, 229, 0.1)' : 'initial',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          columnGap: 1,
          alignItems: 'center',
        }}
      >
        {icon}
        {isComingSoon && (
          <Typography sx={{ color: theme.palette.secondary.main }}>
            {formatMessage({ id: 'comingSoon' })}
          </Typography>
        )}
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: '400',
          fontSize: {
            desktop: theme.typography.h6.fontSize,
            mobile: '1.1rem',
          },
        }}
      >
        {formatMessage({
          id: title,
        })}
      </Typography>
      <Typography sx={{ fontWeight: '400' }}>{message}</Typography>
    </Box>
  );
}

export default function InfoSection() {
  const { formatMessage } = useIntl();

  const perks: IPerkItem[] = [
    {
      icon: (
        <ComputerOutlined
          fontSize="large"
          sx={{ color: 'white', fontSize: '80px' }}
        />
      ),
      isComingSoon: true,
      message: `Accept applications, process rent payments online, and sign digital
      leases all powered on a single platform.`,
      title: 'hundredPercentLeaseOnline',
    },
    {
      icon: (
        <MapsHomeWorkOutlined
          fontSize="large"
          sx={{ color: 'white', fontSize: '80px' }}
        />
      ),
      isComingSoon: false,
      message: `Connect with more than 75 million renters looking for new homes using our comprehensive marketing platform.`,
      title: 'advertiseYourRental',
    },
    {
      icon: (
        <VpnKeyOutlined
          fontSize="large"
          sx={{ color: 'white', fontSize: '80px' }}
        />
      ),
      isComingSoon: true,
      message: `Stay up-to-date using our tips and guides on rent payments, leasing, management solutions, and more.`,
      title: 'propertyManagerResources',
    },
  ];
  return (
    <Box
      sx={{
        margin: {
          desktop: '0 1.4%',
          mobile: 0,
        },
        backgroundColor: '#00100C',
        padding: {
          desktop: '80px 5.7%',
          mobile: '40px 0',
        },
        color: 'white',
        display: 'grid',
        rowGap: 7,
      }}
    >
      <Box>
        <Typography sx={{ textAlign: 'center' }} variant="h4">
          {formatMessage({ id: 'yourMostIdealSolutions' })}
        </Typography>
        <Typography
          variant="h6"
          fontWeight={400}
          textAlign="center"
          sx={{
            fontSize: {
              desktop: theme.typography.h6.fontSize,
              mobile: '1.1rem',
            },
          }}
        >
          {formatMessage({ id: 'infoSectionSubTitle' })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            desktop: '1fr 1fr 1fr',
            mobile: '1fr',
          },
          columnGap: 7,
        }}
      >
        {perks.map((item, index) => (
          <PerkItem item={item} key={index} />
        ))}
      </Box>
    </Box>
  );
}

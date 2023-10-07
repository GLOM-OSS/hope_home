import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import AboutUsImage from '../../public/about_us.png';
import { theme } from '@hopehome/theme';

export default function AboutSection() {
  const { formatMessage } = useIntl();
  return (
    <Box sx={{ display: 'grid', rowGap: 2 }}>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {formatMessage({ id: 'about' })}
      </Typography>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h6"
          fontWeight="400"
          data-aos="fade-up"
          sx={{
            fontSize: {
              desktop: theme.typography.h6.fontSize,
              mobile: '1.1rem',
            },
          }}
        >
          {formatMessage({ id: 'ourTeamText1' })}
        </Typography>
        <Typography
          variant="h6"
          fontWeight="400"
          data-aos="fade-up"
          sx={{
            fontSize: {
              desktop: theme.typography.h6.fontSize,
              mobile: '1.1rem',
            },
          }}
        >
          {formatMessage({ id: 'ourTeamText2' })}
        </Typography>
        <Typography
          variant="h6"
          fontWeight="400"
          data-aos="fade-up"
          sx={{
            fontSize: {
              desktop: theme.typography.h6.fontSize,
              mobile: '1.1rem',
            },
          }}
        >
          {formatMessage({ id: 'ourTeamText3' })}
        </Typography>
      </Box>
      <Image
        src={AboutUsImage}
        alt="Enterprise image"
        style={{ width: '100%', objectFit: 'cover' }}
      />
    </Box>
  );
}

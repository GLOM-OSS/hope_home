import { IHHProperty } from '@hopehome/interfaces';
import { theme } from '@hopehome/theme';
import { EastOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Scrollbars from 'rc-scrollbars';
import { useIntl } from 'react-intl';
import PropertyCard from './propertyCard';

export default function PropertySection({
  properties,
}: {
  properties: IHHProperty[];
}) {
  const { formatMessage } = useIntl();
  const { push } = useRouter();

  return (
    <Box
      id="property-section"
      sx={{ padding: `0 7.1%`, display: 'grid', rowGap: 3 }}
    >
      <Box data-aos='fade-up'>
        <Typography
          variant="h1"
          textAlign="center"
          sx={{
            fontSize: {
              mobile: '2rem',
              desktop: '3rem',
            },
          }}
        >
          {formatMessage({ id: 'exploreRecentProperties' })}
        </Typography>
        <Typography
          textAlign="center"
          variant="h6"
          fontWeight={400}
          sx={{
            fontSize: {
              desktop: theme.typography.h6.fontSize,
              mobile: '1.1rem',
            },
          }}
        >
          {formatMessage({ id: 'exploreHomesText' })}
        </Typography>
      </Box>
      <Scrollbars
        universal
        autoHide
        style={{ height: `${properties.length === 0 ? 71 : 557}px` }}
      >
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            justifyContent: {
              desktop: 'center',
              mobile: 'start',
            },
            columnGap: 2,
            alignContent: 'center',
          }}
        >
          {properties.length === 0 ? (
            <Typography sx={{ textAlign: 'center' }} variant="h4">
              {formatMessage({ id: 'noPropertiesToDisplay' })}
            </Typography>
          ) : (
            properties.map((property, index) => (
              <PropertyCard property={property} key={index} />
            ))
          )}
        </Box>
      </Scrollbars>
      {properties.length > 0 && (
        <Button
          color="primary"
          variant="contained"
          disableElevation
          endIcon={<EastOutlined />}
          sx={{ justifySelf: 'center', textTransform: 'none' }}
          size="large"
          onClick={() => push('/properties')}
        >
          {formatMessage({ id: 'viewMore' })}
        </Button>
      )}
    </Box>
  );
}

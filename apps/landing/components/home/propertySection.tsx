import { IHHProperty } from '@hopehome/interfaces';
import { EastOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useIntl } from 'react-intl';
import PropertyCard from './propertyCard';

export default function PropertySection({
  properties,
}: {
  properties: IHHProperty[];
}) {
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ padding: `0 7.1%`, display: 'grid', rowGap: 3 }}>
      <Box>
        <Typography variant="h1" textAlign="center">
          {formatMessage({ id: 'exploreRecentProperties' })}
        </Typography>
        <Typography textAlign="center" variant="h6" fontWeight={400}>
          Take a deep dive and browse homes for sale, original neighborhood
          photos, resident revies and local insights to find what is right for
          you.
        </Typography>
      </Box>
      <Scrollbars universal autoHide style={{ height: '557px' }}>
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
          {properties.map((property, index) => (
            <PropertyCard property={property} key={index} />
          ))}
        </Box>
      </Scrollbars>
      <Button
        color="primary"
        variant="contained"
        disableElevation
        endIcon={<EastOutlined />}
        sx={{ justifySelf: 'center', textTransform: 'none' }}
        size="large"
      >
        {formatMessage({ id: 'viewMore' })}
      </Button>
    </Box>
  );
}

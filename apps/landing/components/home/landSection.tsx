import { IHHProperty } from '@hopehome/interfaces';
import { theme } from '@hopehome/theme';
import { EastOutlined } from '@mui/icons-material';
import { Box, Button, lighten, Typography } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useIntl } from 'react-intl';
import PropertyCard from './propertyCard';
import { useRouter } from 'next/router';

export default function LandSection({
  properties,
}: {
  properties: IHHProperty[];
}) {
  const { formatMessage } = useIntl();
  const { push } = useRouter();

  return (
    <Box
      sx={{
        padding: `40px 7.1%`,
        display: 'grid',
        rowGap: 4,
        backgroundColor: lighten(theme.palette.primary.main, 0.95),
      }}
    >
      <Box>
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
          {formatMessage({ id: 'exploreLands' })}
        </Typography>
        <Typography textAlign="center" variant="h6" fontWeight={400}>
          {formatMessage({ id: 'exploreLandsText' })}
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
        onClick={() => push('/properties')}
      >
        {formatMessage({ id: 'viewMore' })}
      </Button>
    </Box>
  );
}

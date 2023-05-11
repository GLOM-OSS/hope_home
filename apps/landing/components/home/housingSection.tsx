import { IHHProperty } from '@hopehome/interfaces';
import { EastOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useIntl } from 'react-intl';
import PropertyCard from './propertyCard';
import { useRouter } from 'next/router';

export default function HousingSection({
  properties,
}: {
  properties: IHHProperty[];
}) {
  const { formatMessage } = useIntl();
  const { push } = useRouter();

  return (
    <Box sx={{ padding: `0 7.1%`, display: 'grid', rowGap: 3 }}>
      <Box>
        <Typography variant="h1" textAlign="center">
          {formatMessage({ id: 'exploreHomes' })}
        </Typography>
        <Typography textAlign="center" variant="h6" fontWeight={400}>
          {formatMessage({ id: 'exploreHomesText' })}
        </Typography>
      </Box>
      <Scrollbars universal autoHide style={{ height: '657px' }}>
        <Box
          sx={{
            display: 'grid',
            justifyItems: 'start',
            justifyContent: 'center',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 350px))',
            columnGap: 2,
            rowGap: 2,
          }}
        >
          {properties.map((property, index) => (
            <PropertyCard property={property as IHHProperty} key={index} />
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
        {formatMessage({ id: 'viewAll' })}
      </Button>
    </Box>
  );
}

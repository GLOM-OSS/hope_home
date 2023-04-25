import { IHHProperty } from '@hopehome/interfaces';
import { Box, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useIntl } from 'react-intl';
import PropertyCard from '../../components/home/propertyCard';
import Navbar from '../../components/navbar/secondary_nav/navbar';
import { getProperties } from '../../services/property.service';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const accessToken = context.req.cookies['Bearer'];
    const properties = await getProperties(accessToken);
    return {
      props: {
        properties,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default function Properties({
  properties,
}: {
  properties: IHHProperty[];
}) {
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ mt: 4, padding: `0 7.1%`, mb: 2, display: 'grid', rowGap: 2 }}>
      <Navbar active="/properties" />
      <Typography variant="h4">
        {formatMessage({ id: 'AllHopeHomeProperties' })}
      </Typography>
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
    </Box>
  );
}

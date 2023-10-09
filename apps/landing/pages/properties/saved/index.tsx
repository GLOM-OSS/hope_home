import { IHHProperty } from '@hopehome/interfaces';
import { Box, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropertyCard from '../../../components/home/propertyCard';
import Navbar from '../../../components/navbar/secondary_nav/navbar';
import { useUser } from '../../../contexts/user.provider';
import { getProperties } from '../../../services/property.service';

export const getServerSideProps: GetServerSideProps = async ({
  req: { headers },
}) => {
  try {
    const properties = await getProperties({}, headers.cookie);
    return {
      props: { properties: properties.filter((_) => _.is_liked) },
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
  const {
    activeUser: { person_id: p_id },
  } = useUser();
  const { push } = useRouter();
  useEffect(() => {
    if (!p_id) push('/properties');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ mt: 4, padding: 2, mb: 2, display: 'grid', rowGap: 2 }}>
      <Navbar active="/properties/saved" />
      <Typography
        variant="h6"
        sx={{
          padding: {
            tablet: '0 15%',
          },
        }}
      >
        {formatMessage({ id: 'savedProperties' })}
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

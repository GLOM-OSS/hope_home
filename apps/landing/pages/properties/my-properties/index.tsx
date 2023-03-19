import { IHHProperty } from '@hopehome/interfaces';
import { Box, Button, Typography } from '@mui/material';
import PropertyCard from '../../../components/home/propertyCard';
import { GetServerSideProps } from 'next';
import Navbar from '../../../components/navbar/secondary_nav/navbar';
import { useIntl } from 'react-intl';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    //CALL API HERE TO LOAD MY PROPERTIES
    const properties = [
      {
        address:
          'Rue de Palmiers Nkolmesseng - Yaounde Rue de Palmiers Nkolmesseng - Yaounde',
        area: 900,
        description: '',
        image_ref: '/hero_background.png',
        latitude: 0,
        listing_reason: 'Rent',
        longitude: 0,
        price: 500000,
        property_id: 'make_it_rain',
        property_type: 'Home',
        publisher_details: {
          created_at: new Date().getTime(),
          email: '',
          fullname: 'Kimbi Boston Tanyi',
          person_id: 'soekls',
          preferred_lang: 'en',
          roles: [],
          whatsapp_number: '237657140183',
          gender: 'Male',
          phone_number: '237657140183',
          profile_image_ref: '/logo.png',
        },
      },
      {
        address:
          'Rue de Palmiers Nkolmesseng - Yaounde Rue de Palmiers Nkolmesseng - Yaounde',
        area: 900,
        description: '',
        image_ref: '/hero_background.png',
        latitude: 0,
        listing_reason: 'Rent',
        longitude: 0,
        price: 500000,
        property_id: 'make_it_rain',
        property_type: 'Home',
        publisher_details: {
          created_at: new Date().getTime(),
          email: '',
          fullname: 'Kimbi Boston Tanyi',
          person_id: 'soekls',
          preferred_lang: 'en',
          roles: [],
          whatsapp_number: '237657140183',
          gender: 'Male',
          phone_number: '237657140183',
          profile_image_ref: '/logo.png',
        },
      },
    ];
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

  const getGPSLocation = async (position) => {
    alert(position.coords.longitude);
  };

  const handleAccept = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getGPSLocation);
    }
  };

  return (
    <Box sx={{ mt: 4, padding: `0 7.1%`, mb: 2, display: 'grid', rowGap: 2 }}>
      <Navbar active="my-properties" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          columnGap: 2,
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">
          {formatMessage({ id: 'myPostedProperties' })}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ textTransform: 'none' }}
          onClick={handleAccept}
        >
          {formatMessage({ id: 'newPost' })}
        </Button>
      </Box>
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
          <PropertyCard
            property={property as IHHProperty}
            key={index}
            canDelete
          />
        ))}
      </Box>
    </Box>
  );
}

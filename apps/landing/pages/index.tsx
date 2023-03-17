import { IHHProperty, RoleEnum } from '@hopehome/interfaces';
import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import AboutSection from '../components/home/about';
import HeroSection from '../components/home/heroSection';
import HousingSection from '../components/home/housingSection';
import InfoSection from '../components/home/infoSection';
import LandSection from '../components/home/landSection';
import OurMissions from '../components/home/ourMissions';
import PropertySection from '../components/home/propertySection';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    //CALL API HERE TO LOAD PROPERTIES (recent, land, housing)
    const properties: IHHProperty[] = [
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
          role: RoleEnum.CLIENT,
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
          role: RoleEnum.CLIENT,
          whatsapp_number: '237657140183',
          gender: 'Male',
          phone_number: '237657140183',
          profile_image_ref: '/logo.png',
        },
      },
    ];
    return {
      props: {
        land: properties,
        recent: properties,
        housing: properties,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export function Index({
  land,
  recent,
  housing,
}: {
  land: IHHProperty[];
  recent: IHHProperty[];
  housing: IHHProperty[];
}) {
  return (
    <Box sx={{ display: 'grid', rowGap: 7 }}>
      <HeroSection />
      <PropertySection properties={recent} />
      <InfoSection />
      <HousingSection properties={housing} />
      <LandSection properties={land} />
      <Box sx={{ padding: `0 7.1%`, display: 'grid', rowGap: 7 }}>
        <OurMissions />
        <AboutSection />
      </Box>
    </Box>
  );
}

export default Index;

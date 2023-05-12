import { IHHProperty } from '@hopehome/interfaces';
import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import { toast } from 'react-toastify';
import AboutSection from '../components/home/about';
import HeroSection from '../components/home/heroSection';
import HousingSection from '../components/home/housingSection';
import InfoSection from '../components/home/infoSection';
import LandSection from '../components/home/landSection';
import OurMissions from '../components/home/ourMissions';
import PropertySection from '../components/home/propertySection';
import { getProperties } from '../services/property.service';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const accessToken = context.req.cookies['__hht'];
    const properties = await getProperties(accessToken);
    return {
      props: {
        recent: properties.splice(0, 5),
        land: properties.filter((_) => _.property_type === 'Land'),
        housing: properties.filter((_) => _.listing_reason === 'Rent'),
      },
    };
  } catch (error) {
    toast.error(error.message || "Oops, une erreur s'est produite.");
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
      {housing.length > 0 && <HousingSection properties={housing} />}
      {land.length > 0 && <LandSection properties={land} />}
      <Box sx={{ padding: `0 7.1%`, display: 'grid', rowGap: 7 }}>
        <OurMissions />
        <AboutSection />
      </Box>
    </Box>
  );
}

export default Index;

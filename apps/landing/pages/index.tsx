import { IHHProperty } from '@hopehome/interfaces';
import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AboutSection from '../components/home/about';
import HeroSection from '../components/home/heroSection';
import HousingSection from '../components/home/housingSection';
import InfoSection from '../components/home/infoSection';
import LandSection from '../components/home/landSection';
import OurServices from '../components/home/ourServices';
import PropertySection from '../components/home/propertySection';
import { getProperties, searchProperties } from '../services/property.service';

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
  const [recentProperties, setRecentProperties] = useState(recent);

  const searchPropertiesHandler = (keywords: string) => {
    searchProperties(keywords)
      .then((properties) => {
        setRecentProperties(properties);
        const propertySectionElement =
          document.getElementById('property-section');
        propertySectionElement?.scrollIntoView();
      })
      .catch((error) => {
        toast.error(
          error.message.toString() || "Oops, une erreur s'est produite."
        );
      });
  };

  return (
    <Box sx={{ display: 'grid', rowGap: 7 }}>
      <HeroSection searchHandler={searchPropertiesHandler} />
      <PropertySection properties={recentProperties} />
      <InfoSection />
      {housing.length > 0 && <HousingSection properties={housing} />}
      {land.length > 0 && <LandSection properties={land} />}
      <Box sx={{ padding: `0 7.1%`, display: 'grid', rowGap: 7 }}>
        <OurServices />
        {/* <OurMissions /> */}
        <AboutSection />
      </Box>
    </Box>
  );
}

export default Index;

import { Box } from '@mui/material';
import { injectIntl, IntlShape } from 'react-intl';
import AboutSection from '../components/home/about';
import HeroSection from '../components/home/heroSection';
import InfoSection from '../components/home/infoSection';
import OurMissions from '../components/home/ourMissions';

export function Index({ intl }: { intl: IntlShape }) {
  return (
    <Box sx={{ display: 'grid', rowGap: 7 }}>
      <HeroSection />
      <InfoSection />
      <Box sx={{ padding: `0 7.1%`, display: 'grid', rowGap: 7 }}>
        <OurMissions />
        <AboutSection />
      </Box>
    </Box>
  );
}

export default injectIntl(Index);

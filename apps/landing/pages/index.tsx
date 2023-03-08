import { Box } from '@mui/material';
import { injectIntl, IntlShape } from 'react-intl';
import AboutSection from '../components/home/about';
import InfoSection from '../components/home/infoSection';
import OurMissions from '../components/home/ourMissions';

export function Index({ intl }: { intl: IntlShape }) {
  return (
    <Box sx={{ display: 'grid', rowGap: 7 }}>
      <InfoSection />
      <Box sx={{ padding: `0 7.1%` }}>
        <OurMissions />
        <AboutSection />
      </Box>
    </Box>
  );
}

export default injectIntl(Index);

import { Box } from '@mui/material';
import { injectIntl, IntlShape } from 'react-intl';
import AboutSection from '../components/home/about';
import OurMissions from '../components/home/ourMissions';
export function Index({ intl }: { intl: IntlShape }) {
  return (
    <Box sx={{ display: 'grid', rowGap: 7 }}>
      <OurMissions />
      <AboutSection />
    </Box>
  );
}

export default injectIntl(Index);

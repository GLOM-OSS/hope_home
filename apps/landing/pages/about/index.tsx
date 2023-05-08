import { theme } from '@hopehome/theme';
import { AutoStoriesOutlined, BlockOutlined } from '@mui/icons-material';
import { Box, Divider, lighten, Typography } from '@mui/material';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import AboutUsImage from '../../public/about_us.png';
import AdvantagesImage from '../../public/advantages_image.png';

interface IAdvantage {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function AdvantageCard({
  advantage: { description, icon, title },
}: {
  advantage: IAdvantage;
}) {
  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          columnGap: 1,
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: lighten(theme.palette.primary.main, 0.8),
            padding: 0.8,
            borderRadius: '100%',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight={500}>
          {title}
        </Typography>
      </Box>
      <Typography fontWeight={300}>{description}</Typography>
    </Box>
  );
}

export default function About() {
  const { formatMessage } = useIntl();

  const advantages: IAdvantage[] = [
    {
      icon: <AutoStoriesOutlined color="primary" fontSize="large" />,
      description: formatMessage({ id: 'mission1' }),
      title: formatMessage({ id: 'missionTitle1' }),
    },
    {
      icon: <BlockOutlined color="primary" fontSize="large" />,
      description: formatMessage({ id: 'mission2' }),
      title: formatMessage({ id: 'missionTitle2' }),
    },
  ];
  return (
    <Box sx={{ mt: 4, padding: `0 7.1%`, mb: 2 }}>
      <Box sx={{ display: 'grid', rowGap: 3 }}>
        <Typography variant="h4">{formatMessage({ id: 'aboutUs' })}</Typography>
        <Typography variant="h6" fontWeight={400}>
          {formatMessage({ id: 'aboutUsSummary' })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            desktop: '1fr 1fr',
            tablet: '1fr',
          },
          rowGap: 2,
          columnGap: 2,
          mt: 10,
        }}
      >
        <Box>
          <Divider sx={{ backgroundColor: 'black' }} />
          <Typography variant="h5" fontWeight={500} mt={3}>
            {formatMessage({ id: 'aboutOurTeam' })}
          </Typography>
          <Typography mt={2} textAlign="justify">
            {formatMessage({ id: 'ourTeamText1' })}
          </Typography>
          <Typography mt={2} textAlign="justify">
            {formatMessage({ id: 'ourTeamText2' })}
          </Typography>
          <Typography mt={4} textAlign="justify">
            {formatMessage({ id: 'ourTeamText3' })}
          </Typography>
        </Box>
        <Image
          src={AboutUsImage}
          alt="Enterprise image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            desktop: '1fr 1fr',
            tablet: '1fr',
          },
          rowGap: 2,
          columnGap: 2,
          mt: 10,
        }}
      >
        <Image
          src={AdvantagesImage}
          alt="Enterprise image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box>
          <Divider sx={{ backgroundColor: 'black' }} />
          <Typography variant="h5" fontWeight={500} mt={3}>
            {formatMessage({ id: 'ourMissions' })}
          </Typography>
          <Typography mt={2} textAlign="justify">
            {formatMessage({ id: 'ourMissionText' })}
          </Typography>
          <Box mt={4} sx={{ display: 'grid', rowGap: 2 }}>
            {advantages.map((advantage, index) => (
              <AdvantageCard advantage={advantage} key={index} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

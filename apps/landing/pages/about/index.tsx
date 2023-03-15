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
      description: `For every stage of the DevOps Lifecy for the Eliminate point solution tool sprawl with our comprehensive`,
      title: 'Small business',
    },
    {
      icon: <BlockOutlined color="primary" fontSize="large" />,
      description: `For every stage of the DevOps Lifecy for the Eliminate point solution tool sprawl with our comprehensive`,
      title: 'Large business',
    },
  ];
  return (
    <Box sx={{ mt: 4, padding: `0 7.1%`, mb: 2 }}>
      <Box sx={{ display: 'grid', rowGap: 3 }}>
        <Typography variant="h4">{formatMessage({ id: 'aboutUs' })}</Typography>
        <Typography variant="h6" fontWeight={400}>
          Take a deep dive and browse homes for sale, original neighborhood
          photos, resident reviews
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
            Hi, original neighborhood photos, resident re, original neighborhood
            photos, resident.,Hi, original neighborhood photos, resident re,
            original neighborhood photos, resident. In arcu risus vestibulum
            sollicitudin elit sed sed convallis tincidunt. Risus turpis hac
            metus facilisi ut enim massa eu. Dolor suscipit sit velit massa
            adipiscing adipiscing vulputate feugiat turpis. Fames sed ut
            dignissim tincidunt metus. Morbi varius quis enim gravida.
          </Typography>
          <Typography mt={4} textAlign="justify">
            Hi, original neighborhood photos, resident re, original neighborhood
            photos, resident.,Hi, original neighborhood photos, resident re,
            original neighborhood photos, resident. In arcu risus vestibulum
            sollicitudin elit sed sed convallis tincidunt. Risus turpis hac
            metus facilisi ut enim massa eu. Dolor suscipit sit velit massa
            adipiscing adipiscing vulputate feugiat turpis. Fames sed ut
            dignissim tincidunt metus. Morbi varius quis enim gravida.
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
            {formatMessage({ id: 'ourAdvantages' })}
          </Typography>
          <Typography mt={2} textAlign="justify">
            Hi, original neighborhood photos, resident re, original neighborhood
            photos, resident.,Hi, original neighborhood photos, resident re,
            original neighborhood photos, resident. In arcu risus vestibulum{' '}
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

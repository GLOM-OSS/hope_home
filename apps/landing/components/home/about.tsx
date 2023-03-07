import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import AboutUsImage from '../../public/about_us.png';

export default function AboutSection() {
  const { formatMessage } = useIntl();
  return (
    <Box sx={{ display: 'grid', rowGap: 2 }}>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {formatMessage({ id: 'about' })}
      </Typography>
      <Box>
        <Typography textAlign="justify" variant="h6" fontWeight="400">
          sit amet consectetur. In arcu risus vestibulum sollicitudin elit sed
          sed convallis tincidunt. Risus turpis hac metus facilisi ut enim massa
        </Typography>
        <Typography textAlign="justify" variant="h6" fontWeight="400">
          sit amet consectetur. In arcu risus vestibulum sollicitudin elit sed
          sed convallis tincidunt. Risus turpis hac metus facilisi ut enim massa
          eu. Dolor suscipit sit velit massa adipiscing adipiscing vulputate
          feugiat turpis. Fames sed ut dignissim tincidunt metus. Morbi varius
          quis enim gravida., sit amet consectetur. In arcu risus vestibulum
          sollicitudin elit sed sed convallis tincidunt. Risus turpis hac metus
          facilisi ut enim massa eu. Dolor suscipit sit velit massa adipiscing
          adipiscing vulputate feugiat turpis. Fames sed ut dignissim tincidunt
          metus. Morbi varius quis enim gravida.
        </Typography>
      </Box>
      <Image
        src={AboutUsImage}
        alt="Enterprise image"
        style={{ width: '100%', objectFit: 'cover' }}
      />
    </Box>
  );
}

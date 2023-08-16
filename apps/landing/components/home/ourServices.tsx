import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import ServiceCard from './serviceCard';
import Scrollbars from 'rc-scrollbars';

export interface ServiceCardInterface {
  name: string;
  message: string;
  image: string;
}

export default function OurServices() {
  const { formatMessage } = useIntl();

  const SERVICES: ServiceCardInterface[] = [
    {
      name: formatMessage({ id: 'immatriculation' }),
      message: formatMessage({ id: 'immatriculationServiceMessage' }),
      image: '/immatriculation.png',
    },
    {
      name: formatMessage({ id: 'lotissement' }),
      message: formatMessage({ id: 'lotissementServiceMessage' }),
      image: '/lotissement.png',
    },
    {
      name: formatMessage({ id: 'location' }),
      message: formatMessage({ id: 'locationServiceMessage' }),
      image: '/location.png',
    },
    {
      name: formatMessage({ id: 'accompagnement' }),
      message: formatMessage({ id: 'accompagnementServiceMessage' }),
      image: '/accompagnement.png',
    },
    {
      name: formatMessage({ id: 'topographie' }),
      message: formatMessage({ id: 'topographieServiceMessage' }),
      image: '/topographie.png',
    },
  ];
  return (
    <Box
      sx={{
        display: 'grid',
        rowGap: 2,
        gridTemplateRows: {
          mobile: 'auto 260px',
          desktop: 'auto 576px',
        },
      }}
    >
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {formatMessage({ id: 'ourServices' })}
      </Typography>

      <Scrollbars universal>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            columnGap: {
              desktop: 3,
              mobile: 1,
            },
          }}
        >
          {SERVICES.map((service, index) => (
            <ServiceCard service={service} key={index} position={index + 1} />
          ))}
        </Box>
      </Scrollbars>
    </Box>
  );
}

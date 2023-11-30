import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import ServiceCard from './serviceCard';

export interface ServiceCardInterface {
  name: string;
  message: string;
  image: string;
}

export default function OurServices({
  titleAlign = 'center',
}: {
  titleAlign?: 'left' | 'right' | 'center';
}) {
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

  const [activeServiceNumber, setActiveServiceNumber] = useState<number>(0);

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
      <Typography sx={{ textAlign: titleAlign }} variant="h4">
        {formatMessage({ id: 'ourServices' })}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
        }}
      >
        <Tooltip title={formatMessage({ id: 'previous' })}>
          <IconButton
            onClick={() =>
              setActiveServiceNumber((prev) => (prev === 0 ? 0 : prev - 1))
            }
          >
            <KeyboardArrowLeft />
          </IconButton>
        </Tooltip>
        <ServiceCard
          service={SERVICES[activeServiceNumber]}
          position={activeServiceNumber + 1}
        />

        <Tooltip title={formatMessage({ id: 'forward' })}>
          <IconButton
            onClick={() =>
              setActiveServiceNumber((prev) =>
                prev === SERVICES.length - 1 ? prev : prev + 1
              )
            }
          >
            <KeyboardArrowRight />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

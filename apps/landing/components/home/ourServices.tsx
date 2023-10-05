import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useIntl } from 'react-intl';
import ServiceCard from './serviceCard';
import { useRef, useState } from 'react';

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

  const serviceParent = useRef(null);
  const scrollContainerRef = useRef<Scrollbars>(null);
  const [activePosition, setActivePosition] = useState(1);
  const handleScrollButton = (direction: 'left' | 'right') => {
    const position =
      direction === 'right' ? activePosition + 1 : activePosition - 1;
    const scrollLength = position * 300;
    scrollContainerRef.current?.scrollLeft(scrollLength);
    const viewScrollLeft = scrollContainerRef.current.viewScrollLeft + 300;
    setActivePosition((pos) =>
      (direction === 'left' && scrollLength >= 0) ||
      (direction === 'right' && scrollLength <= viewScrollLeft)
        ? position
        : pos
    );
  };

  setInterval(() => {
    handleScrollButton('right');
  }, 3000);

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
          <IconButton onClick={() => handleScrollButton('left')}>
            <KeyboardArrowLeft />
          </IconButton>
        </Tooltip>
        <Scrollbars ref={scrollContainerRef} universal>
          <Box
            ref={serviceParent}
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
        <Tooltip title={formatMessage({ id: 'foward' })}>
          <IconButton onClick={() => handleScrollButton('right')}>
            <KeyboardArrowRight />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

import { Box, Typography } from '@mui/material';
import { NumberCircle } from './ourMissions';
import { ServiceCardInterface } from './ourServices';

export default function ServiceCard({
  service: { image, message, name },
  position,
}: {
  service: ServiceCardInterface;
  position: number;
}) {
  return (
    <Box
      sx={{
        background: `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5) ), url('${image}')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(60px)',
        display: 'grid',
        justifyItems: 'center',
        padding: {
          desktop: '8px 16px',
          mobile: '16px 32px',
        },
        minWidth: {
          desktop: '833px',
          mobile: '300px',
        },
        minHeight: { desktop: '556px', mobile: 'fit-content' },
        alignContent: 'center',
        color: 'white',
        rowGap: '22px',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: 1,
          alignItems: 'center',
        }}
      >
        <NumberCircle value={position} />
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              mobile: 'initial',
              desktop: '2.5rem',
            },
          }}
        >
          {name}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontSize: {
            mobile: '1rem',
            desktop: '1.25rem',
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}

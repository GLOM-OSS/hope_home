import { theme } from '@hopehome/theme';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

export function NumberCircle({ value }: { value: number }) {
  return (
    <Box
      sx={{
        borderRadius: '50%',
        padding: {
          desktop: '10px 21px',
          mobile: '3px 13px',
        },
        width: 'fit-content',
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        fontSize: {
          desktop: '1.5rem',
          mobile: '1.3rem',
        },
        fontWeight: 'bolder',
      }}
    >
      {value}
    </Box>
  );
}

function MissionItem({
  index,
  title,
  value,
}: {
  index: number;
  title: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: 1,
        alignItems: 'start',
      }}
    >
      <NumberCircle value={index} />
      <Box>
        <Typography variant="h5">{title}</Typography>
        <Typography
          variant="h6"
          fontWeight="400"
          sx={{
            fontSize: {
              desktop: theme.typography.h6.fontSize,
              mobile: '1.1rem',
            },
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function OurMissions() {
  const { formatMessage } = useIntl();

  const values: { title: string; value: string }[] = [
    {
      title: formatMessage({ id: 'missionTitle1' }),
      value: formatMessage({ id: 'mission1' }),
    },
    {
      title: formatMessage({ id: 'missionTitle2' }),
      value: formatMessage({ id: 'mission2' }),
    },
  ];
  return (
    <Box sx={{ display: 'grid', rowGap: 2 }}>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {formatMessage({ id: 'ourMissions' })}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          columnGap: 15,
          rowGap: 4,
          gridTemplateColumns: {
            desktop: 'auto auto',
            mobile: 'auto',
          },
        }}
      >
        {values.map(({ title, value }, index) => (
          <MissionItem
            index={index + 1}
            key={index}
            title={title}
            value={value}
          />
        ))}
      </Box>
    </Box>
  );
}

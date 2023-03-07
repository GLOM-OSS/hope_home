import { theme } from '@hopehome/theme';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function NumberCircle({ value }: { value: number }) {
  return (
    <Box
      sx={{
        borderRadius: '100%',
        padding: '10px 21px',
        width: 'fit-content',
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        fontSize: '1.5rem',
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
        <Typography variant="h6" fontWeight="400">
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
      title: 'Lorem Ipsum Dolor',
      value: `sit amet consectetur. In arcu risus vestibulum sollicitudin elit
        sed sed convallis tincidunt. Risus turpis hac metus facilisi ut
        enim massa eu. Dolor suscipit sit velit massa adipiscing
        adipiscing vulputate feugiat turpis. Fames sed ut dignissim
        tincidunt metus. Morbi varius quis enim gravida.`,
    },
    {
      title: 'Lorem Ipsum Dolor',
      value: `sit amet consectetur. In arcu risus vestibulum sollicitudin elit
        sed sed convallis tincidunt. Risus turpis hac metus facilisi ut
        enim massa eu. Dolor suscipit sit velit massa adipiscing
        adipiscing vulputate feugiat turpis. Fames sed ut dignissim
        tincidunt metus. Morbi varius quis enim gravida.`,
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

/* eslint-disable react/no-unescaped-entities */
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useIntl } from 'react-intl';

export default function Hello() {
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  return (
    <Box
      sx={{
        display: 'grid',
        justifySelf: 'center',
        gridTemplateRows: 'auto auto auto 1fr',
        justifyItems: 'center',
        rowGap: 2,
        height: '100vh',
        alignSelf: 'center',
        padding: '32px 7.1%',
        textAlign: 'justify',
      }}
    >
      <Typography variant="h4" textAlign={'center'}>
        {formatMessage({ id: 'pageNotFound' })}
      </Typography>
      <Typography textAlign={'center'}>
        {`${formatMessage({ id: '404Message1' })} `}
        <a onClick={() => push('/contact')} style={{ color: 'blue' }}>
          {formatMessage({ id: 'reportToSupport' })}
        </a>
        {` ${formatMessage({ id: '404Message2' })} `}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          justifySelf: 'center',
          justifyItems: 'center',
          columnGap: 1,
          gridAutoFlow: 'column',
          marginTop: 3,
        }}
      >
        <Button variant="contained" onClick={() => push('/')}>
          {formatMessage({ id: 'goHome' })}
        </Button>
      </Box>
    </Box>
  );
}

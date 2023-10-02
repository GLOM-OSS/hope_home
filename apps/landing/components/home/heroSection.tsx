import { theme } from '@hopehome/theme';
import { EastOutlined, SearchOutlined } from '@mui/icons-material';
import { Box, Button, lighten, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export default function HeroSection({
  searchHandler,
}: {
  searchHandler: (keywords: string) => void;
}) {
  const { formatMessage } = useIntl();
  const { push } = useRouter();

  const [keywords, setKeywords] = useState('');

  return (
    <Box
      sx={{
        height: '70vh',
        maxHeight: '600px',
        display: 'grid',
        rowGap: {
          desktop: theme.spacing(10),
          mobile: theme.spacing(5),
        },
        alignContent: 'center',
        position: 'relative',
        backgroundColor: theme.palette.primary.light,
        backgroundImage: `url('/hero_background.png')`,
        backgroundSize: 'cover',
      }}
    >
      <Box
        sx={{
          width: {
            mobile: '90%',
            desktop: '70%',
          },
          justifySelf: 'center',
          display: 'grid',
          rowGap: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            textAlign: 'center',
            color: 'white',
            fontSize: {
              mobile: '2rem',
              desktop: '3rem',
            },
          }}
        >
          {formatMessage({ id: 'discoverYourNewHome' })}
        </Typography>
        <Typography
          variant="h5"
          sx={{ textAlign: 'center', fontWeight: 300, color: 'white' }}
        >
          {formatMessage({ id: 'findYourPerfectHome' })}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder={formatMessage({ id: 'searchPlaceholder' })}
            sx={{ backgroundColor: 'white' }}
            color="primary"
            onChange={(e) => setKeywords(e.target.value)}
          />
          <Button
            startIcon={<SearchOutlined />}
            variant="contained"
            color="secondary"
            sx={{
              '& .MuiButton-startIcon': {
                // color:'white',
                margin: 0,
              },
            }}
            onClick={() => searchHandler(keywords)}
          />
        </Box>
      </Box>
      <Button
        color="primary"
        variant="contained"
        disableElevation
        endIcon={<EastOutlined />}
        sx={{ justifySelf: 'center', textTransform: 'none' }}
        size="large"
        onClick={() => push('/properties')}
      >
        {formatMessage({ id: 'shopNow' })}
      </Button>
      <Box
        sx={{
          bottom: 0,
          left: '50%',
          transform: 'translate(-50%, 50%)',
          position: 'absolute',
          padding: {
            desktop: '16px 32px',
            mobile: '8px 16px',
          },
          display: 'grid',
          justifyContent: 'center',
          alignContent: 'center',
          backgroundColor: lighten(theme.palette.primary.main, 0.8),
          borderRadius: 1,
        }}
      >
        <Typography variant="body2">
          {formatMessage({ id: 'feedbackStars' })}
        </Typography>
      </Box>
    </Box>
  );
}

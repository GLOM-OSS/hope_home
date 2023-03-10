import { theme } from '@hopehome/theme';
import { EastOutlined, SearchOutlined } from '@mui/icons-material';
import { Box, Button, lighten, TextField, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function HeroSection() {
  const { formatMessage } = useIntl();
  return (
    <Box
      style={{
        height: '70vh',
        display: 'grid',
        rowGap: theme.spacing(10),
        alignContent: 'center',
        position: 'relative',
        backgroundColor: theme.palette.primary.light,
        backgroundImage: `url('/hero_background.png')`,
        backgroundSize: 'cover',
      }}
    >
      <Box
        sx={{
          width: '70%',
          justifySelf: 'center',
          display: 'grid',
          rowGap: 2,
        }}
      >
        <Typography variant="h1" sx={{ textAlign: 'center', color: 'white' }}>
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
            placeholder="Mkolda, Yaoundé"
            sx={{ backgroundColor: 'white' }}
            color="primary"
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
      >
        {formatMessage({ id: 'shopNow' })}
      </Button>
      <Box
        sx={{
          bottom: 0,
          left: '50%',
          transform: 'translate(-50%, 50%)',
          position: 'absolute',
          padding: '16px 32px',
          display: 'grid',
          justifyContent: 'center',
          alignContent: 'center',
          backgroundColor: lighten(theme.palette.primary.main, 0.8),
          borderRadius: 1,
        }}
      >
        <Typography variant="body2">
          Positive Feedback ***** based on the recent 100+ reviews
        </Typography>
      </Box>
    </Box>
  );
}

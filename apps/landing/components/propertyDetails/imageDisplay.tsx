/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Typography,
  lighten,
} from '@mui/material';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { theme } from '@hopehome/theme';
import { MediaGrid } from './MediaGrid';
import { ImageDialog } from './ImageDialog';

export default function ImageDisplay({ images }: { images: string[] }) {
  const { formatMessage } = useIntl();
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);

  return (
    <>
      <ImageDialog
        handleClose={() => setIsImageDialogOpen(false)}
        images={images}
        open={isImageDialogOpen}
      />
      <Box
        sx={{
          cursor: 'pointer',
          backgroundColor: lighten(theme.palette.primary.main, 0.8),
          borderRadius: '10px',
        }}
        onClick={() => setIsImageDialogOpen(true)}
      >
        {images.length === 0 ? (
          <Typography
            sx={{ padding: '10px 3px', textAlign: 'center' }}
            variant="h5"
          >
            {formatMessage({ id: 'noImages' })}
          </Typography>
        ) : images.length === 1 ? (
          <MediaGrid src={images[0]} height={400} />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 0.4fr',
              columnGap: 1,
            }}
          >
            <MediaGrid src={images[0]} height={400} />
            {images.length === 2 ? (
              <MediaGrid src={images[1]} height={400} />
            ) : (
              <Box sx={{ display: 'grid', rowGap: 1 }}>
                <MediaGrid src={images[1]} height={195} />
                {images.length === 3 ? (
                  <MediaGrid src={images[2]} height={195} />
                ) : (
                  <Box sx={{ position: 'relative' }}>
                    <MediaGrid src={images[2]} height={195} />
                    <Box
                      sx={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#5858587a',
                        position: 'absolute',
                        top: 0,
                        display: 'grid',
                        alignItems: 'center',
                        justifyItems: 'center',
                        borderBottomRightRadius: '10px',
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="white"
                        sx={{
                          fontSize: {
                            desktop: theme.typography.h6.fontSize,
                            mobile: '1.1rem',
                          },
                        }}
                      >
                        {`+${images.length - 3}`}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}

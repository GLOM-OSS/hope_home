/* eslint-disable @next/next/no-img-element */
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
  CloseOutlined,
} from '@mui/icons-material';
import {
  Box,
  Dialog,
  IconButton,
  Tooltip,
  Typography,
  lighten,
} from '@mui/material';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { DialogTransition } from '../dialog-transition';
import { theme } from '@hopehome/theme';

function ImageDialog({
  handleClose,
  open,
  images,
}: {
  handleClose: () => void;
  open: boolean;
  images: string[];
}) {
  const { formatMessage } = useIntl();

  const [index, setIndex] = useState<number>(0);
  return (
    <Dialog
      TransitionComponent={DialogTransition}
      onClose={handleClose}
      open={open}
      fullScreen
      sx={{
        height: '100vh',
        '& .MuiPaper-root': {
          backgroundColor: '#5858587a',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'grid',
          alignItems: 'center',
        }}
      >
        <Tooltip arrow title={formatMessage({ id: 'close' })}>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              color: 'black',
            }}
          >
            <CloseOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        {index < images.length - 1 && (
          <Tooltip arrow title={formatMessage({ id: 'next' })}>
            <IconButton
              size="small"
              onClick={() => {
                if (index < images.length - 1)
                  setIndex((prevValue) => prevValue + 1);
              }}
              sx={{
                position: 'absolute',
                top: '50%',
                right: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                color: 'black',
              }}
            >
              <ArrowForwardIosOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {index > 0 && (
          <Tooltip arrow title={formatMessage({ id: 'next' })}>
            <IconButton
              size="small"
              onClick={() => {
                if (index > 0) setIndex((prevValue) => prevValue - 1);
              }}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                color: 'black',
              }}
            >
              <ArrowBackIosOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <img
          src={images[index]}
          alt={'property'}
          style={{ objectFit: 'contain', height: '100vh', width: '100%' }}
        />
      </Box>
    </Dialog>
  );
}

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
          <img
            src={images[0]}
            alt={'property'}
            width="100%"
            height={400}
            style={{
              objectFit: 'contain',
              borderRadius: '10px',
            }}
          />
        ) : images.length === 2 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 0.4fr',
              columnGap: 1,
            }}
          >
            <img
              src={images[0]}
              alt={'property'}
              width="100%"
              height={400}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = '/logo_green.png';
              }}
              style={{
                objectFit: 'contain',
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
              }}
            />
            <img
              src={images[1]}
              alt={'property'}
              width="100%"
              height={400}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = '/logo_green.png';
              }}
              style={{
                objectFit: 'contain',
                borderTopRightRadius: '10px',
                borderBottomRightRadius: '10px',
              }}
            />
          </Box>
        ) : images.length === 3 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 0.4fr',
              columnGap: 1,
            }}
          >
            <img
              src={images[0]}
              alt={'property'}
              width="100%"
              height={400}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = '/logo_green.png';
              }}
              style={{
                objectFit: 'contain',
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
              }}
            />
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              <img
                src={images[1]}
                alt={'property'}
                width="100%"
                height={190}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = '/logo_green.png';
                }}
                style={{
                  objectFit: 'contain',
                  borderTopRightRadius: '10px',
                }}
              />
              <img
                src={images[2]}
                alt={'property'}
                width="100%"
                height={190}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = '/logo_green.png';
                }}
                style={{
                  objectFit: 'contain',
                  borderBottomRightRadius: '10px',
                }}
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 0.4fr',
              columnGap: 1,
            }}
          >
            <img
              src={images[0]}
              alt={'property'}
              width="100%"
              height={400}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = '/logo_green.png';
              }}
              style={{
                objectFit: 'contain',
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
              }}
            />
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              <img
                src={images[1]}
                alt={'property'}
                width="100%"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = '/logo_green.png';
                }}
                height={190}
                style={{
                  objectFit: 'contain',
                  borderTopRightRadius: '10px',
                }}
              />
              <Box sx={{ position: 'relative' }}>
                <img
                  src={images[2]}
                  alt={'property'}
                  width="100%"
                  height={195}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = '/logo_green.png';
                  }}
                  style={{
                    objectFit: 'contain',
                    borderBottomRightRadius: '10px',
                  }}
                />
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
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

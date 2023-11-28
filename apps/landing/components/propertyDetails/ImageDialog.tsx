import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
  CloseOutlined
} from '@mui/icons-material';
import {
  Box,
  Dialog,
  IconButton,
  Tooltip
} from '@mui/material';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { DialogTransition } from '../dialog-transition';
import { MediaGrid } from './MediaGrid';

export function ImageDialog({
  handleClose, open, images,
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
          <Tooltip arrow title={formatMessage({ id: 'back' })}>
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
        <MediaGrid src={images[index]} objectFit="contain" height="100vh" />
      </Box>
    </Dialog>
  );
}

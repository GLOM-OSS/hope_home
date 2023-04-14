import { DeleteForeverOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { getPropertyImages } from '../../services/property.service';
import Image from 'next/image';
import Scrollbars from 'rc-scrollbars';
import { ChangeEvent, useState } from 'react';
import { useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { IImage } from '@hopehome/interfaces';

function useImages(property_id: string) {
  const [returnValue, setReturnValue] = useState<{
    isLoading: boolean;
    data: IImage[];
  }>({ isLoading: true, data: undefined });

  getPropertyImages(property_id)
    .then((images) => {
      setReturnValue({ data: images, isLoading: false });
    })
    .catch((error) => console.log(error));

  return returnValue;
}

function PropertyImage({
  image_ref: ref,
  index,
  onDelete,
}: {
  image_ref: string;
  index: number;
  onDelete: () => void;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box key={index} sx={{ position: 'relative' }}>
      <Tooltip arrow title={formatMessage({ id: 'delete' })}>
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            position: 'absolute',
            top: '5px',
            right: '5px',
          }}
        >
          <DeleteForeverOutlined color="error" />
        </IconButton>
      </Tooltip>
      <Image
        src={ref}
        alt={`image${index}`}
        width={230}
        height={250}
        style={{
          objectFit: 'cover',
          border: '1px solid black',
          padding: '0.5px',
          borderRadius: '8px',
        }}
      />
    </Box>
  );
}

export default function ImageDialog({
  isDialogOpen,
  closeDialog,
  property_id,
  handleSubmit,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  property_id: string;
  handleSubmit: (val: {
    removedImageIds: string[];
    toBeUploadedImages: File[];
  }) => void;
}) {
  const { formatMessage } = useIntl();
  const { isLoading, data } = useImages(property_id);

  function close() {
    setDisplayImages([]);
    setToBeUploadedImages([]);
    setRemovedImageIds([]);
    closeDialog();
  }

  const [displayImages, setDisplayImages] = useState<IImage[]>([]);
  const [toBeUploadedImages, setToBeUploadedImages] = useState<IImage[]>([]);

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const files = Object.keys(e.target.files);
    const tt: IImage[] = files.map((fileKey) => {
      return {
        image_id: uuidv4(),
        image_ref: e.target.files[fileKey] as File,
      };
    });
    const displayImgs = tt.map((file) => {
      const { image_id, image_ref } = file;
      return {
        image_id,
        image_ref: URL.createObjectURL(image_ref as File),
      };
    });

    setDisplayImages([...displayImages, ...displayImgs]);
    setToBeUploadedImages([...toBeUploadedImages, ...tt]);
  }

  function removeNewImage(image_id: string) {
    setDisplayImages(
      displayImages.filter(({ image_id: id }) => id !== image_id)
    );
    setToBeUploadedImages(
      toBeUploadedImages.filter(({ image_id: id }) => id !== image_id)
    );
  }

  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  return (
    <Dialog open={isDialogOpen} onClose={close}>
      <DialogTitle>{formatMessage({ id: 'managePropertyImages' })}</DialogTitle>
      <Box sx={{ padding: '8px 24px' }}>
        <Box sx={{ display: 'grid', rowGap: 1 }}>
          <Box sx={{ justifySelf: 'right' }}>
            <input
              accept="image/*"
              hidden
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleFileInput}
            />
            <label htmlFor="raised-button-file">
              <Button
                sx={{ textTransform: 'none', justifySelf: 'none' }}
                variant="contained"
                color="primary"
                size="small"
                component="span"
                disabled={isLoading || !data}
              >
                {formatMessage({ id: 'addImages' })}
              </Button>
            </label>
          </Box>
          <Box
            sx={{
              height: '280px',
              border: '0.5px dotted black',
              borderRadius: 1,
              padding: 1,
            }}
          >
            {!data ||
            (displayImages.length === 0 && data.length === 0) ||
            (displayImages.length === 0 &&
              data.length === removedImageIds.length) ? (
              <Typography>{formatMessage({ id: 'noNewImages' })}</Typography>
            ) : (
              <Scrollbars universal autoHide>
                <Box
                  sx={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    columnGap: 0.5,
                  }}
                >
                  {data.map(
                    ({ image_id: id, image_ref: ref }, index) =>
                      !removedImageIds.includes(id) && (
                        <PropertyImage
                          index={index}
                          key={index}
                          onDelete={() =>
                            setRemovedImageIds([...removedImageIds, id])
                          }
                          image_ref={ref as string}
                        />
                      )
                  )}
                  {displayImages.map(
                    ({ image_id: id, image_ref: ref }, index) => (
                      <PropertyImage
                        index={index}
                        key={index}
                        onDelete={() => removeNewImage(id)}
                        image_ref={ref as string}
                      />
                    )
                  )}
                </Box>
              </Scrollbars>
            )}
          </Box>
        </Box>
      </Box>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ textTransform: 'none' }}
          onClick={close}
        >
          {formatMessage({ id: 'cancel' })}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ textTransform: 'none' }}
          disabled={
            removedImageIds.length === 0 && toBeUploadedImages.length === 0
          }
          onClick={() => {
            handleSubmit({
              removedImageIds,
              toBeUploadedImages: toBeUploadedImages.map(
                ({ image_ref }) => image_ref as File
              ),
            });
            close();
          }}
        >
          {formatMessage({ id: 'save' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

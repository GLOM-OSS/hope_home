import { IHHProperty } from '@hopehome/interfaces';
import { theme } from '@hopehome/theme';
import {
  BathtubOutlined,
  ChairOutlined,
  Favorite,
  FavoriteBorder,
  MoreHorizOutlined,
  ReportRounded,
  ShareOutlined,
  SquareFootOutlined,
  WarningAmberOutlined,
  WhatsApp,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { ErrorMessage, useNotification } from '@hopehome/toast';
import { useState } from 'react';
import { ConfirmDialog } from '../confirmDialog';
import {
  deleteProperty,
  delistProperty,
  flagProperty,
  likeOrUnlike,
  updateProperty,
} from '../../services/property.service';
import { toast } from 'react-toastify';
import ImageDialog from './imageDialog';

export default function PropertyCard({
  property: {
    address,
    image_ref,
    property_type,
    price,
    listing_reason,
    house_details,
    area,
    is_liked,
    publisher_details: { whatsapp_number, fullname, profile_image_ref: pi_ref },
    property_id,
  },
  canDelete = false,
}: {
  property: IHHProperty;
  canDelete?: boolean;
}) {
  const { formatMessage, formatNumber } = useIntl();
  const { push } = useRouter();

  const [isLiked, setIsLiked] = useState<boolean>(is_liked);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState<boolean>(false);
  const [isConfirmDelistDialogOpen, setIsConfirmDelistDialogOpen] =
    useState<boolean>(false);

  function signalProperty(property_id: string) {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'signalingProperty',
      }),
    });
    flagProperty(property_id as string)
      .then(() => {
        notif.update({
          render: formatMessage({
            id: 'signaledPropertySuccessfully',
          }),
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => signalProperty(property_id)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'signalingPropertyFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  function delistPropertyHandler(property_id: string) {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'delistingProperty',
      }),
    });
    delistProperty(property_id)
      .then(() => {
        notif.update({
          render: formatMessage({
            id: 'delistPropertySuccessfully',
          }),
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => delistPropertyHandler(property_id)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'delistingPropertyFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  function deletePropertyHandler(property_id: string) {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'deletingProperty',
      }),
    });
    deleteProperty(property_id)
      .then(() => {
        notif.update({
          render: formatMessage({
            id: 'deletePropertySuccessfully',
          }),
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => deletePropertyHandler(property_id)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'deletingPropertyFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  const [isConfirmSignalDialogOpen, setIsConfirmSignalDialogOpen] =
    useState<boolean>(false);

  const handleLike = () => {
    likeOrUnlike(property_id as string)
      .then(() => setIsLiked(!isLiked))
      .catch((error) => {
        setIsLiked(isLiked);
        toast.error(error?.message || 'Something went wrong !');
      });
  };

  const handlePropertyClick = (
    type?: 'signal' | 'contact' | 'share' | 'like'
  ) => {
    switch (type) {
      case 'signal': {
        setIsConfirmSignalDialogOpen(true);
        break;
      }
      case 'contact': {
        push(
          `https://api.whatsapp.com/send/?phone=${whatsapp_number}&text=${encodeURIComponent(
            //TODO: use this message for the interestedInProperty below 'I saw your property on hope home and it interested me'
            formatMessage({ id: 'interestedInProperty' }) +
              `\n\nhttps://hopehome.ingl.io/${property_id}`
          )}`
        );
        break;
      }
      case 'share': {
        navigator.share({
          title: address,
          //TODO: use this message for the sharePropertyMessage below 'Checkout this cool property I found on HopeHome'
          text: formatMessage({ id: 'sharePropertyMessage' }),
          url: `https://hopehome.ingl.io/${property_id}`,
        });
        break;
      }
      case 'like': {
        handleLike();
        break;
      }
      default: {
        push(`/properties/${property_id}`);
        break;
      }
    }
  };

  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);

  const [isSubmittingImages, setIsSubmittingImages] = useState<boolean>(false);
  const [imageSubmissionNotif, setImageSubmissionNotif] =
    useState<useNotification>();

  function handleSubmitImages(val: {
    removedImageIds: string[];
    toBeUploadedImages: File[];
  }) {
    setIsSubmittingImages(true);
    const notif = new useNotification();
    if (imageSubmissionNotif) {
      imageSubmissionNotif.dismiss();
    }
    setImageSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'updatingPropertyImages',
      }),
    });
    updateProperty(
      property_id,
      { removedImageIds: val.removedImageIds },
      val.toBeUploadedImages
    )
      .then(() => {
        notif.update({
          render: formatMessage({
            id: 'saveImagesSuccessfully',
          }),
        });
        setImageSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => handleSubmitImages(val)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'savingImagesFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmittingImages(false));
  }

  return (
    <>
      <ImageDialog
        closeDialog={() => setIsImageDialogOpen(false)}
        isDialogOpen={isImageDialogOpen}
        property_id={property_id}
        handleSubmit={handleSubmitImages}
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmSignalDialogOpen(false)}
        confirm={() => signalProperty(property_id)}
        dialogMessage={formatMessage({
          id: 'confirmSignalPropertyDialogMessage',
        })}
        isDialogOpen={isConfirmSignalDialogOpen}
        confirmButton={formatMessage({ id: 'signal' })}
        danger
        dialogTitle={formatMessage({ id: 'confirmSignalProperty' })}
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmDeleteDialogOpen(false)}
        confirm={() => deletePropertyHandler(property_id)}
        dialogMessage={formatMessage({
          id: 'confirmDeletePropertyDialogMessage',
        })}
        isDialogOpen={isConfirmDeleteDialogOpen}
        confirmButton={formatMessage({ id: 'delete' })}
        danger
        dialogTitle={formatMessage({ id: 'confirmDeleteProperty' })}
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmDelistDialogOpen(false)}
        confirm={() => delistPropertyHandler(property_id)}
        dialogMessage={formatMessage({
          id: 'confirmDelistPropertyDialogMessage',
        })}
        isDialogOpen={isConfirmDelistDialogOpen}
        confirmButton={formatMessage({ id: 'delist' })}
        danger
        dialogTitle={formatMessage({ id: 'confirmDelistProperty' })}
      />
      <Menu
        anchorEl={moreMenuAnchorEl}
        open={moreMenuAnchorEl !== null}
        onClose={() => setMoreMenuAnchorEl(null)}
        sx={{
          '&.MuiList-root': {
            padding: 0,
          },
        }}
      >
        <MenuList dense>
          <MenuItem
            onClick={() => {
              setIsConfirmDelistDialogOpen(true);
              setMoreMenuAnchorEl(null);
            }}
          >
            {formatMessage({ id: 'delist' })}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsConfirmDeleteDialogOpen(true);
              setMoreMenuAnchorEl(null);
            }}
          >
            {formatMessage({ id: 'delete' })}
          </MenuItem>
          <MenuItem
            disabled={isSubmittingImages}
            onClick={() => {
              setIsImageDialogOpen(true);
              setMoreMenuAnchorEl(null);
            }}
          >
            {formatMessage({ id: 'manageImages' })}
          </MenuItem>
        </MenuList>
      </Menu>
      <Box
        component={Paper}
        elevation={1}
        sx={{ width: '350px' }}
        onClick={() => handlePropertyClick()}
      >
        <Box sx={{ position: 'relative' }}>
          <Image
            src={image_ref ?? '/location-icon.png'}
            alt={property_type}
            height={350}
            width={350}
            style={{
              objectFit: 'cover',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.21)',
              padding: '16px 8px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              alignItems: 'center',
              columnGap: 2,
            }}
          >
            <Avatar
              alt={fullname}
              src={pi_ref}
              sx={{ width: 56, height: 56 }}
            />
            <Typography
              variant="h6"
              sx={{
                width: '260px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {fullname}
            </Typography>
          </Box>
          {!canDelete && (
            <Checkbox
              color="error"
              icon={<FavoriteBorder fontSize="large" />}
              checkedIcon={<Favorite fontSize="large" />}
              onClick={(e) => {
                e.stopPropagation();
                handlePropertyClick('like');
              }}
              sx={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
              }}
            />
          )}
          <Box
            sx={{
              position: 'absolute',
              bottom: '20px',
              left: '10px',
              display: 'grid',
              rowGap: 2,
            }}
          >
            {!canDelete && (
              <>
                <Tooltip arrow title={formatMessage({ id: 'signalProperty' })}>
                  <IconButton
                    disabled={isSubmitting}
                    size="small"
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                    onClick={(event) => {
                      event.stopPropagation();
                      handlePropertyClick('signal');
                    }}
                  >
                    <WarningAmberOutlined color="warning" fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow title={formatMessage({ id: 'whatsappContact' })}>
                  <IconButton
                    size="small"
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                    onClick={(event) => {
                      event.stopPropagation();
                      handlePropertyClick('contact');
                    }}
                  >
                    <WhatsApp fontSize="large" color="primary" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip arrow title={formatMessage({ id: 'shareProperty' })}>
              <IconButton
                size="small"
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                onClick={(event) => {
                  event.stopPropagation();
                  handlePropertyClick('share');
                }}
              >
                <ShareOutlined fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box sx={{ padding: 2, display: 'grid', rowGap: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                columnGap: 1,
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  padding: '8px',
                  borderRadius: '4px',
                }}
              />
              <Typography>
                {formatMessage({
                  id:
                    property_type === 'Home'
                      ? house_details
                        ? house_details.house_type === 'Default'
                          ? 'singleFamilyHome'
                          : house_details.house_type === 'Hostel'
                          ? 'hostel'
                          : 'appartment'
                        : 'home'
                      : 'land',
                })}
              </Typography>
            </Box>

            {canDelete && (
              <Tooltip arrow title={formatMessage({ id: 'more' })}>
                <IconButton
                  size="small"
                  disabled={isSubmitting}
                  onClick={(event) => {
                    event.stopPropagation();
                    setMoreMenuAnchorEl(event.currentTarget);
                  }}
                >
                  <MoreHorizOutlined />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              columnGap: 2,
              alignItems: 'center',
            }}
          >
            <Typography variant="h5">
              {formatNumber(price, {
                style: 'currency',
                currency: 'XAF',
              })}
            </Typography>
            <Typography
              sx={{
                padding: '4px 8px',
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
                fontWeight: 300,
                color: 'white',
              }}
            >
              {formatMessage({
                id: listing_reason === 'Rent' ? 'forRent' : 'forSale',
              })}
            </Typography>
          </Box>
          <Typography variant="body2">
            {address.length > 87 ? `${address.slice(0, 87)}...` : address}
          </Typography>
          <Box sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 2 }}>
            {house_details && (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    columnGap: 0.5,
                    alignItems: 'end',
                  }}
                >
                  <BathtubOutlined />
                  <Typography variant="body2" fontWeight={500}>
                    {`${formatNumber(
                      house_details.number_of_baths
                    )}${formatMessage({ id: 'bathroomShort' })}`}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    columnGap: 0.5,
                    alignItems: 'end',
                    justifySelf: 'center',
                  }}
                >
                  <ChairOutlined />
                  <Typography variant="body2" fontWeight={500}>
                    {`${formatNumber(
                      house_details.number_of_rooms
                    )}${formatMessage({ id: 'roomsShort' })}`}
                  </Typography>
                </Box>
              </>
            )}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                columnGap: 0.5,
                alignItems: 'end',
                justifySelf: house_details ? 'end' : 'start',
              }}
            >
              <SquareFootOutlined />
              <Typography variant="body2" fontWeight={500}>
                {`${formatNumber(area)}${formatMessage({
                  id: 'squarefootShort',
                })}`}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

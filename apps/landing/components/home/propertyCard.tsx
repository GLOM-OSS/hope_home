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
import { Dispatch, SetStateAction, useState } from 'react';
import { ConfirmDialog } from '../confirmDialog';
import {
  deleteProperty,
  delistProperty,
  flagProperty,
  likeDislike,
  updateProperty,
} from '../../services/property.service';
import { toast } from 'react-toastify';
import ImageDialog from './imageDialog';
import { useUser } from '../../contexts/user.provider';

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
    is_listed,
    number_of_likes,
    publisher_details: {
      whatsapp_number,
      fullname,
      profile_image_ref: pi_ref,
      person_id: publisher_pid,
    },
    property_id,
  },
  setProperties,
  canManage = false,
}: {
  canManage?: boolean;
  property: IHHProperty;
  setProperties?: Dispatch<SetStateAction<IHHProperty[]>>;
}) {
  const { formatMessage, formatNumber } = useIntl();
  const { push } = useRouter();
  const {
    activeUser: { person_id },
  } = useUser();
  const canDelete = person_id === publisher_pid;

  const [isLiked, setIsLiked] = useState<boolean | null>(is_liked);
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
        if (setProperties)
          setProperties((properties) =>
            properties.map((property) =>
              property.property_id === property_id
                ? { ...property, is_listed: !property.is_listed }
                : property
            )
          );

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
        if (setProperties)
          setProperties((properties) =>
            properties.filter(
              (property) => property.property_id !== property_id
            )
          );
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
    likeDislike(property_id as string)
      .then(() => setIsLiked(!isLiked))
      .catch((error) =>
        toast.error(error?.message || 'Something went wrong !')
      );
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
            formatMessage({ id: 'interestedInProperty' }) +
              `\n\nhttps://hopehome.squoolr.com/properties/${property_id}`
          )}`
        );
        break;
      }
      case 'share': {
        navigator.share({
          title: address,
          text: formatMessage({ id: 'sharePropertyMessage' }),
          url: `https://hopehome.squoolr.com/properties/${property_id}`,
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
        id: 'savingPropertyImages',
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
        push(`/properties/${property_id}`);
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
          id: is_listed
            ? 'confirmDelistPropertyDialogMessage'
            : 'confirmListPropertyDialogMessage',
        })}
        isDialogOpen={isConfirmDelistDialogOpen}
        confirmButton={formatMessage({ id: is_listed ? 'delist' : 'list' })}
        danger
        dialogTitle={formatMessage({
          id: is_listed ? 'confirmDelistProperty' : 'confirmListProperty',
        })}
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
            {formatMessage({ id: is_listed ? 'delist' : 'list' })}
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
        sx={{
          width: {
            desktop: '350px',
            mobile: '307px',
          },
          cursor: is_listed ? 'pointer' : 'default',
        }}
        onClick={() => (is_listed ? handlePropertyClick() : {})}
      >
        <Box sx={{ position: 'relative' }}>
          <Image
            src={image_ref ?? '/location-icon.png'}
            className="property-image"
            alt={property_type}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/logo_green.png';
            }}
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
            {is_listed ? (
              <>
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
                    fontSize: {
                      desktop: theme.typography.h6.fontSize,
                      mobile: '1.1rem',
                    },
                  }}
                >
                  {fullname}
                </Typography>
              </>
            ) : (
              <Typography variant="h4" color="error">
                {formatMessage({ id: 'delist' })}
              </Typography>
            )}
          </Box>
          {!canDelete && isLiked !== null && (
            <Checkbox
              color="error"
              checked={isLiked}
              icon={
                <FavoriteBorder
                  sx={{
                    fontSize: {
                      desktop: '2.1875rem',
                      mobile: '1.5rem',
                    },
                  }}
                />
              }
              checkedIcon={
                <Favorite
                  sx={{
                    fontSize: {
                      desktop: '2.1875rem',
                      mobile: '1.5rem',
                    },
                  }}
                />
              }
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
                    <WarningAmberOutlined
                      color="warning"
                      sx={{
                        fontSize: {
                          desktop: '2.1875rem',
                          mobile: '1.5rem',
                        },
                      }}
                    />
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
                    <WhatsApp
                      sx={{
                        fontSize: {
                          desktop: '2.1875rem',
                          mobile: '1.5rem',
                        },
                      }}
                      color="primary"
                    />
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
                <ShareOutlined
                  sx={{
                    fontSize: {
                      desktop: '2.1875rem',
                      mobile: '1.5rem',
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box
          sx={{
            padding: 2,
            display: 'grid',
            rowGap: 2,
            width: {
              mobile: '307px',
              desktop: '350px',
            },
          }}
        >
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
                gridTemplateColumns: 'auto 1fr auto',
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
                        ? house_details.house_type
                        : 'Home'
                      : 'land',
                })}
              </Typography>
              <Typography
                component="span"
                letterSpacing={2}
                variant="caption"
                color="inherit"
              >
                {`${number_of_likes} like(s)`}
              </Typography>
            </Box>

            {canManage && canDelete && (
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
            <Typography
              variant="h5"
              sx={{
                fontSize: {
                  desktop: theme.typography.h5.fontSize,
                  mobile: '1.3rem',
                },
              }}
            >
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
                fontSize: {
                  desktop: theme.typography.body1.fontSize,
                  mobile: '0.85rem',
                },
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
            {property_type !== 'Land' && house_details && (
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
                justifySelf:
                  house_details && property_type !== 'Land' ? 'end' : 'start',
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

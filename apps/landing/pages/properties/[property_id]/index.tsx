import { IHHProperty, IPropertyDetails } from '@hopehome/interfaces';
import { MapDisplay } from '@hopehome/map-display';
import { theme } from '@hopehome/theme';
import { ErrorMessage, useNotification } from '@hopehome/toast';
import {
  BathtubOutlined,
  ChairOutlined,
  Favorite,
  ReportRounded,
  SquareFootOutlined,
  WarningAmberOutlined,
  WhatsApp,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Scrollbars from 'rc-scrollbars';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { ConfirmDialog } from '../../../components/confirmDialog';
import PropertyCard from '../../../components/home/propertyCard';
import ImageDisplay from '../../../components/propertyDetails/imageDisplay';
import { useUser } from '../../../contexts/user.provider';
import {
  flagProperty,
  getPropertyDetails,
} from '../../../services/property.service';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { property_id } = context.query;
    if (property_id.length === 36) {
      const propertyDetails = await getPropertyDetails(property_id.toString());
      return {
        props: { propertyDetails, similarProperties: [], nearbyProperties: [] },
      };
    }
  } catch (error) {
    return { notFound: true };
  }
};

export default function PropertyDetails({
  propertyDetails: {
    address,
    area,
    is_flagged,
    is_listed,
    number_of_likes,
    comments,
    description,
    image_refs,
    latitude,
    listing_reason,
    longitude,
    price,
    property_id,
    property_type,
    owner_whatsapp,
    publisher_details,
    house_details,
    created_at,
  },
  similarProperties,
  nearbyProperties,
}: {
  propertyDetails: IPropertyDetails;
  similarProperties: IHHProperty[];
  nearbyProperties: IHHProperty[];
}) {
  const { push } = useRouter();
  const { formatMessage, formatNumber, formatDate } = useIntl();
  const [isConfirmSignalDialogOpen, setIsConfirmSignalDialogOpen] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

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

  const {
    activeUser: { person_id },
  } = useUser();
  const isCreatedByActiveUser = !!person_id;

  return (
    <>
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
      <Box
        sx={{
          padding: `0 7.1% 7.1% 7.1%`,
          marginTop: 4,
          display: 'grid',
          rowGap: 3,
        }}
      >
        <ImageDisplay images={image_refs.map((_) => _.image_ref as string)} />
        <Box sx={{ padding: 2, display: 'grid', rowGap: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                desktop: '1fr auto',
                tablet: 'auto',
              },
              columnGap: 1,
              rowGap: 1,
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  columnGap: 1,
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                }}
              >
                <Box
                  sx={{
                    backgroundColor:
                      number_of_likes === 0
                        ? theme.palette.primary.main
                        : '#ffff',
                    border: `1px solid ${theme.palette.primary.main}`,
                    padding: number_of_likes === 0 ? '16px' : '4px',
                    borderRadius: '8px',
                  }}
                >
                  {number_of_likes > 0 && (
                    <Typography
                      component="span"
                      letterSpacing={2}
                      variant="body1"
                      color="primary"
                    >
                      {number_of_likes}
                      <Favorite fontSize="small" color="error" />
                    </Typography>
                  )}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: {
                      desktop: theme.typography.h6.fontSize,
                      mobile: '1.1rem',
                    },
                  }}
                >
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
              <Typography
                sx={{
                  padding: '4px 8px',
                  borderRadius: 1,
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: 300,
                  color: 'white',
                  width: 'fit-content',
                  justifySelf: 'end',
                }}
              >
                {formatMessage({
                  id: listing_reason === 'Rent' ? 'forRent' : 'forSale',
                })}
              </Typography>
            </Box>
            <Box sx={{ justifySelf: 'flex-end' }}>
              {is_flagged && (
                <Typography
                  sx={{
                    padding: '4px 8px',
                    borderRadius: 2,
                    backgroundColor: theme.palette.error.main,
                    fontWeight: 300,
                    color: 'white',
                  }}
                >
                  {formatMessage({
                    id: 'flagged',
                  })}
                </Typography>
              )}
              {!is_listed && (
                <Typography
                  sx={{
                    padding: '4px 8px',
                    borderRadius: 2,
                    backgroundColor: theme.palette.secondary.main,
                    fontWeight: 300,
                    color: 'white',
                  }}
                >
                  {formatMessage({
                    id: 'notListed',
                  })}
                </Typography>
              )}
            </Box>
          </Box>
          <Typography
            variant="h6"
            fontWeight="400"
            sx={{
              fontSize: {
                desktop: theme.typography.h6.fontSize,
                mobile: '1.1rem',
              },
            }}
          >
            {address}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                desktop: '1fr auto',
                table: '1fr',
              },
              columnGap: 5,
              rowGap: 2,
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', columnGap: 2 }}>
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
                    <BathtubOutlined fontSize="large" />
                    <Typography fontWeight={500}>
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
                    <ChairOutlined fontSize="large" />
                    <Typography fontWeight={500}>
                      {`${formatNumber(
                        house_details.number_of_rooms
                      )}${formatMessage({ id: 'roomsShort' })}`}
                    </Typography>
                  </Box>
                </>
              )}
              {
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    columnGap: 0.5,
                    alignItems: 'end',
                    justifySelf:
                      house_details && property_type !== 'Land'
                        ? 'end'
                        : 'start',
                  }}
                >
                  <SquareFootOutlined fontSize="large" />
                  <Typography fontWeight={500}>
                    {`${formatNumber(area)}m²`}
                  </Typography>
                </Box>
              }
            </Box>
            <Typography variant="h6">
              {`${formatMessage({ id: 'price' })}: ${formatNumber(price, {
                style: 'currency',
                currency: 'XAF',
              })}`}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'grid',
            rowGap: 2,
          }}
        >
          <Typography variant="h4" fontWeight={500}>
            {formatMessage({ id: 'localInformation' })}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 2,
              alignItems: 'center',
            }}
          >
            <Button variant="outlined" size="small" color="primary">
              {formatMessage({ id: 'map' })}
            </Button>
            <Typography variant="h4" fontWeight={500}>
              {formatMessage({ id: 'information' })}
            </Typography>
          </Box>
          {latitude !== null && longitude !== null && (
            <MapDisplay
              location={{ lat: latitude, lng: longitude }}
              zoomLevel={17}
            />
          )}
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={500}>
            {formatMessage({ id: 'description' })}
          </Typography>
          <Typography>{description}</Typography>
        </Box>
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Typography variant="h4" fontWeight={500}>
            {formatMessage({ id: 'publisher' })}
          </Typography>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe">
                {publisher_details.profile_image_ref ? (
                  <Image
                    src={publisher_details.profile_image_ref}
                    height={60}
                    width={60}
                    alt="publisher-profile-image"
                  />
                ) : (
                  `${publisher_details.fullname[0]}`
                )}
              </Avatar>
            }
            title={publisher_details.fullname}
            subheader={`${formatMessage({ id: 'joinedOn' })} ${formatDate(
              publisher_details.created_at,
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }
            )}`}
            action={
              isCreatedByActiveUser ? (
                ''
              ) : (
                <Tooltip arrow title={formatMessage({ id: 'whatsappContact' })}>
                  <IconButton
                    size="small"
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                    onClick={(event) => {
                      event.stopPropagation();
                      push(
                        `https://api.whatsapp.com/send/?phone=${
                          owner_whatsapp ?? publisher_details.whatsapp_number
                        }&text=${encodeURIComponent(
                          //TODO: use this message for the interestedInProperty below 'I saw your property on hope home and it interested me'
                          formatMessage({ id: 'interestedInProperty' }) +
                            `\n\nhttps://hopehome.app/${property_id}`
                        )}`
                      );
                    }}
                  >
                    <WhatsApp fontSize="large" color="primary" />
                  </IconButton>
                </Tooltip>
              )
            }
          />
          <Typography
            variant="body1"
            color="text.secondary"
            marginTop={1}
            fontWeight={500}
          >
            {`${formatMessage({ id: 'publishedOn' })} ${formatDate(created_at, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}`}
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            startIcon={<WarningAmberOutlined />}
            disableElevation
            onClick={() => setIsConfirmSignalDialogOpen(true)}
            disabled={isSubmitting}
            sx={{
              textTransform: 'none',
              justifySelf: 'right',
              textAlign: 'end',
            }}
          >
            {formatMessage({ id: 'signalProperty' })}
          </Button>
        </Box>
        {similarProperties.length > 0 && (
          <Box>
            <Typography variant="h4" fontWeight={500}>
              {formatMessage({ id: 'similarProperties' })}
            </Typography>
            <Scrollbars
              universal
              autoHide
              style={{ height: similarProperties.length > 0 ? '557px' : '0px' }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridAutoFlow: 'column',
                  justifyContent: {
                    desktop: 'center',
                    mobile: 'start',
                  },
                  columnGap: 2,
                  alignContent: 'center',
                }}
              >
                {similarProperties.map((property, index) => (
                  <PropertyCard property={property} key={index} />
                ))}
              </Box>
            </Scrollbars>
          </Box>
        )}
        {nearbyProperties.length > 0 && (
          <Box marginBottom={2}>
            <Typography variant="h4" fontWeight={500}>
              {formatMessage({ id: 'nearByProperties' })}
            </Typography>
            <Scrollbars
              universal
              autoHide
              style={{ height: nearbyProperties.length > 0 ? '557px' : '0px' }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridAutoFlow: 'column',
                  justifyContent: {
                    desktop: 'center',
                    mobile: 'start',
                  },
                  columnGap: 2,
                  alignContent: 'center',
                }}
              >
                {nearbyProperties.map((property, index) => (
                  <PropertyCard property={property} key={index} />
                ))}
              </Box>
            </Scrollbars>
          </Box>
        )}
      </Box>
    </>
  );
}

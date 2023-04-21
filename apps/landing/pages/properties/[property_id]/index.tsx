import { IHHProperty, IPropertyDetails } from '@hopehome/interfaces';
import { theme } from '@hopehome/theme';
import { ErrorMessage, useNotification } from '@hopehome/toast';
import {
  BathtubOutlined,
  ChairOutlined,
  ReportRounded,
  SquareFootOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';
import { Avatar, Box, Button, CardHeader, Typography } from '@mui/material';
import { ConfirmDialog } from '../../../components/confirmDialog';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { MapDisplay } from '@hopehome/map-display';
import Scrollbars from 'rc-scrollbars';
import PropertyCard from '../../../components/home/propertyCard';
import ImageDisplay from '../../../components/propertyDetails/imageDisplay';
import {
  flagProperty,
  getPropertyDetails,
} from '../../../services/property.service';
import { toast } from 'react-toastify';
import Image from 'next/image';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { property_id } = context.query;
  try {
    const propertyDetails = await getPropertyDetails(property_id as string);
    return {
      props: { propertyDetails, similarProperties: [], nearbyProperties: [] },
    };
  } catch (error) {
    toast.error(error.message || "Oops, une erreur s'est produite.");
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
    publisher_details,
    house_details,
  },
  similarProperties,
  nearbyProperties,
}: {
  propertyDetails: IPropertyDetails;
  similarProperties: IHHProperty[];
  nearbyProperties: IHHProperty[];
}) {
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
                gridTemplateColumns: 'auto auto 1fr',
                columnGap: 1,
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  padding: '16px',
                  borderRadius: '8px',
                }}
              />
              <Typography variant="h6">
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
              <Button
                color="secondary"
                variant="contained"
                startIcon={<WarningAmberOutlined />}
                disableElevation
                onClick={() => setIsConfirmSignalDialogOpen(true)}
                disabled={isSubmitting}
                sx={{ textTransform: 'none', justifySelf: 'start' }}
              >
                {formatMessage({ id: 'signalProperty' })}
              </Button>
            </Box>
            <Box>
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
              <Typography variant="body1">
                {`${number_of_likes} ${formatMessage({
                  id: 'likes',
                })}`}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                desktop: '1fr 0.7fr',
                table: '1fr',
              },
              columnGap: 5,
              rowGap: 2,
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="400">
                {address}
              </Typography>
              <Box
                sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 2 }}
              >
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
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    columnGap: 0.5,
                    alignItems: 'end',
                    justifySelf: house_details ? 'end' : 'start',
                  }}
                >
                  <SquareFootOutlined fontSize="large" />
                  <Typography fontWeight={500}>
                    {`${formatNumber(area)}${formatMessage({
                      id: 'squarefootShort',
                    })}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                rowGap: 2,
                justifyItems: 'start',
                alignContent: 'center',
                justifySelf: 'end',
              }}
            >
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
              <Typography variant="h5">
                {formatNumber(price, {
                  style: 'currency',
                  currency: 'XAF',
                })}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
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
              {formatMessage({ id: 'localInformation' })}
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
        <Box>
          <Typography variant="h4" fontWeight={500}>
            {formatMessage({ id: 'publisher' })}
          </Typography>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe">
                {publisher_details.profile_image_ref ? (
                  <Image
                    src={publisher_details.profile_image_ref}
                    alt={'publisher-profile-image'}
                  />
                ) : (
                  `${publisher_details.fullname[0]}`
                )}
              </Avatar>
            }
            title={`${publisher_details.fullname}, ${publisher_details.whatsapp_number}`}
            subheader={`Join on the ${formatDate(publisher_details.created_at, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}`}
          />
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

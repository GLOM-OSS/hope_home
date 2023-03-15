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
import { Box, Button, Typography } from '@mui/material';
import { ConfirmDialog } from '../../../components/confirmDialog';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { MapDisplay } from '@hopehome/map-display';
import Scrollbars from 'rc-scrollbars';
import PropertyCard from '../../../components/home/propertyCard';
import ImageDisplay from '../../../components/propertyDetails/imageDisplay';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { property_id } = context.query;
  //   try {
  // TODO: LOAD PROPERTY details here with data property_id
  const propertyDetails: IPropertyDetails = {
    address:
      'Rue de Palmiers Nkolmesseng - Yaounde Rue de Palmiers Nkolmesseng - Yaounde',
    area: 900,
    description:
      'Hi, original neighborhood photos, resident re, original neighborhood photos, resident.,Hi, original neighborhood photos, resident re, original neighborhood photos, resident. In arcu risus vestibulum sollicitudin elit sed sed convallis tincidunt. Risus turpis hac metus facilisi ut enim massa eu. Dolor suscipit sit velit massa adipiscing adipiscing vulputate feugiat turpis. Fames sed ut dignissim tincidunt metus. Morbi varius quis enim gravida.',
    image_refs: [
      '/hero_background.png',
      '/logo_green.png',
      '/favicon_green.png',
      '/about_us.png',
    ],
    latitude: 0,
    listing_reason: 'Rent',
    longitude: 0,
    price: 500000,
    property_id: 'make_it_rain',
    property_type: 'Home',
    publisher_details: {
      created_at: new Date().getTime(),
      email: '',
      fullname: 'Kimbi Boston Tanyi',
      person_id: 'soekls',
      preferred_lang: 'en',
      roles: [],
      whatsapp_number: '237657140183',
      gender: 'Male',
      phone_number: '237657140183',
      profile_image_ref: '/logo.png',
    },
    comments: [],
  };
  return {
    props: { propertyDetails, similarProperties: [], nearbyProperties: [] },
  };
  //   catch (error) {
  //     return { notFound: true };
  //   }
};

export default function PropertyDetails({
  propertyDetails: {
    address,
    area,
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
  const { formatMessage, formatNumber } = useIntl();
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
    setTimeout(() => {
      //TODO: CALL API HERE TO signal property with data property_id
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        setIsSubmitting(false);
        notif.update({
          render: formatMessage({
            id: 'signaledPropertySuccessfully',
          }),
        });
        setSubmissionNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => signalProperty(property_id)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({
                id: 'signalingPropertyFailed',
              })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
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
      <Box sx={{ padding: `0 7.1%`, marginTop: 4, display: 'grid', rowGap: 3 }}>
        <ImageDisplay images={image_refs} />
        <Box sx={{ padding: 2, display: 'grid', rowGap: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                desktop: 'auto 1fr',
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
                gridTemplateColumns: 'auto 1fr',
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
                        ? house_details.type === 'Default'
                          ? 'singleFamilyHome'
                          : house_details.type === 'Hostel'
                          ? 'hostel'
                          : 'appartment'
                        : 'home'
                      : 'land',
                })}
              </Typography>
            </Box>
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
          <MapDisplay
            location={{ lat: latitude, lng: longitude }}
            zoomLevel={17}
          />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={500}>
            {formatMessage({ id: 'description' })}
          </Typography>
          <Typography>{description}</Typography>
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={500}>
            {formatMessage({ id: 'similarProperties' })}
          </Typography>
          <Scrollbars
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
        <Box marginBottom={2}>
          <Typography variant="h4" fontWeight={500}>
            {formatMessage({ id: 'nearByProperties' })}
          </Typography>
          <Scrollbars
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
              {nearbyProperties.map((property, index) => (
                <PropertyCard property={property} key={index} />
              ))}
            </Box>
          </Scrollbars>{' '}
        </Box>
      </Box>
    </>
  );
}

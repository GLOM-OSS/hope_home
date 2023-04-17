import { ICreateNewProperty, IHHProperty } from '@hopehome/interfaces';
import { ErrorMessage, useNotification } from '@hopehome/toast';
import { ReportRounded } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import PropertyCard from '../../../components/home/propertyCard';
import Navbar from '../../../components/navbar/secondary_nav/navbar';
import NewPropertyDialog from '../../../components/properties/createPropertyDialog';
import {
  createNewProperty,
  getProperties,
} from '../../../services/property.service';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const properties = await getProperties();
    return {
      props: {
        properties,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default function Properties({
  properties,
}: {
  properties: IHHProperty[];
}) {
  const { formatMessage } = useIntl();

  const [isNewPropertyDialogOpen, setIsNewPropertyDialogOpen] =
    useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  const createNewPropertyHandler = (property: ICreateNewProperty) => {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'creatingProperty',
      }),
    });
    createNewProperty(property)
      .then(() => {
        notif.update({
          render: formatMessage({
            id: 'createdPropertySuccessfully',
          }),
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createNewPropertyHandler(property)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'creatingPropertyFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <NewPropertyDialog
        handleSubmit={createNewPropertyHandler}
        open={isNewPropertyDialogOpen}
        closeDialog={() => setIsNewPropertyDialogOpen(false)}
      />
      <Box sx={{ mt: 4, padding: `0 7.1%`, mb: 2, display: 'grid', rowGap: 2 }}>
        <Navbar active="my-properties" />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">
            {formatMessage({ id: 'myPostedProperties' })}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ textTransform: 'none' }}
            onClick={() => setIsNewPropertyDialogOpen(true)}
            disabled={isSubmitting}
          >
            {formatMessage({ id: 'newPost' })}
          </Button>
        </Box>
        <Box
          sx={{
            display: 'grid',
            justifyItems: 'start',
            justifyContent: 'center',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 350px))',
            columnGap: 2,
            rowGap: 2,
          }}
        >
          {properties.map((property, index) => (
            <PropertyCard
              property={property as IHHProperty}
              key={index}
              canDelete
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

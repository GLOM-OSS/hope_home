import { ICreateNewProperty, IHHProperty } from '@hopehome/interfaces';
import { ErrorMessage, useNotification } from '@hopehome/toast';
import { Add, ReportRounded } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropertyCard from '../../../components/home/propertyCard';
import Navbar from '../../../components/navbar/secondary_nav/navbar';
import NewPropertyDialog from '../../../components/properties/createPropertyDialog';
import { useUser } from '../../../contexts/user.provider';
import {
  createNewProperty,
  getProperties,
} from '../../../services/property.service';

export const getServerSideProps: GetServerSideProps = async ({
  req: { headers },
}) => {
  try {
    const properties = await getProperties({ is_owner: true }, headers.cookie);
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
  properties: loadedProperties,
}: {
  properties: IHHProperty[];
}) {
  const { formatMessage } = useIntl();
  const {
    activeUser: { person_id },
  } = useUser();

  const [isNewPropertyDialogOpen, setIsNewPropertyDialogOpen] =
    useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  const [properties, setProperties] = useState(loadedProperties);

  const createNewPropertyHandler = (
    property: ICreateNewProperty,
    callback?: () => void
  ) => {
    console.log(property);
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
    //TODO replace the empty array by the files array
    createNewProperty(property, [])
      .then((property) => {
        notif.update({
          render: formatMessage({
            id: 'createdPropertySuccessfully',
          }),
        });
        if (callback) callback();
        setSubmissionNotif(undefined);
        setIsNewPropertyDialogOpen(false);
        setProperties((properties) => [...properties, property]);
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

  const {
    activeUser: { person_id: p_id },
  } = useUser();
  const { push } = useRouter();
  useEffect(() => {
    if (!p_id) push('/properties');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NewPropertyDialog
        handleSubmit={createNewPropertyHandler}
        open={isNewPropertyDialogOpen}
        closeDialog={() => setIsNewPropertyDialogOpen(false)}
      />
      <Box
        sx={{
          mt: 4,
          padding: 2,
          mb: 2,
          display: 'grid',
          rowGap: 2,
        }}
      >
        <Navbar active="/properties/my-properties" />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: 2,
            alignItems: 'center',
            justifyContent: 'center',
            padding: {
              tablet: '0 15%',
            },
          }}
        >
          <Typography variant="h6">
            {formatMessage({ id: 'myProperties' })}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ textTransform: 'none' }}
            onClick={() => setIsNewPropertyDialogOpen(true)}
            disabled={isSubmitting}
          >
            <Add />
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
          {properties
            .filter((_) => _.publisher_details.person_id === person_id)
            .map((property, index) => (
              <PropertyCard
                property={property as IHHProperty}
                setProperties={setProperties}
                key={index}
                canManage
              />
            ))}
        </Box>
      </Box>
    </>
  );
}

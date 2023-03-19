import { theme } from '@hopehome/theme';
import { ErrorMessage, useNotification } from '@hopehome/toast';
import { EastOutlined, EmailRounded, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { ConfirmDialog } from '../../components/confirmDialog';
import { resetPassword } from '../../services/auth.service';

interface IResetPassword {
  email: string;
}

export default function ForgotPassword() {
  const { formatMessage } = useIntl();

  const initialValues: IResetPassword = {
    email: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
  });

  const [isConfirmResetDialogOpen, setIsConfirmResetDialogOpen] =
    useState<boolean>(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      setIsConfirmResetDialogOpen(true);
    },
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function resetPasswordHandler(values: IResetPassword) {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'resettingPassword',
      }),
    });
    resetPassword(values.email)
      .then(() => {
        notif.update({
          render: formatMessage({
            id: 'passwordResetSuccessfull',
          }),
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => resetPasswordHandler(values)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'passwordResetFailed',
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

  const { push } = useRouter();

  return (
    <>
      <ConfirmDialog
        closeDialog={() => setIsConfirmResetDialogOpen(false)}
        confirm={() => {
          resetPasswordHandler(formik.values);
          formik.resetForm();
        }}
        dialogMessage={formatMessage({ id: 'confirmResetPasswordMessage' })}
        isDialogOpen={isConfirmResetDialogOpen}
        confirmButton={formatMessage({ id: 'resetPassword' })}
        dialogTitle={formatMessage({ id: 'confirmResetPassword' })}
        danger
      />
      <Box
        sx={{
          padding: `0 7.1%`,
          marginTop: 4,
          mb: 4,
          display: 'grid',
          rowGap: 3,
        }}
      >
        <Box>
          <Typography variant="h4" textAlign={'center'}>
            {formatMessage({ id: 'resetPassword' })}
          </Typography>
          <Typography textAlign={'center'}>
            {formatMessage({ id: 'resetPasswordMessage' })}
          </Typography>
        </Box>

        <Box
          component="form"
          sx={{
            justifySelf: 'center',
            width: {
              desktop: '25vw',
              tablet: 'initial',
            },
          }}
          onSubmit={formik.handleSubmit}
        >
          <TextField
            fullWidth
            required
            autoFocus
            label={formatMessage({ id: 'email' })}
            placeholder={formatMessage({ id: 'enterEmail' })}
            variant="standard"
            type="email"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            {...formik.getFieldProps('email')}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailRounded color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Typography
            variant="body2"
            onClick={() => push('/signin')}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': { color: theme.palette.primary.dark },
              cursor: 'pointer',
            }}
          >
            {formatMessage({ id: 'signinInstead' })}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={isSubmitting || formik.values.email === ''}
            sx={{ marginTop: 6.25, textTransform: 'none' }}
            endIcon={<EastOutlined />}
          >
            {formatMessage({ id: 'reset' })}
          </Button>
        </Box>
        <Typography textAlign={'center'}>
          {formatMessage({ id: 'dontHaveAnAccount' }) + ' '}
          <Typography
            component="span"
            onClick={() => push('/signup')}
            sx={{
              color: theme.palette.primary.main,
              cursor: 'pointer',
              '&:hover': {
                color: theme.palette.primary.dark,
              },
            }}
            color={theme.palette.primary.main}
          >
            {formatMessage({ id: 'signUp' })}
          </Typography>
        </Typography>
      </Box>
    </>
  );
}

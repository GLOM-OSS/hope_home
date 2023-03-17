import { useState } from 'react';
import {
  EastOutlined,
  EmailRounded,
  Google,
  LockPersonRounded,
  ReportRounded,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { theme } from '@hopehome/theme';
import { ErrorMessage, useNotification } from '@hopehome/toast';
import { useRouter } from 'next/router';

interface ISignin {
  email: string;
  password: string;
}

export default function Signin() {
  const { formatMessage } = useIntl();

  const initialValues: ISignin = {
    email: '',
    password: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      signUserIn(values);
      resetForm();
    },
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function signUserIn(values: ISignin) {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'signingIn',
      }),
    });
    setTimeout(() => {
      //TODO: CALL API HERE TO sign in
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        setIsSubmitting(false);
        notif.update({
          render: formatMessage({
            id: 'signInSuccessfull',
          }),
        });
        setSubmissionNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => signUserIn(values)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({
                id: 'signInFailed',
              })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  }

  const { push } = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
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
          {formatMessage({ id: 'welcomeBack' })}
        </Typography>
        <Typography textAlign={'center'}>
          {formatMessage({ id: 'welcomeMessage' })}
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="large"
        startIcon={<Google />}
        sx={{
          borderRadius: '32px',
          textTransform: 'none',
          justifySelf: 'center',
        }}
      >
        {formatMessage({ id: 'loginWithGoogle' })}
      </Button>

      <Box
        component="form"
        sx={{ justifySelf: 'center' }}
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
        <TextField
          fullWidth
          required
          label={formatMessage({ id: 'password' })}
          placeholder={formatMessage({ id: 'enterPassword' })}
          variant="standard"
          type={showPassword ? 'text' : 'password'}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          {...formik.getFieldProps('password')}
          disabled={isSubmitting}
          sx={{ marginTop: theme.spacing(3.125) }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockPersonRounded color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <Tooltip
                arrow
                title={formatMessage({
                  id: showPassword ? 'hidePassword' : 'showPassword',
                })}
              >
                <IconButton
                  size="small"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <VisibilityOffOutlined />
                  ) : (
                    <VisibilityOutlined />
                  )}
                </IconButton>
              </Tooltip>
            ),
          }}
        />
        <Typography
          variant="body2"
          onClick={() => push('/forgot-password')}
          sx={{
            color: theme.palette.primary.main,
            '&:hover': { color: theme.palette.primary.dark },
            cursor: 'pointer',
            textAlign: 'end',
          }}
        >
          {formatMessage({ id: 'forgotPassword' })}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={
            isSubmitting ||
            formik.values.password === '' ||
            formik.values.email === ''
          }
          sx={{ marginTop: 6.25, textTransform: 'none' }}
          endIcon={<EastOutlined />}
        >
          {formatMessage({ id: 'signin' })}
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
  );
}

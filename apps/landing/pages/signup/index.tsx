import { ISignup } from '@hopehome/interfaces';
import { theme } from '@hopehome/theme';
import { ErrorMessage, useNotification } from '@hopehome/toast';
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
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { signUp, verifyCredential } from '../../services/auth.service';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useUser } from 'apps/landing/contexts/user.provider';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import AdditionalDataDialog from 'apps/landing/components/profile/additionalDataDialog';

export default function Signup() {
  const { formatMessage } = useIntl();

  const initialValues: ISignup = {
    email: '',
    password: '',
    fullname: '',
    gender: 'Male',
    phone_number: '',
    whatsapp_number: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    fullname: Yup.string().required(),
    gender: Yup.string().matches(/^Male$|^Female$/gm),
    phone_number: Yup.string().matches(
      /^(6|2)(2|3|[5-9])[0-9]{7}$/gm,
      '(6|2) (2|3|[5-9])x xxx xxx'
    ),
    whatsapp_number: Yup.string().matches(
      /^(6|2)(2|3|[5-9])[0-9]{7}$/gm,
      '(6|2) (2|3|[5-9])x xxx xxx'
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      signUserUp(values);
      resetForm();
    },
  });

  const { userDispatch } = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function signUserUp(values: ISignup) {
    const submitValues: ISignup = {
      ...values,
      phone_number: `237${values.phone_number}`,
      whatsapp_number: `237${values.whatsapp_number}`,
    };
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'creatingAccount',
      }),
    });

    signUp(submitValues)
      .then((user) => {
        notif.update({
          render: formatMessage({
            id: 'accountCreationSuccessfull',
          }),
        });
        userDispatch({ type: 'LOAD_USER', payload: user });
        setSubmissionNotif(undefined);
        push('/');
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => signUserUp(values)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'accountCreationFailed',
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

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>();
  const [isAdditionalDataDialogOpen, setIsAdditionalDataDialogOpen] =
    useState(false);
  const loginHandler = useGoogleLogin({
    onSuccess(tokenResponse) {
      console.log(tokenResponse);
      setAccessToken(tokenResponse.access_token);
      setIsAdditionalDataDialogOpen(true);
    },
    onError(errorResponse) {
      toast.error(errorResponse.error_description);
    },
  });
  const finalizeLogin = (values: { whatsapp_number: string }) => {
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
    verifyCredential(accessToken, values.whatsapp_number)
      .then((user) => {
        notif.update({
          render: formatMessage({
            id: 'accountCreationSuccessfull',
          }),
        });
        userDispatch({ type: 'LOAD_USER', payload: user });
        setSubmissionNotif(undefined);
        push('/');
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => finalizeLogin(values)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'accountCreationFailed',
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
    <Box
      sx={{
        padding: `0 7.1%`,
        marginTop: 4,
        mb: 4,
        display: 'grid',
        rowGap: 3,
      }}
    >
      <AdditionalDataDialog
        open={isAdditionalDataDialogOpen}
        closeDialog={() => setIsAdditionalDataDialogOpen(false)}
        submitDialog={finalizeLogin}
      />
      <Box>
        <Typography variant="h4" textAlign={'center'}>
          {formatMessage({ id: 'createHopeHomeAccount' })}
        </Typography>
        <Typography textAlign={'center'}>
          {formatMessage({ id: 'createAccountMessage' })}
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
        onClick={() => loginHandler()}
      >
        {formatMessage({ id: 'signupWithGoogle' })}
      </Button>

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
          label={formatMessage({ id: 'fullname' })}
          placeholder={formatMessage({ id: 'enterFullname' })}
          variant="standard"
          error={formik.touched.fullname && Boolean(formik.errors.fullname)}
          helperText={formik.touched.fullname && formik.errors.fullname}
          {...formik.getFieldProps('fullname')}
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          required
          label={formatMessage({ id: 'email' })}
          placeholder={formatMessage({ id: 'enterEmail' })}
          variant="standard"
          type="email"
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          {...formik.getFieldProps('email')}
          disabled={isSubmitting}
          sx={{ marginTop: theme.spacing(3.125) }}
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
        <TextField
          fullWidth
          required
          label={formatMessage({ id: 'phoneNumber' })}
          placeholder={formatMessage({ id: 'enterPhoneNumber' })}
          variant="standard"
          error={
            formik.touched.phone_number && Boolean(formik.errors.phone_number)
          }
          helperText={formik.touched.phone_number && formik.errors.phone_number}
          {...formik.getFieldProps('phone_number')}
          disabled={isSubmitting}
          sx={{ marginTop: theme.spacing(3.125) }}
          InputProps={{
            startAdornment: <Typography mr={0.5}>237</Typography>,
          }}
        />
        <TextField
          fullWidth
          required
          label={formatMessage({ id: 'whatsappNumber' })}
          placeholder={formatMessage({ id: 'enterWhatsappNumber' })}
          variant="standard"
          error={
            formik.touched.whatsapp_number &&
            Boolean(formik.errors.whatsapp_number)
          }
          helperText={
            formik.touched.whatsapp_number && formik.errors.whatsapp_number
          }
          {...formik.getFieldProps('whatsapp_number')}
          disabled={isSubmitting}
          sx={{ marginTop: theme.spacing(3.125) }}
          InputProps={{
            startAdornment: <Typography mr={0.5}>237</Typography>,
          }}
        />
        <FormControl
          required
          error={formik.touched.gender && Boolean(formik.errors.gender)}
          sx={{ marginTop: theme.spacing(3.125) }}
        >
          <FormLabel>{formatMessage({ id: 'gender' })}</FormLabel>
          <RadioGroup row {...formik.getFieldProps('gender')}>
            <FormControlLabel
              value="Female"
              control={<Radio />}
              label={formatMessage({ id: 'female' })}
            />
            <FormControlLabel
              value="Male"
              control={<Radio />}
              label={formatMessage({ id: 'male' })}
            />
          </RadioGroup>
        </FormControl>

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={
            isSubmitting ||
            formik.values.password === '' ||
            formik.values.email === '' ||
            formik.values.fullname === '' ||
            formik.values.phone_number === '' ||
            formik.values.whatsapp_number === ''
          }
          sx={{ marginTop: 6.25, textTransform: 'none' }}
          endIcon={<EastOutlined />}
        >
          {formatMessage({ id: 'signup' })}
        </Button>
      </Box>
      <Typography textAlign={'center'}>
        {formatMessage({ id: 'alreadyHaveAnAccount' }) + ' '}
        <Typography
          component="span"
          onClick={() => push('/signin')}
          sx={{
            color: theme.palette.primary.main,
            cursor: 'pointer',
            '&:hover': {
              color: theme.palette.primary.dark,
            },
          }}
          color={theme.palette.primary.main}
        >
          {formatMessage({ id: 'signinInstead' })}
        </Typography>
      </Typography>
    </Box>
  );
}

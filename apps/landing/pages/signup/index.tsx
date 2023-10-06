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
import { useGoogleLogin } from '@react-oauth/google';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useUser } from '../../contexts/user.provider';
import { signUp, verifyCredential } from '../../services/auth.service';
import { PhoneNumberTextField } from '../../components/phoneNumberTextField';

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
    phone_number: Yup.string().required(),
    whatsapp_number: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      signUserUp(values);
    },
  });

  const { userDispatch } = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function signUserUp(values: ISignup) {
    const submitValues: ISignup = {
      ...values,
      phone_number: `+${values.phone_number}`,
      whatsapp_number: `+${values.whatsapp_number}`,
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
  const loginHandler = useGoogleLogin({
    onSuccess(tokenResponse) {
      finalizeLogin(tokenResponse.access_token);
    },
    onError(errorResponse) {
      toast.error(errorResponse.error_description);
    },
  });
  const finalizeLogin = (accessToken: string) => {
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
    verifyCredential(accessToken)
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
              retryFunction={() => finalizeLogin(accessToken)}
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
            desktop: '50vw',
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
        <Box sx={{ marginTop: '25px' }}>
          <PhoneNumberTextField
            formik={formik}
            field="phone_number"
            label={formatMessage({ id: 'phoneNumber' })}
            placeholder={formatMessage({ id: 'enterPhoneNumber' })}
            style={{ border: 'none', borderBottom: '1px solid grey' }}
          />
        </Box>
        <Box sx={{ marginTop: '25px' }}>
          <PhoneNumberTextField
            formik={formik}
            field="whatsapp_number"
            label={formatMessage({ id: 'whatsappNumber' })}
            placeholder={formatMessage({ id: 'enterWhatsappNumber' })}
            style={{ border: 'none', borderBottom: '1px solid grey' }}
          />
        </Box>
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
        {formatMessage({ id: 'alreadyHaveAnAccount' })}
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
